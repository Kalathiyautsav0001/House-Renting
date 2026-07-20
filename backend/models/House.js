import mongoose from "mongoose";

const houseSchema = new mongoose.Schema({
  title: String,
  location: String,
  price: { type: Number, min: 0 },
  description: String,
  type: { type: String, default: "rent" }, // rent or sale
  houseType: { type: String, default: "apartment" },
  bedrooms: { type: Number, min: 1 },
  bathrooms: { type: Number, min: 1 },
  furnished: Boolean,
  parking: Boolean,
  area: { type: Number, min: 0 }, // in sq ft
  images: { type: [String], default: [] },// Add image field
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  isPublic: { type: Boolean, default: true },
  adminHidden: { type: Boolean, default: false },
  mobileNumber: { type: String, required: true }, 
  whatsAppNumber: { type: String, required: true },
  status: { type: String, default: "available" }, // available, rented, sold
  condition: { 
    type: String, 
    default: "good", 
    enum: ["brand_new", "newly_renovated", "well_maintained", "good", "fair", "needs_repair"] 
  },
  latitude: { type: Number },
  longitude: { type: Number },
});

export default mongoose.model("House", houseSchema);
