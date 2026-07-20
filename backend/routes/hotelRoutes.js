import express from "express";
import HotelRoom from "../models/HotelRoom.js";
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

// ── PUBLIC: Get all rooms ────────────────────────────────────────────────────
router.get("/", async (req, res) => {
  try {
    const rooms = await HotelRoom.find({
      isPublic: { $ne: false },
      adminHidden: { $ne: true },
    }).populate("owner", "name email mobile");
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── ADMIN: Get all rooms including hidden ────────────────────────────────────
router.get("/admin/all", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }
    const rooms = await HotelRoom.find().populate("owner", "name email mobile");
    res.json(rooms);
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
    const room = await HotelRoom.findById(req.params.id);
    if (!room) return res.status(404).json({ message: "Room not found" });
    room.adminHidden = !room.adminHidden;
    await room.save();
    res.json(room);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── PRIVATE: Get logged-in user's rooms ─────────────────────────────────────
router.get("/my-rooms", authMiddleware, async (req, res) => {
  try {
    const rooms = await HotelRoom.find({ owner: req.user.id }).populate("owner", "name email mobile");
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── PUBLIC: Get single room ──────────────────────────────────────────────────
router.get("/:id", async (req, res) => {
  try {
    const room = await HotelRoom.findById(req.params.id).populate("owner", "name email mobile");
    if (!room) return res.status(404).json({ message: "Room not found" });
    res.json(room);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── PRIVATE: Create room ─────────────────────────────────────────────────────
router.post("/", authMiddleware, upload.array("images", 20), async (req, res) => {
  try {
    const roomData = { ...req.body, owner: req.user.id };
    // Parse amenities if sent as JSON string
    if (typeof roomData.amenities === "string") {
      try { roomData.amenities = JSON.parse(roomData.amenities); } catch { roomData.amenities = []; }
    }
    if (req.files) {
      roomData.images = req.files.map((file) => `/uploads/${file.filename}`);
    }
    const room = new HotelRoom(roomData);
    await room.save();
    res.status(201).json(room);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add room" });
  }
});

// ── PRIVATE: Update room ─────────────────────────────────────────────────────
router.put("/:id", authMiddleware, upload.array("images", 20), async (req, res) => {
  try {
    const room = await HotelRoom.findOne({ _id: req.params.id, owner: req.user.id });
    if (!room) return res.status(403).json({ error: "Not authorized or room not found" });

    Object.keys(req.body).forEach((key) => {
      if (key === "isPublic") {
        room[key] = req.body[key] === true || req.body[key] === "true";
      } else if (key === "amenities") {
        try { room[key] = JSON.parse(req.body[key]); } catch { room[key] = []; }
      } else {
        room[key] = req.body[key];
      }
    });

    if (req.files && req.files.length > 0) {
      room.images = req.files.map((f) => `/uploads/${f.filename}`);
    }

    const updatedRoom = await room.save();
    res.json(updatedRoom);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ── PRIVATE: Delete room ─────────────────────────────────────────────────────
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const room = await HotelRoom.findById(req.params.id);
    if (!room) return res.status(404).json({ error: "Room not found" });

    const isAdmin = req.user.role === "admin";
    const isOwner = room.owner && room.owner.toString() === req.user.id;

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ error: "Not authorized to delete this room" });
    }

    if (room.images && room.images.length > 0) {
      room.images.forEach((photo) => {
        const filename = photo.split("/").pop();
        const photoPath = path.join(process.cwd(), "uploads", filename);
        fs.unlink(photoPath, (err) => {
          if (err) console.log("Failed to delete photo:", err);
        });
      });
    }

    await room.deleteOne();
    res.json({ message: "Room deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
