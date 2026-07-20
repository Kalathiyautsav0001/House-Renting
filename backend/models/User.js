// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, unique: true, required: true },
//   password: { type: String, required: true }
// });

// export default mongoose.model("User", userSchema);
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false }, // Optional for Google users
  mobile: { type: String, required: false },   // Optional for Google users
  role: { type: String, enum: ["user", "admin"], default: "user" },

  // OAuth Fields
  googleId: { type: String, default: null },
  avatar: { type: String, default: null },
  isOAuthUser: { type: Boolean, default: false },

  resetOtpHash: { type: String, default: null },
  resetOtpExpires: { type: Date, default: null },
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.password || !this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password method for login
userSchema.methods.comparePassword = function (enteredPassword) {
  if (!this.password) return false;
  return bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);

// import mongoose from "mongoose";
// import bcrypt from "bcryptjs";

// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   mobile: { type: String, required: true },
//   resetPasswordToken: { type: String },  // for forgot password
//   resetPasswordExpire: { type: Date },   // token expiry
// });

// // Hash password before saving
// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });

// // Compare plain password with hashed password
// userSchema.methods.comparePassword = function (enteredPassword) {
//   return bcrypt.compare(enteredPassword, this.password);
// };

// export default mongoose.model("User", userSchema);
