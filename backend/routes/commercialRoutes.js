import express from "express";
import Commercial from "../models/Commercial.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { cloudinary, upload, uploadToCloudinary } from "../config/cloudinary.js";

const router = express.Router();

// ── PRIVATE: Add commercial (memory storage → Cloudinary stream) ──────────────
router.post("/", authMiddleware, (req, res) => {
  upload.array("images", 20)(req, res, async (uploadErr) => {
    if (uploadErr) {
      return res.status(400).json({ success: false, message: uploadErr.message });
    }
    try {
      const commercialData = { ...req.body, owner: req.user.id };

      if (commercialData.amenities) {
        try { commercialData.amenities = JSON.parse(commercialData.amenities); }
        catch (e) { console.log("Amenities parse failed"); }
      }

      if (req.files && req.files.length > 0) {
        const uploadPromises = req.files.map((f) => uploadToCloudinary(f.buffer, "house-rent-sell/commercial"));
        commercialData.images = await Promise.all(uploadPromises);
      }

      const listing = new Commercial(commercialData);
      await listing.save();
      res.status(201).json(listing);
    } catch (err) {
      console.error("❌ ADD COMMERCIAL ERROR:", err.message);
      res.status(500).json({ success: false, message: err.message || "Failed to add listing" });
    }
  });
});

// ── PUBLIC: Get all commercial listings ─────────────────────────────────────
router.get("/", async (req, res) => {
  try {
    const listings = await Commercial.find({
      isPublic: { $ne: false },
      adminHidden: { $ne: true },
    }).populate("owner", "name email mobile");
    res.json(listings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── PRIVATE: Get user's commercial listings ──────────────────────────────────
router.get("/my-commercial", authMiddleware, async (req, res) => {
  try {
    const listings = await Commercial.find({ owner: req.user.id }).populate(
      "owner",
      "name email mobile"
    );
    res.json(listings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── ADMIN: Get all commercial listings including hidden ──────────────────────
router.get("/admin/all", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }
    const listings = await Commercial.find().populate("owner", "name email mobile");
    res.json(listings);
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
    const listing = await Commercial.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: "Listing not found" });
    listing.adminHidden = !listing.adminHidden;
    await listing.save();
    res.json(listing);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── PUBLIC: Get single listing by id ────────────────────────────────────────
router.get("/:id", async (req, res) => {
  try {
    const listing = await Commercial.findById(req.params.id).populate(
      "owner",
      "name email mobile"
    );
    if (!listing) return res.status(404).json({ message: "Listing not found" });
    res.json(listing);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── PRIVATE: Update commercial listing ──────────────────────────────────────
router.put("/:id", authMiddleware, upload.array("images", 20), async (req, res) => {
  try {
    const listing = await Commercial.findOne({
      _id: req.params.id,
      owner: req.user.id,
    });
    if (!listing) return res.status(403).json({ error: "Not authorized or listing not found" });

    Object.keys(req.body).forEach((key) => {
      if (key === "isPublic") {
        listing[key] = req.body[key] === true || req.body[key] === "true";
      } else if (key === "amenities") {
        try {
          listing[key] = JSON.parse(req.body[key]);
        } catch (e) {
          listing[key] = req.body[key];
        }
      } else {
        listing[key] = req.body[key];
      }
    });

    if (req.files && req.files.length > 0) {
      // Delete old Cloudinary images
      if (listing.images && listing.images.length > 0) {
        for (const imgUrl of listing.images) {
          try {
            const parts = imgUrl.split("/");
            const folderAndFile = parts.slice(-2).join("/");
            const publicId = folderAndFile.replace(/\.[^/.]+$/, "");
            await cloudinary.uploader.destroy(publicId);
          } catch (e) {
            console.error("Failed to delete old Cloudinary image:", e);
          }
        }
      }
      listing.images = req.files.map((f) => f.path);
    }

    const updatedListing = await listing.save();
    res.json(updatedListing);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ── PRIVATE: Delete commercial listing ──────────────────────────────────────
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const listing = await Commercial.findById(req.params.id);
    if (!listing) return res.status(404).json({ error: "Listing not found" });

    const isAdmin = req.user.role === "admin";
    const isOwner = listing.owner && listing.owner.toString() === req.user.id;

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ error: "Not authorized to delete this listing" });
    }

    // Delete images from Cloudinary
    if (listing.images && listing.images.length > 0) {
      for (const imgUrl of listing.images) {
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

    await listing.deleteOne();
    res.json({ message: "Listing deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
