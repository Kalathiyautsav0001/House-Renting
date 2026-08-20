import express from "express";
import House from "../models/House.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { cloudinary, upload } from "../config/cloudinary.js";
import Subscription from "../models/Subscription.js";
import { sendListingNotification } from "../utils/emailService.js";

const router = express.Router();

// ── PUBLIC: Get all houses ───────────────────────────────────────────────────
router.get("/", async (req, res) => {
  try {
    const houses = await House.find({
      isPublic: { $ne: false },
      adminHidden: { $ne: true },
    }).populate("owner", "name email mobile");
    res.json(houses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── DEBUG: Check Cloudinary Env ──────────────────────────────────────────────
router.get("/debug-env", (req, res) => {
  res.json({
    cloud_name_set: !!process.env.CLOUDINARY_CLOUD_NAME,
    api_key_set: !!process.env.CLOUDINARY_API_KEY,
    api_secret_set: !!process.env.CLOUDINARY_API_SECRET,
    mongo_set: !!process.env.MONGO_URI
  });
});

// ── ADMIN: Get all houses including hidden ───────────────────────────────────
router.get("/admin/all", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }
    const houses = await House.find().populate("owner", "name email mobile");
    res.json(houses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── ADMIN: Toggle adminHidden ────────────────────────────────────────────────
router.put("/admin/toggle-hide/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }
    const house = await House.findById(req.params.id);
    if (!house) return res.status(404).json({ message: "House not found" });
    house.adminHidden = !house.adminHidden;
    await house.save();
    res.json(house);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Get random 3 houses for Similar Properties ───────────────────────────────
router.get("/random/3", async (req, res) => {
  try {
    const houses = await House.aggregate([
      { $match: { isPublic: { $ne: false }, adminHidden: { $ne: true } } },
      { $sample: { size: 3 } },
    ]);
    res.json(houses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── PRIVATE: Get logged-in user's houses ─────────────────────────────────────
router.get("/my-houses", authMiddleware, async (req, res) => {
  try {
    const houses = await House.find({ owner: req.user.id }).populate(
      "owner",
      "name email mobile"
    );
    res.json(houses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── PUBLIC: Get single house by id ───────────────────────────────────────────
router.get("/:id", async (req, res) => {
  try {
    const house = await House.findById(req.params.id).populate(
      "owner",
      "name email mobile"
    );
    if (!house) return res.status(404).json({ message: "House not found" });
    res.json(house);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── PRIVATE: Add house with Cloudinary images ────────────────────────────────
router.post("/", authMiddleware, upload.array("images", 20), async (req, res) => {
  try {
    const houseData = { ...req.body, owner: req.user.id };

    if (req.files && req.files.length > 0) {
      houseData.images = req.files.map((file) => file.path);
    }

    if (!houseData.mobileNumber) {
      return res.status(400).json({
        success: false,
        message: "Mobile number is required",
      });
    }

    if (!houseData.whatsAppNumber) {
      return res.status(400).json({
        success: false,
        message: "WhatsApp number is required",
      });
    }

    const house = new House(houseData);
    await house.save();

    console.log("✅ House created:", house._id);

    // Email notifications
    try {
      const subscribers = await Subscription.find();

      if (house.location) {
        const matchingSubscribers = subscribers.filter(
          (sub) =>
            sub.location &&
            (
              house.location
                .toLowerCase()
                .includes(sub.location.toLowerCase()) ||
              sub.location
                .toLowerCase()
                .includes(house.location.toLowerCase())
            )
        );

        if (matchingSubscribers.length > 0) {
          console.log(`Sending notifications to ${matchingSubscribers.length} subscribers...`);
          matchingSubscribers.forEach((sub) => {
            sendListingNotification(sub.email, house).catch((err) =>
              console.error("Notification failed for", sub.email, err)
            );
          });
        }
      }
    } catch (notifErr) {
      console.error("Notification error:", notifErr);
    }

    return res.status(201).json({
      success: true,
      message: "House added successfully",
      house,
    });
  } catch (err) {
    console.error("❌ ADD HOUSE ERROR:", err);
    console.error("❌ Message:", err.message);
    console.error("❌ Stack:", err.stack);

    return res.status(500).json({
      success: false,
      message: err.message || "Failed to add house",
    });
  }
});

// ── PRIVATE: Update house ────────────────────────────────────────────────────
router.put("/:id", authMiddleware, upload.array("images", 20), async (req, res) => {
  try {
    const house = await House.findOne({ _id: req.params.id, owner: req.user.id });
    if (!house) return res.status(403).json({ error: "Not authorized or house not found" });

    Object.keys(req.body).forEach((key) => {
      if (key === "furnished" || key === "parking" || key === "isPublic") {
        house[key] = req.body[key] === true || req.body[key] === "true";
      } else {
        house[key] = req.body[key];
      }
    });

    // Replace images only if new ones uploaded
    if (req.files && req.files.length > 0) {
      // Delete old Cloudinary images
      if (house.images && house.images.length > 0) {
        for (const imgUrl of house.images) {
          try {
            // Extract public_id from Cloudinary URL
            const parts = imgUrl.split("/");
            const folderAndFile = parts.slice(-2).join("/");
            const publicId = folderAndFile.replace(/\.[^/.]+$/, "");
            await cloudinary.uploader.destroy(publicId);
          } catch (e) {
            console.error("Failed to delete old Cloudinary image:", e);
          }
        }
      }
      house.images = req.files.map((f) => f.path);
    }

    const updatedHouse = await house.save();
    res.json(updatedHouse);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ── PRIVATE: Delete house ────────────────────────────────────────────────────
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const house = await House.findById(req.params.id);
    if (!house) return res.status(404).json({ error: "House not found" });

    const isAdmin = req.user.role === "admin";
    const isOwner = house.owner && house.owner.toString() === req.user.id;

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ error: "Not authorized to delete this house" });
    }

    // Delete images from Cloudinary
    if (house.images && house.images.length > 0) {
      for (const imgUrl of house.images) {
        try {
          const parts = imgUrl.split("/");
          const folderAndFile = parts.slice(-2).join("/");
          const publicId = folderAndFile.replace(/\.[^/.]+$/, "");
          await cloudinary.uploader.destroy(publicId);
        } catch (e) {
          console.error("Failed to delete Cloudinary image:", e);
        }
      }
    }

    await house.deleteOne();
    res.json({ message: "House deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
