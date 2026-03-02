import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import authMiddleware from "./middleware/authMiddleware.js";
import weatherRoutes from "./routes/weather.js";

dotenv.config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/weather", weatherRoutes); // ✅ THIS WAS MISSING

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected 🟢"))
  .catch((err) =>
    console.error("MongoDB connection error 🔴", err.message)
  );

app.get("/", (req, res) => {
  res.send("Backend running 🟢");
});

app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({
    message: "Access granted 🔓",
    user: req.user,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
