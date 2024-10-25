import React from "react";
import "./current-weather.css";

const CurrentWeather = ({ data, unit }) => {
  const date = new Date(data.dt * 1000);
  const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const convertTemp = (kelvinTemp) => {
    if (unit === "C") {
      return Math.round(kelvinTemp - 273.15);
    }
    return Math.round(kelvinTemp);
  };

  // Calculate today's max and min temperatures
  const maxTemp = convertTemp(data.main.temp_max);
  const minTemp = convertTemp(data.main.temp_min);

  return (
    <div className="weather">
      <div className="top">
        <div>
          <p className="city">{data.name}</p>
          <p className="weather-description">{data.weather[0].description}</p>
          <p className="weather-date">{formattedDate}</p>
        </div>
        <img
          alt="weather"
          className="weather-icon"
          src={`icons/${data.weather[0].icon}.png`}
        />
      </div>

      <div className="bottom">
        <p className="temperature">
          {convertTemp(data.main.temp)}
          {unit === "C" ? "°C" : "K"}
        </p>
        <div className="details">
          <div className="parameter-row">
            <span className="parameter-label">Details</span>
          </div>
          <div className="parameter-row">
            <span className="parameter-label">Feels like</span>
            <span className="parameter-value">
              {convertTemp(data.main.feels_like)}
              {unit === "C" ? "°C" : "K"}
            </span>
          </div>
          <div className="parameter-row">
            <span className="parameter-label">Wind</span>
            <span className="parameter-value">{data.wind.speed} m/s</span>
          </div>
          <div className="parameter-row">
            <span className="parameter-label">Humidity</span>
            <span className="parameter-value">{data.main.humidity}%</span>
          </div>
          <div className="parameter-row">
            <span className="parameter-label">Pressure</span>
            <span className="parameter-value">{data.main.pressure} hPa</span>
          </div>
          {/* New rows for max and min temperatures */}
          <div className="parameter-row">
            <span className="parameter-label">Max Temp</span>
            <span className="parameter-value">
              {maxTemp} {unit === "C" ? "°C" : "K"}
            </span>
          </div>
          <div className="parameter-row">
            <span className="parameter-label">Min Temp</span>
            <span className="parameter-value">
              {minTemp} {unit === "C" ? "°C" : "K"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;
