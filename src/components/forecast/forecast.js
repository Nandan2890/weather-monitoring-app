import React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from "react-accessible-accordion";
import "./forecast.css"; // Ensure you have the proper styles for this file

const Forecast = ({ data, unit }) => {
  // Function to convert temperature based on selected unit
  const convertTemp = (kelvinTemp) => {
    if (unit === "C") {
      return Math.round(kelvinTemp - 273.15); // Convert Kelvin to Celsius
    }
    return Math.round(kelvinTemp); // Return Kelvin as is
  };

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  // Filter the data to only include weather data for today
  const todayForecast = data.list.filter((item) => item.dt_txt.startsWith(today));

  return (
    <>
      <label className="title">Today's Weather Forecast</label>
      <Accordion allowZeroExpanded>
        {todayForecast.map((item, idx) => (
          <AccordionItem key={idx}>
            <AccordionItemHeading>
              <AccordionItemButton>
                <div className="daily-item">
                  {/* Show the weather icon from the JSON data */}
                  <img
                    src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                    className="icon-small"
                    alt="weather icon"
                  />
                  {/* Print the timing from dt_txt */}
                  <label className="day">{item.dt_txt.split(" ")[1]}</label>
                  <label className="description">
                    {item.weather[0].description}
                  </label>
                  <label className="min-max">
                    {convertTemp(item.main.temp_max)}
                    {unit === "C" ? "°C" : "K"} / {convertTemp(item.main.temp_min)}
                    {unit === "C" ? "°C" : "K"}
                  </label>
                </div>
              </AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel>
              <div className="daily-details-grid">
                <div className="daily-details-grid-item">
                  <label>Pressure:</label>
                  <label>{item.main.pressure} hPa</label>
                </div>
                <div className="daily-details-grid-item">
                  <label>Humidity:</label>
                  <label>{item.main.humidity}%</label>
                </div>
                <div className="daily-details-grid-item">
                  <label>Clouds:</label>
                  <label>{item.clouds.all}%</label>
                </div>
                <div className="daily-details-grid-item">
                  <label>Wind speed:</label>
                  <label>{item.wind.speed} m/s</label>
                </div>
                <div className="daily-details-grid-item">
                  <label>Feels like:</label>
                  <label>
                    {convertTemp(item.main.feels_like)}
                    {unit === "C" ? "°C" : "K"}
                  </label>
                </div>
              </div>
            </AccordionItemPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </>
  );
};

export default Forecast;
