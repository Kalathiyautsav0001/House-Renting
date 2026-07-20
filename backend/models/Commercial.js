import mongoose from "mongoose";

const commercialSchema = new mongoose.Schema({
  title: { type: String, required: true },
  location: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  description: { type: String, default: "" },
  type: { type: String, default: "rent", enum: ["rent", "sale"] }, // rent or sale
  commercialType: { type: String, default: "other" }, // e.g. shop, office, or "other" for simplified listings
  area: { type: Number, required: true, min: 0 }, 
  images: { type: [String], default: [] },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  isPublic: { type: Boolean, default: true },
  adminHidden: { type: Boolean, default: false },
  mobileNumber: { type: String, required: true }, 
  whatsAppNumber: { type: String, required: true },
  status: { type: String, default: "available", enum: ["available", "rented", "sold"] },
  latitude: { type: Number },
  longitude: { type: Number },
  
  // Professional Business Fields
  zoning: { type: String, default: "Commercial" }, // Commercial, Industrial, Mixed, IT Park
  electricityCapacity: { type: String, default: "" }, // e.g. "3-Phase", "100 kW"
  parkingSpots: { type: Number, default: 0 },
  floorCount: { type: Number, default: 1 },
  amenities: { type: [String], default: [] }, // Loading Docks, Fire Safety, Security, etc.
}, { timestamps: true });

export default mongoose.model("Commercial", commercialSchema);
