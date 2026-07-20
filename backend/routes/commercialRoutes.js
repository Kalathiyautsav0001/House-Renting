import express from "express";
import Commercial from "../models/Commercial.js";
import authMiddleware from "../middleware/authMiddleware.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Add commercial listing
router.post("/", authMiddleware, upload.array("images", 20), async (req, res) => {
  try {
    const commercialData = { ...req.body, owner: req.user.id };

    if (commercialData.amenities) {
      try {
        commercialData.amenities = JSON.parse(commercialData.amenities);
      } catch (e) {
        console.log("Amenities parsing failed, keeping as is.");
      }
    }

    if (req.files) {
      commercialData.images = req.files.map((file) => `/uploads/${file.filename}`);
    }

    const listing = new Commercial(commercialData);
    await listing.save();
    res.status(201).json(listing);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add commercial listing" });
  }
});

// Get all commercial listings (public)
router.get("/", async (req, res) => {
  try {
    const listings = await Commercial.find({ isPublic: { $ne: false }, adminHidden: { $ne: true } }).populate("owner", "name email mobile");
    res.json(listings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user's commercial listings
router.get("/my-commercial", authMiddleware, async (req, res) => {
  try {
    const listings = await Commercial.find({ owner: req.user.id }).populate("owner", "name email mobile");
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

// GET single listing by id
router.get("/:id", async (req, res) => {
  try {
    const listing = await Commercial.findById(req.params.id).populate("owner", "name email mobile");
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }
    res.json(listing);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update commercial listing
router.put("/:id", authMiddleware, upload.array("images", 5), async (req, res) => {
  try {
    const listing = await Commercial.findOne({ _id: req.params.id, owner: req.user.id });
    if (!listing) return res.status(403).json({ error: "Not authorized or listing not found" });

    // Update fields
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

    // Replace images only if new ones uploaded
    if (req.files && req.files.length > 0) {
      listing.images = req.files.map((f) => `/uploads/${f.filename}`);
    }

    const updatedListing = await listing.save();
    res.json(updatedListing);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Delete commercial listing
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const listing = await Commercial.findById(req.params.id);
    if (!listing) return res.status(404).json({ error: "Listing not found" });

    const isAdmin = req.user.role === "admin";
    const isOwner = listing.owner && listing.owner.toString() === req.user.id;

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ error: "Not authorized to delete this listing" });
    }

    if (listing.images && listing.images.length > 0) {
      listing.images.forEach((photo) => {
        const filename = photo.split('/').pop();
        const photoPath = path.join(process.cwd(), "uploads", filename);
        fs.unlink(photoPath, (err) => {
          if (err) console.log("Failed to delete photo:", err);
        });
      });
    }

    await listing.deleteOne();
    res.json({ message: "Listing deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
