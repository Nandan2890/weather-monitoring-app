// Server.js updates
const express = require("express");
const mysql = require("mysql2");
const fetch = require("node-fetch");
require("dotenv").config();
const nodemailer = require("nodemailer");

const app = express();
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("Database connection error:", err);
    return;
  }
  console.log("Connected to MySQL database.");
});

// Alert thresholds
let tempThreshold = 35;
let alertTriggered = false;

// Fetch weather data and store it in the database
const fetchWeatherData = async (city) => {
  const API_KEY = process.env.WEATHER_API_KEY;
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`
  );
  const data = await response.json();
  return data;
};

const storeWeatherData = async (city) => {
  const data = await fetchWeatherData(city);
  const temp = data.main.temp;
  const weatherDescription = data.weather[0].description;
  const date = new Date();

  const query = `
    INSERT INTO weather (city, temperature, weather_description, date)
    VALUES (?, ?, ?, ?)
  `;
  db.query(query, [city, temp, weatherDescription, date], (err, result) => {
    if (err) {
      console.error("Error storing weather data:", err);
      return;
    }
    console.log(`Weather data for ${city} stored.`);
  });

  checkAlertThresholds(data);
};

const checkAlertThresholds = (data) => {
  const currentTemp = data.main.temp - 273.15;

  if (currentTemp > tempThreshold && !alertTriggered) {
    console.log(
      `Alert! Temperature exceeded ${tempThreshold}°C in ${data.name}`
    );

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ALERT_EMAIL,
      subject: `Weather Alert for ${data.name}`,
      text: `Temperature in ${data.name} has exceeded ${tempThreshold}°C.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending alert email:", error);
      } else {
        console.log("Alert email sent:", info.response);
      }
    });

    alertTriggered = true;
  } else if (currentTemp <= tempThreshold) {
    alertTriggered = false;
  }
};

// Fetch and store weather data every 10 seconds
const cities = ["New York", "London", "Mumbai"];
setInterval(() => {
  console.log("Fetching and storing weather data every 10 seconds...");
  cities.forEach((city) => storeWeatherData(city));
}, 10000); // 10 seconds in milliseconds

app.get("/api/weekly-summary/:city", (req, res) => {
  const city = req.params.city;
  const query = `
    SELECT * FROM daily_summary
    WHERE city = ? 
    ORDER BY day DESC
    LIMIT 7
  `;
  db.query(query, [city], (err, results) => {
    if (err) {
      console.error("Error fetching weekly summary:", err);
      res.status(500).json({ error: "Database error" });
      return;
    }
    res.json(results);
  });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
