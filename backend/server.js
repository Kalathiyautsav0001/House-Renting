// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import path from "path";
// import connectDB from "./config/db.js";
// import authRoutes from "./routes/authRoutes.js";
// import houseRoutes from "./routes/houseRoutes.js";
// import hotelRoutes from "./routes/hotelRoutes.js";
// import commercialRoutes from "./routes/commercialRoutes.js";

// dotenv.config();
// connectDB();

// const app = express();
// app.use(cors());
// app.use(express.json());

// // Serve uploads folder for images
// app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));

// // Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/houses", houseRoutes);
// app.use("/api/rooms", hotelRoutes);
// app.use("/api/commercial", commercialRoutes);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));



import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import houseRoutes from "./routes/houseRoutes.js";
import hotelRoutes from "./routes/hotelRoutes.js";
import commercialRoutes from "./routes/commercialRoutes.js";

dotenv.config();

const app = express();

// ===============================
// CORS CONFIGURATION
// ===============================

const allowedOrigins = [
  "https://house-renting-2.onrender.com",
  "http://localhost:5173",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests without origin (Postman, server-to-server, etc.)
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Handle preflight requests
app.options("*", cors());


// ===============================
// MIDDLEWARE
// ===============================

app.use(express.json());


// ===============================
// DATABASE
// ===============================

connectDB();


// ===============================
// STATIC FILES
// ===============================

app.use(
  "/uploads",
  express.static(path.join(path.resolve(), "uploads"))
);


// ===============================
// ROUTES
// ===============================

app.use("/api/auth", authRoutes);
app.use("/api/houses", houseRoutes);
app.use("/api/rooms", hotelRoutes);
app.use("/api/commercial", commercialRoutes);


// ===============================
// HEALTH CHECK
// ===============================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "EasyRentals API is running 🚀",
  });
});


// ===============================
// SERVER
// ===============================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
