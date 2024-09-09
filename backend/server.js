const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5004;

app.use(cors());
app.use(express.json());

const WEATHER_API_KEY = process.env.REACT_WEATHER_API_KEY;
const GNEWS_API_KEY = process.env.REACT_GNEWS_API_KEY;

app.get("/api/weather", async (req, res) => {
  const { lat, lon, q } = req.query;
  let url;
  if (lat && lon) {
    url = `http://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${lat},${lon}&days=7&aqi=no&alerts=no`;
  } else if (q) {
    url = `http://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${q}&days=7&aqi=no&alerts=no`;
  } else {
    return res.status(400).json({ error: "Missing location parameters" });
  }

  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Error fetching weather data" });
  }
});

app.get("/api/news", async (req, res) => {
  const { city } = req.query;
  try {
    const response = await axios.get(
      `https://gnews.io/api/v4/search?q=${city}+weather&token=${GNEWS_API_KEY}&lang=en&max=5`
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Error fetching news data" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
