import express from "express";
import axios from "axios";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  const { city } = req.query;

  if (!city) {
    return res.status(400).json({ message: "City is required" });
  }

  try {
    const response = await axios.get(
      "https://api.openweathermap.org/data/2.5/weather",
      {
        params: {
          q: city,
          units: "metric",
          appid: process.env.WEATHER_API_KEY,
        },
      }
    );

    res.json(response.data);
  } catch (err) {
    if (err.response?.status === 404) {
      res.status(404).json({ message: "City not found" });
    } else {
      res.status(500).json({ message: "Weather service error" });
    }
  }
});

export default router;
