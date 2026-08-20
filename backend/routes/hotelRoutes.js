import express from "express";
import HotelRoom from "../models/HotelRoom.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { cloudinary } from "../config/cloudinary.js";

const router = express.Router();

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
    const rooms = await HotelRoom.find({ owner: req.user.id }).populate(
      "owner",
      "name email mobile"
    );
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── PUBLIC: Get single room ──────────────────────────────────────────────────
router.get("/:id", async (req, res) => {
  try {
    const room = await HotelRoom.findById(req.params.id).populate(
      "owner",
      "name email mobile"
    );
    if (!room) return res.status(404).json({ message: "Room not found" });
    res.json(room);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── PRIVATE: Create room ─────────────────────────────────────────────────────
router.post("/", authMiddleware, async (req, res) => {
  try {
    const roomData = { ...req.body, owner: req.user.id };

    if (typeof roomData.amenities === "string") {
      try { roomData.amenities = JSON.parse(roomData.amenities); }
      catch { roomData.amenities = []; }
    }

    const room = new HotelRoom(roomData);
    await room.save();
    res.status(201).json(room);
  } catch (err) {
    console.error("❌ ADD ROOM ERROR:", err.message);
    res.status(500).json({ success: false, message: err.message || "Failed to add room" });
  }
});

// ── PRIVATE: Update room ─────────────────────────────────────────────────────
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const room = await HotelRoom.findOne({ _id: req.params.id, owner: req.user.id });
    if (!room) return res.status(403).json({ error: "Not authorized or room not found" });

    // If new images provided, delete old Cloudinary images
    if (req.body.images && Array.isArray(req.body.images) && req.body.images.length > 0) {
      if (room.images && room.images.length > 0) {
        for (const imgUrl of room.images) {
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
    }

    Object.keys(req.body).forEach((key) => {
      if (key === "isPublic") {
        room[key] = req.body[key] === true || req.body[key] === "true";
      } else if (key === "amenities" && typeof req.body[key] === "string") {
        try {
          room[key] = JSON.parse(req.body[key]);
        } catch {
          room[key] = [];
        }
      } else {
        room[key] = req.body[key];
      }
    });

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

    // Delete images from Cloudinary
    if (room.images && room.images.length > 0) {
      for (const imgUrl of room.images) {
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

    await room.deleteOne();
    res.json({ message: "Room deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
