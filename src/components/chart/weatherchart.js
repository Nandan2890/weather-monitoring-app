import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";
import "./weatherchart.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const WeatherChart = ({ city, forecast, unit, reportType }) => {
  const [weeklyData, setWeeklyData] = useState([]);

  // Fetch weekly data only if reportType is 'weekly'
  useEffect(() => {
    if (reportType === "weekly") {
      const fetchWeeklyData = async () => {
        try {
          const response = await axios.get(`/api/weekly-summary/${city}`);
          setWeeklyData(response.data);
        } catch (error) {
          console.error("Error fetching weekly data:", error);
        }
      };

      fetchWeeklyData();
    }
  }, [city, reportType]);

  let labels = [];
  let temperatures = [];

  // Handling "today" report type
  if (reportType === "today") {
    const today = new Date().toISOString().split("T")[0];
    const todayForecast = forecast.list.filter((item) =>
      item.dt_txt.startsWith(today)
    );

    labels = todayForecast.map((item) =>
      new Date(item.dt_txt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
    temperatures = todayForecast.map((item) =>
      unit === "C"
        ? Math.round(item.main.temp - 273.15)
        : Math.round(item.main.temp)
    );
  } 
  
  // Handling "weekly" report type
  else if (reportType === "weekly") {
    labels = weeklyData.map((data) =>
      new Date(data.day).toLocaleDateString([], {
        weekday: "long",
        month: "short",
        day: "numeric",
      })
    );
    temperatures = weeklyData.map((data) => data.max_temp); // Using max temperature for weekly chart
  }

  const data = {
    labels,
    datasets: [
      {
        label: `Temperature (${unit === "C" ? "°C" : "K"})`,
        data: temperatures,
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)",
        tension: 0.2,
      },
    ],
  };

  return (
    <div className="chart-container">
      <label className="title">Weather Visualization</label>
      <Line data={data} />
    </div>
  );
};

export default WeatherChart;
