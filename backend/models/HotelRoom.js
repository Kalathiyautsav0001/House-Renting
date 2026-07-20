import mongoose from "mongoose";

const hotelRoomSchema = new mongoose.Schema({
  title: { type: String, required: true },
  hotelName: { type: String, required: true },
  location: { type: String, required: true },
  address: { type: String, default: "" },
  latitude: { type: Number },
  longitude: { type: Number },
  roomType: {
    type: String,
    default: "standard",
    enum: ["single", "double", "suite", "deluxe", "dormitory", "standard", "executive", "family"],
  },
  pricePerNight: { type: Number, required: true, min: 0 },
  bedrooms: { type: Number, default: 1, min: 1 },
  bathrooms: { type: Number, default: 1, min: 1 },
  floor: { type: Number, default: 0 },
  totalRooms: { type: Number, default: 1 },
  amenities: { type: [String], default: [] },
  description: { type: String, default: "" },
  images: { type: [String], default: [] },
  mobileNumber: { type: String, required: true },
  whatsAppNumber: { type: String, required: true },
  status: {
    type: String,
    default: "available",
    enum: ["available", "booked", "closed"],
  },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  isPublic: { type: Boolean, default: true },
  adminHidden: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model("HotelRoom", hotelRoomSchema);
