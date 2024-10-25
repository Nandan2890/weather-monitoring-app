import { useState, useEffect } from "react";
import Search from "./components/search/search";
import CurrentWeather from "./components/current-weather/current-weather";
import Forecast from "./components/forecast/forecast";
import WeatherChart from "./components/chart/weatherchart";
import { WEATHER_API_URL, WEATHER_API_KEY } from "./api";
import "./App.css";

function App() {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [searchData, setSearchData] = useState(null);
  const [unit, setUnit] = useState("K");
  const [reportType, setReportType] = useState("today");

  const fetchWeatherData = (lat, lon) => {
    const currentWeatherFetch = fetch(
      `${WEATHER_API_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}`
    );
    const forecastFetch = fetch(
      `${WEATHER_API_URL}/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}`
    );

    Promise.all([currentWeatherFetch, forecastFetch])
      .then(async (response) => {
        const weatherResponse = await response[0].json();
        const forecastResponse = await response[1].json();

        setCurrentWeather({ ...weatherResponse });
        setForecast({ ...forecastResponse });
      })
      .catch(console.log);
  };

  const handleOnSearchChange = (searchData) => {
    const [lat, lon] = searchData.value.split(" ");
    setSearchData(searchData);
    fetchWeatherData(lat, lon);
  };

  const handleUnitChange = (e) => {
    setUnit(e.target.value);
  };

  const handleReportTypeChange = (e) => {
    setReportType(e.target.value);
  };

  useEffect(() => {
    if (searchData) {
      const [lat, lon] = searchData.value.split(" ");
      const interval = setInterval(() => {
        fetchWeatherData(lat, lon);
      }, 300000);
      return () => clearInterval(interval);
    }
  }, [searchData]);

  return (
    <div className="container">
      <Search onSearchChange={handleOnSearchChange} />

      <div className="unit-select">
        <label htmlFor="unit">Temperature Unit:</label>
        <select id="unit" value={unit} onChange={handleUnitChange}>
          <option value="K">Kelvin (K)</option>
          <option value="C">Celsius (°C)</option>
        </select>
      </div>

      {currentWeather && <CurrentWeather data={currentWeather} unit={unit} />}
      {forecast && <Forecast data={forecast} unit={unit} />}

      {forecast && (
        <div className="report-select">
          <label htmlFor="report-type">Weather Report Type:</label>
          <select
            id="report-type"
            value={reportType}
            onChange={handleReportTypeChange}
          >
            <option value="today">Today's Weather Report</option>
            <option value="weekly">Weekly Weather Report</option>
          </select>
        </div>
      )}

      {currentWeather && forecast && (
        <WeatherChart forecast={forecast} unit={unit} reportType={reportType} />
      )}
    </div>
  );
}

export default App;
