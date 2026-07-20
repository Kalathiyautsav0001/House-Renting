// import express from "express";
// import House from "../models/House.js";
// import authMiddleware from "../middleware/authMiddleware.js";

// const router = express.Router();




// // Multer config
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/");
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });
// const upload = multer({ storage });

// // Create folder 'uploads' in backend root
// // Make it static
// router.use("/uploads", express.static("uploads"));

// // Add house with image
// router.post("/", authMiddleware, upload.single("image"), async (req, res) => {
//   try {
//     const houseData = { ...req.body, owner: req.user.id };
//     if (req.file) {
//       houseData.image = `/uploads/${req.file.filename}`;
//     }

//     const house = new House(houseData);
//     await house.save();
//     res.status(201).json(house);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to add house" });
//   }
// });





// // Public: get all houses
// router.get("/", async (req, res) => {
//   try {
//     const houses = await House.find().populate("owner", "name email");
//     res.json(houses);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Private: get only logged-in user's houses
// router.get("/my-houses", authMiddleware, async (req, res) => {
//   try {
//     const houses = await House.find({ owner: req.user.id });
//     res.json(houses);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // ✅ Add house (only logged-in user can add)
// router.post("/", authMiddleware, async (req, res) => {
//   try {
//     const {
//       title,
//       location,
//       price,
//       description,
//       type,
//       houseType,
//       bedrooms,
//       bathrooms,
//       furnished,
//       parking,
//       area,
//     } = req.body;

//     const newHouse = new House({
//       title,
//       location,
//       price,
//       description,
//       type,
//       houseType,
//       bedrooms,
//       bathrooms,
//       furnished,
//       parking,
//       area,
//       owner: req.user.id, // ✅ always link to logged-in user
//     });

//     const savedHouse = await newHouse.save();
//     res.status(201).json(savedHouse);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // ✅ Update house (only owner can update)
// router.put("/:id", authMiddleware, async (req, res) => {
//   try {
//     const house = await House.findOneAndUpdate(
//       { _id: req.params.id, owner: req.user.id }, // ensure user owns the house
//       req.body,
//       { new: true }
//     );
//     if (!house) return res.status(403).json({ error: "Not authorized or house not found" });
//     res.json(house);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // ✅ Delete house (only owner can delete)
// router.delete("/:id", authMiddleware, async (req, res) => {
//   try {
//     const house = await House.findOneAndDelete({
//       _id: req.params.id,
//       owner: req.user.id,
//     });
//     if (!house) return res.status(403).json({ error: "Not authorized or house not found" });
//     res.json({ message: "House deleted" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// export default router;

import express from "express";
import House from "../models/House.js";
import authMiddleware from "../middleware/authMiddleware.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import Subscription from '../models/Subscription.js';
import { sendListingNotification } from '../utils/emailService.js';

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Serve uploads folder
router.use("/uploads", express.static("uploads"));

// Add house with multiple images
router.post("/", authMiddleware, upload.array("images", 20), async (req, res) => {
  try {
    const houseData = { ...req.body, owner: req.user.id };

    if (req.files) {
      houseData.images = req.files.map((file) => `/uploads/${file.filename}`);
    }

    const house = new House(houseData);
    await house.save();
    
    // Trigger Notifications without blocking the response
    try {
      const subscribers = await Subscription.find();
      // Filter subscribers whose location matches the house location (case-insensitive)
      const matchingSubscribers = subscribers.filter(sub => 
        house.location.toLowerCase().includes(sub.location.toLowerCase()) ||
        sub.location.toLowerCase().includes(house.location.toLowerCase())
      );

      if (matchingSubscribers.length > 0) {
        console.log(`Sending notifications to ${matchingSubscribers.length} subscribers...`);
        matchingSubscribers.forEach(sub => {
          sendListingNotification(sub.email, house).catch(err => console.error("Notification failed for", sub.email, err));
        });
      }
    } catch (notifErr) {
      console.error("Error in notification cycle:", notifErr);
    }

    res.status(201).json(house);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add house" });
  }
});

// // Get all houses (public)
// router.get("/", async (req, res) => {
//   try {
//     const houses = await House.find().populate("owner", "name email");
//     res.json(houses);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });
// Public: get all houses
router.get("/", async (req, res) => {
  try {
    // ✅ Populate owner with name, email, mobile
    const houses = await House.find({ isPublic: { $ne: false }, adminHidden: { $ne: true } }).populate("owner", "name email mobile");
    res.json(houses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: get practically all houses indiscriminately
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

// Admin: toggle adminHidden state
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





// Get random 3 houses for "Similar Properties"
router.get("/random/3", async (req, res) => {
  try {
    const houses = await House.aggregate([
      { $match: { isPublic: { $ne: false }, adminHidden: { $ne: true } } },
      { $sample: { size: 3 } }
    ]);
    res.json(houses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});











// // Get only logged-in user's houses
// router.get("/my-houses", authMiddleware, async (req, res) => {
//   try {
//     const houses = await House.find({ owner: req.user.id });
//     res.json(houses);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });
// Private: get only logged-in user's houses
// router.get("/my-houses", authMiddleware, async (req, res) => {
//   try {
//     // ✅ Populate owner with name, email, mobile
//     const houses = await House.find({ owner: req.user.id }).populate("owner", "name email mobile");
//     res.json(houses);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });
router.get("/my-houses", authMiddleware, async (req, res) => {
  try {
    const houses = await House.find({ owner: req.user.id }).populate("owner", "name email mobile");
    res.json(houses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});





// GET single house by id
router.get("/:id", async (req, res) => {
  try {
    const house = await House.findById(req.params.id).populate("owner", "name email mobile");
    if (!house) {
      return res.status(404).json({ message: "House not found" });
    }
    res.json(house);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// Update house (only owner)
router.put("/:id", authMiddleware, upload.array("images", 5), async (req, res) => {
  try {
    const house = await House.findOne({ _id: req.params.id, owner: req.user.id });
    if (!house) return res.status(403).json({ error: "Not authorized or house not found" });

    // Update fields
    // Object.keys(req.body).forEach((key) => (house[key] = req.body[key]));
Object.keys(req.body).forEach((key) => {
  if (key === "furnished" || key === "parking" || key === "isPublic") {
    // convert string to boolean if it comes as string
    house[key] = req.body[key] === true || req.body[key] === "true";
  } else {
    house[key] = req.body[key];
  }
});


    // Replace images only if new ones uploaded
    if (req.files && req.files.length > 0) {
      house.images = req.files.map((f) => `/uploads/${f.filename}`);
    }

    const updatedHouse = await house.save();
    res.json(updatedHouse);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Delete house (only owner or admin)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const house = await House.findById(req.params.id);
    if (!house) return res.status(404).json({ error: "House not found" });

    // Determine permissions securely
    const isAdmin = req.user.role === "admin";
    const isOwner = house.owner && house.owner.toString() === req.user.id;

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ error: "Not authorized to delete this house" });
    }

    // Attempt to delete images
    if (house.images && house.images.length > 0) {
      house.images.forEach((photo) => {
        const filename = photo.split('/').pop();
        const photoPath = path.join(process.cwd(), "uploads", filename);
        fs.unlink(photoPath, (err) => {
          if (err) console.log("Failed to delete photo:", err);
        });
      });
    }

    await house.deleteOne();
    res.json({ message: "House deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
