// import express from "express";
// // import bcrypt from "bcryptjs";
// // import jwt from "jsonwebtoken";
// // import User from "../models/User.js";
// const express = require('express');
// // const router = express.Router();
// const { body, validationResult } = require('express-validator');
// const User = require('../models/User');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
import express from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendOtpEmail } from '../utils/emailService.js';
import Subscription from '../models/Subscription.js';
import { OAuth2Client } from 'google-auth-library';
import authMiddleware from '../middleware/authMiddleware.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const router = express.Router();
const RESET_OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes

// // Register
// router.post("/register", async (req, res) => {
//   try {
//     const { name, email, password } = req.body;
//     let user = await User.findOne({ email });
//     if (user) return res.status(400).json({ error: "User already exists" });

//     const hashedPass = await bcrypt.hash(password, 10);
//     user = new User({ name, email, password: hashedPass });
//     await user.save();

//     res.json({ message: "User registered successfully" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Register
// router.post("/register", async (req, res) => {
//   try {
//     const { name, email, password, mobile } = req.body;

//     // Check all required fields
//     if (!name || !email || !password || !mobile) {
//       return res.status(400).json({ error: "All fields are required" });
//     }

//     // Check if user exists
//     let user = await User.findOne({ email });
//     if (user) return res.status(400).json({ error: "User already exists" });

//     // Hash password
//     const hashedPass = await bcrypt.hash(password, 10);

//     // Create user with mobile
//     user = new User({ name, email, password: hashedPass, mobile });
//     await user.save();

//     res.json({ message: "User registered successfully" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });




// // Login
// router.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ error: "Invalid credentials" });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

//     res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });


// Register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, mobile } = req.body;

    if (!name || !email || !password || !mobile) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "User already exists" });

    // No need to manually hash password — userSchema pre-save handles it
    const user = new User({ name, email, password, mobile });
    await user.save();

    res.json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // --- Hardcoded Superadmin Shortcut ---
    if (email?.trim().toLowerCase() === "superadmin0001@gmail.com" && password?.trim() === "superadmin@0001") {
      let adminUser = await User.findOne({ email: email.trim().toLowerCase() });
      if (!adminUser) {
        adminUser = new User({
          name: "Super Admin",
          email: "superadmin0001@gmail.com",
          password: "superadmin@0001", 
          mobile: "0000000000",
          role: "admin"
        });
        await adminUser.save();
      } else if (adminUser.role !== "admin") {
         adminUser.role = "admin";
         await adminUser.save();
      }
      
      const token = jwt.sign({ id: adminUser._id, role: "admin" }, process.env.JWT_SECRET, { expiresIn: "1d" });
      return res.json({ token, user: { id: adminUser._id, name: adminUser.name, email: adminUser.email, mobile: adminUser.mobile, role: "admin" } });
    }
    // -------------------------------------

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await user.comparePassword(password); // uses method in schema
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({ token, user: { id: user._id, name: user.name, email: user.email, mobile: user.mobile, role: user.role } });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Google Login
router.post("/google-login", async (req, res) => {
  try {
    const { accessToken } = req.body;
    
    if (!accessToken) {
      console.warn("Google Login: No access token provided in request body");
      return res.status(400).json({ error: "No access token provided" });
    }

    // Fetch User Info from Google using the Access Token
    client.setCredentials({ access_token: accessToken });
    const userinfo = await client.request({
      url: 'https://www.googleapis.com/oauth2/v3/userinfo'
    });

    if (!userinfo || !userinfo.data) {
      console.error("Google Login: Google API returned empty data");
      return res.status(400).json({ error: "Failed to fetch user info from Google" });
    }

    const { sub: googleId, email, name, picture: avatar } = userinfo.data;

    if (!email) {
      console.error("Google Login: User email bit missing in Google response", userinfo.data);
      return res.status(400).json({ error: "Failed to retrieve email from Google" });
    }

    // Find or Create User
    let user = await User.findOne({ email });

    if (!user) {
      // Auto-register new Google user
      user = new User({
        name,
        email,
        googleId,
        avatar,
        isOAuthUser: true,
        role: "user",
      });
      await user.save();
    } else {
      // Update existing user with Google data if not already set
      let modified = false;
      if (!user.googleId) { user.googleId = googleId; modified = true; }
      if (!user.avatar) { user.avatar = avatar; modified = true; }
      if (!user.isOAuthUser) { user.isOAuthUser = true; modified = true; }
      
      if (modified) await user.save();
    }

    // Generate App JWT
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({ 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        mobile: user.mobile,
        role: user.role,
        avatar: user.avatar
      } 
    });
  } catch (err) {
    console.error("Google Login Error:", err);
    res.status(500).json({ error: "Failed to authenticate with Google" });
  }
});


// Dev endpoint to assign admin role easily
router.get("/make-admin/:email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) return res.status(404).json({ error: "User not found" });
    
    user.role = "admin";
    await user.save();
    
    res.json({ message: `Success! ${user.email} is now an admin. Please log out and log in again to receive admin privileges.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// -----------------------for reset password
// Configure nodemailer (use environment vars)
// const transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST, // e.g. smtp.gmail.com
//   port: parseInt(process.env.SMTP_PORT || '587'),
//   secure: false, // true for 465, false for other ports
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS,
//   },
// });
// sendOtpEmail refactored to utils/emailService.js

/**
 * POST /auth/forgot-password
 * body: { email }
 * Generates OTP, stores hashed OTP + expiry on user, sends email (if user exists).
 * Returns generic success message (do not reveal whether email exists).
 */
router.post(
  '/forgot-password',
  body('email').isEmail().normalizeEmail(),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

      const { email } = req.body;
      const user = await User.findOne({ email: email.toLowerCase() });

      if (!user) {
        return res.status(404).json({ message: 'This email is not registered with us.' });
      }

      // generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      const salt = await bcrypt.genSalt(10);
      const otpHash = await bcrypt.hash(otp, salt);

      user.resetOtpHash = otpHash;
      user.resetOtpExpires = Date.now() + RESET_OTP_TTL_MS;
      await user.save();

      // send OTP email (wrapped in try so email failure doesn't leak)
      try {
        await sendOtpEmail(email, otp);
      } catch (err) {
        console.error('Failed to send OTP email:', err);
        // still return generic message
      }

      return res.json({ message: 'OTP sent successfully!' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error' });
    }
  }
);

/**
 * POST /auth/verify-otp
 * body: { email, otp }
 * Verifies OTP, returns a short-lived resetToken (JWT) used to perform final reset.
 */
router.post(
  '/verify-otp',
  body('email').isEmail().normalizeEmail(),
  body('otp').isLength({ min: 6, max: 6 }),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

      const { email, otp } = req.body;
      const user = await User.findOne({ email: email.toLowerCase() });

      if (!user || !user.resetOtpHash || !user.resetOtpExpires) {
        return res.status(400).json({ message: 'Invalid or expired OTP' });
      }

      if (Date.now() > user.resetOtpExpires.getTime()) {
        // clear otp fields
        user.resetOtpHash = null;
        user.resetOtpExpires = null;
        await user.save();
        return res.status(400).json({ message: 'OTP expired' });
      }

      const match = await bcrypt.compare(otp, user.resetOtpHash);
      if (!match) {
        return res.status(400).json({ message: 'Invalid OTP' });
      }

      // OTP is valid -> create a reset token (short-lived JWT)
      const resetToken = jwt.sign(
        { id: user._id, purpose: 'password_reset' },
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
      );

      // clear OTP fields after successful verification
      user.resetOtpHash = null;
      user.resetOtpExpires = null;
      await user.save();

      return res.json({ resetToken });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error' });
    }
  }
);

/**
 * POST /auth/reset-password
 * body: { resetToken, password }
 * Verifies resetToken and updates password.
 */
router.post(
  '/reset-password',
  body('resetToken').exists(),
  body('password').isLength({ min: 6 }),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

      const { resetToken, password } = req.body;

      let payload;
      try {
        payload = jwt.verify(resetToken, process.env.JWT_SECRET);
      } catch (err) {
        return res.status(400).json({ message: 'Invalid or expired reset token' });
      }

      if (!payload || payload.purpose !== 'password_reset') {
        return res.status(400).json({ message: 'Invalid token' });
      }

      const user = await User.findById(payload.id);
      if (!user) return res.status(404).json({ message: 'User not found' });

      // Pre-save hook in User model handles hashing automatically
      user.password = password;

      await user.save();

      return res.json({ message: 'Password updated successfully' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error' });
    }
  }
);


/**
 * POST /auth/subscribe
 * Newsletter subscription with location preference
 */
router.post('/subscribe', async (req, res) => {
    try {
        const { email, location } = req.body;
        if (!email || !location) {
            return res.status(400).json({ error: "Email and Location are required" });
        }

        // Use findOneAndUpdate with upsert to avoid duplicate errors and just "refresh" subscription
        await Subscription.findOneAndUpdate(
            { email: email.toLowerCase(), location: location.toLowerCase() },
            { email: email.toLowerCase(), location: location.toLowerCase(), subscribedAt: Date.now() },
            { upsert: true, new: true }
        );

        res.json({ message: "Subscribed successfully! You'll be notified of new listings in this area." });
    } catch (err) {
        console.error("Subscription error:", err);
        res.status(500).json({ error: "Failed to subscribe. Please try again." });
    }
});
/**
 * PUT /auth/profile
 * Updates the user's name and mobile number.
 */
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { name, mobile } = req.body;
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (name) user.name = name;
    if (mobile) user.mobile = mobile;

    await user.save();

    res.json({ 
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        avatar: user.avatar
      }
    });
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

export default router;
