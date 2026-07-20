// import House from "../models/House.js";
// import fs from "fs";
// import path from "path";

// // export const addHouse = async (req, res) => {
// //   try {
// //     const house = await House.create({
// //       ...req.body,
// //       user: req.user.id,
// //       photo: req.file ? req.file.filename : "",
// //     });
// //     res.status(201).json(house);
// //   } catch (err) {
// //     res.status(400).json({ error: err.message });
// //   }
// // };


// export const addHouse = async (req, res) => {
//   try {
//     const { title, description, type, price, bedrooms, bathrooms, furnished, color, name, mobile, address } = req.body;
//     const photos = req.files ? req.files.map(f => f.filename) : [];

//     const house = new House({
//       user: req.user._id,
//       title,
//       description,
//       type,
//       price,
//       bedrooms,
//       bathrooms,
//       furnished: furnished === "true", // checkbox returns string
//       color: Array.isArray(color) ? color : [color], // handle single/multiple selection
//       name,
//       mobile,
//       address,
//       photos,
//     });

//     const savedHouse = await house.save();
//     res.status(201).json(savedHouse);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };



// // Get Houses
// export const getHouses = async (req, res) => {
//   try {
//     let houses;

//     if (req.user) {
//       // If logged in → show only user's houses
//       houses = await House.find({ user: req.user._id });
//     } else {
//       // If not logged in → show all houses
//       houses = await House.find();
//     }

//     res.json(houses);
//   } catch (error) {
//     res.status(500).json({ message: "Server Error" });
//   }
// };



// // Get all houses
// // export const getHouses = async (req, res) => {
// //   try {
// //     const houses = await House.find(); // Make sure your House model has 'name' and 'mobile'
// //     res.json(houses);
// //   } catch (err) {
// //     res.status(500).json({ message: err.message });
// //   }
// // };


// // Get house by id
// export const getHouseById = async (req, res) => {
//   try {
//     const house = await House.findById(req.params.id);
//     if (!house) return res.status(404).json({ message: "House not found" });
//     res.json(house);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };


// export const updateHouse = async (req, res) => {
//   try {
//     const { title, description, type, price, name, mobile, address } = req.body;

//     const house = await House.findById(req.params.id);
//     if (!house) return res.status(404).json({ message: "House not found" });

//     // Update fields
//     house.title = title || house.title;
//     house.description = description || house.description;
//     house.type = type || house.type;
//     house.price = price || house.price;
//     house.name = name || house.name;
//     house.mobile = mobile || house.mobile;
//     house.address = address || house.address;

//     // Update photos if new ones uploaded
//     if (req.files && req.files.length > 0) {
//       const newPhotos = req.files.map(file => file.filename);
//       house.photos = [...house.photos, ...newPhotos];
//     }

//     const updatedHouse = await house.save();
//     res.json(updatedHouse);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };



// // Delete house
// export const deleteHouse = async (req, res) => {
//   try {
//     const house = await House.findById(req.params.id);
//     if (!house) return res.status(404).json({ message: "House not found" });

//     // Delete uploaded photo from server if exists
//     if (house.photo) {
//       const photoPath = path.join(process.cwd(), "uploads", house.photo);
//       fs.unlink(photoPath, (err) => {
//         if (err) console.log("Failed to delete photo:", err);
//       });
//     }

//     await house.deleteOne();
//     res.json({ message: "House deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

import House from "../models/House.js";
import fs from "fs";
import path from "path";

// ----------------- Add House -----------------
export const addHouse = async (req, res) => {
  try {
    const {
      title,
      description,
      type,
      price,
      bedrooms,
      bathrooms,
      furnished,
      color,
      name,
      mobile,
      address,
    } = req.body;

    const photos = req.files ? req.files.map((f) => f.filename) : [];

    const house = new House({
      user: req.user._id,
      title,
      description,
      type,
      price,
      bedrooms,
      bathrooms,
      furnished: furnished === "true",
      color: Array.isArray(color) ? color : [color],
      name,
      mobile,
      address,
      photos,
    });

    const savedHouse = await house.save();
    res.status(201).json(savedHouse);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// export const addHouse = async (req, res) => {
//   try {
//     const {
//       title,
//       description,
//       type,
//       price,
//       bedrooms,
//       bathrooms,
//       furnished,
//       color,
//       name,
//       mobile,
//       address,
//       isPublic, // <-- add this
//     } = req.body;

//     const photos = req.files ? req.files.map((f) => f.filename) : [];

//     const house = new House({
//       user: req.user._id,
//       title,
//       description,
//       type,
//       price,
//       bedrooms,
//       bathrooms,
//       furnished: furnished === "true",
//         parking: parking === "true",

//       isPublic: isPublic === "true", // <-- convert string to boolean
//       color: Array.isArray(color) ? color : [color],
//       name,
//       mobile,
//       address,
//       photos,
//     });

//     const savedHouse = await house.save();
//     res.status(201).json(savedHouse);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };



// ----------------- Get Houses -----------------
export const getHouses = async (req, res) => {
  try {
    let houses;

    if (req.user) {
      // logged in → only their houses
      houses = await House.find({ user: req.user._id });
    } else {
      // not logged in → all houses
      houses = await House.find();
    }

    res.json(houses);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
// export const getHouses = async (req, res) => {
//   try {
//     let houses;

//     if (req.user) {
//       // Logged in → show only their houses
//       houses = await House.find({ owner: req.user._id });
//     } else {
//       // Not logged in → show only public houses
//       houses = await House.find({ isPublic: true });
//     }

//     res.json(houses);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server Error" });
//   }
// };



// ----------------- Get House by ID -----------------
export const getHouseById = async (req, res) => {
  try {
    const house = await House.findById(req.params.id);
    if (!house) return res.status(404).json({ message: "House not found" });
    res.json(house);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ----------------- Update House -----------------
export const updateHouse = async (req, res) => {
  try {
    const house = await House.findById(req.params.id);
    if (!house) return res.status(404).json({ message: "House not found" });

    // Check ownership
    if (house.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const { title, description, type, price, name, mobile, address } = req.body;

    house.title = title || house.title;
    house.description = description || house.description;
    house.type = type || house.type;
    house.price = price || house.price;
    house.name = name || house.name;
    house.mobile = mobile || house.mobile;
    house.address = address || house.address;

    // If new photos uploaded → add them
    if (req.files && req.files.length > 0) {
      const newPhotos = req.files.map((file) => file.filename);
      house.photos = [...house.photos, ...newPhotos];
    }

    const updatedHouse = await house.save();
    res.json(updatedHouse);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// export const updateHouse = async (req, res) => {
//   try {
//     const house = await House.findById(req.params.id);
//     if (!house) return res.status(404).json({ message: "House not found" });

//     // Check ownership
//     if (house.user.toString() !== req.user._id.toString()) {
//       return res.status(401).json({ message: "Not authorized" });
//     }

//     const {
//       title,
//       description,
//       type,
//       price,
//       name,
//       mobile,
//       address,
//       isPublic, // <-- add this
//     } = req.body;

//     house.title = title || house.title;
//     house.description = description || house.description;
//     house.type = type || house.type;
//     house.price = price || house.price;
//     house.name = name || house.name;
//     house.mobile = mobile || house.mobile;
//     house.address = address || house.address;

//     // Handle isPublic checkbox
//     if (isPublic !== undefined) {
//       house.isPublic = isPublic === "true"; // convert string to boolean
//     }

//     // If new photos uploaded → add them
//     if (req.files && req.files.length > 0) {
//       const newPhotos = req.files.map((file) => file.filename);
//       house.photos = [...house.photos, ...newPhotos];
//     }

//     const updatedHouse = await house.save();
//     res.json(updatedHouse);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };




// ----------------- Delete House -----------------
export const deleteHouse = async (req, res) => {
  try {
    const house = await House.findById(req.params.id);
    if (!house) return res.status(404).json({ message: "House not found" });

    // Check ownership
    if (house.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // Delete all uploaded photos
    if (house.photos && house.photos.length > 0) {
      house.photos.forEach((photo) => {
        const photoPath = path.join(process.cwd(), "uploads", photo);
        fs.unlink(photoPath, (err) => {
          if (err) console.log("Failed to delete photo:", err);
        });
      });
    }

    await house.deleteOne();
    res.json({ message: "House deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// import House from "../models/House.js";
// import fs from "fs";
// import path from "path";

// // ----------------- Add House -----------------
// export const addHouse = async (req, res) => {
//   try {
//     const {
//       title,
//       description,
//       type,
//       price,
//       bedrooms,
//       bathrooms,
//       furnished,
//       color,
//       name,
//       mobile,
//       address,
//       ownerName,   // ✅ Accept new field
//       ownerMobile, // ✅ Accept new field
//     } = req.body;

//     const photos = req.files ? req.files.map((f) => f.filename) : [];

//     const house = new House({
//       user: req.user._id,
//       title,
//       description,
//       type,
//       price,
//       bedrooms,
//       bathrooms,
//       furnished: furnished === "true",
//       color: Array.isArray(color) ? color : [color],
//       name,
//       mobile,
//       address,
//       photos,
//       ownerName,   // ✅ Save owner name
//       ownerMobile, // ✅ Save owner mobile
//     });

//     const savedHouse = await house.save();
//     res.status(201).json(savedHouse);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // ----------------- Get Houses -----------------
// export const getHouses = async (req, res) => {
//   try {
//     let houses;

//     if (req.user) {
//       // logged in → only their houses
//       houses = await House.find({ user: req.user._id });
//     } else {
//       // not logged in → all houses
//       houses = await House.find();
//     }

//     res.json(houses);
//   } catch (error) {
//     res.status(500).json({ message: "Server Error" });
//   }
// };

// // ----------------- Get House by ID -----------------
// export const getHouseById = async (req, res) => {
//   try {
//     const house = await House.findById(req.params.id);
//     if (!house) return res.status(404).json({ message: "House not found" });
//     res.json(house);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // ----------------- Update House -----------------
// export const updateHouse = async (req, res) => {
//   try {
//     const house = await House.findById(req.params.id);
//     if (!house) return res.status(404).json({ message: "House not found" });

//     // Check ownership
//     if (house.user.toString() !== req.user._id.toString()) {
//       return res.status(401).json({ message: "Not authorized" });
//     }

//     const {
//       title,
//       description,
//       type,
//       price,
//       name,
//       mobile,
//       address,
//       ownerName,   // ✅ Accept updates
//       ownerMobile, // ✅ Accept updates
//     } = req.body;

//     house.title = title || house.title;
//     house.description = description || house.description;
//     house.type = type || house.type;
//     house.price = price || house.price;
//     house.name = name || house.name;
//     house.mobile = mobile || house.mobile;
//     house.address = address || house.address;
//     house.ownerName = ownerName || house.ownerName;     // ✅ update ownerName
//     house.ownerMobile = ownerMobile || house.ownerMobile; // ✅ update ownerMobile

//     // If new photos uploaded → add them
//     if (req.files && req.files.length > 0) {
//       const newPhotos = req.files.map((file) => file.filename);
//       house.photos = [...house.photos, ...newPhotos];
//     }

//     const updatedHouse = await house.save();
//     res.json(updatedHouse);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // ----------------- Delete House -----------------
// export const deleteHouse = async (req, res) => {
//   try {
//     const house = await House.findById(req.params.id);
//     if (!house) return res.status(404).json({ message: "House not found" });

//     // Check ownership
//     if (house.user.toString() !== req.user._id.toString()) {
//       return res.status(401).json({ message: "Not authorized" });
//     }

//     // Delete all uploaded photos
//     if (house.photos && house.photos.length > 0) {
//       house.photos.forEach((photo) => {
//         const photoPath = path.join(process.cwd(), "uploads", photo);
//         fs.unlink(photoPath, (err) => {
//           if (err) console.log("Failed to delete photo:", err);
//         });
//       });
//     }

//     await house.deleteOne();
//     res.json({ message: "House deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };
