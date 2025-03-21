import React, { useState, useEffect } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";

function StatsView() {
  const [airData, setAirData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Motion values for animations
  const aqiUS = useMotionValue(0);
  const aqiCN = useMotionValue(0);
  const temperature = useMotionValue(0);

  // Transformed values for display
  const roundedAqiUS = useTransform(aqiUS, Math.round);
  const roundedAqiCN = useTransform(aqiCN, Math.round);
  const roundedTemperature = useTransform(temperature, Math.round);

  useEffect(() => {
    const fetchAirData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://api.airvisual.com/v2/nearest_city?lat=19.0760&lon=72.8777&key=e7485fdc-5215-4c00-853a-a36301600746"
        );
        const data = await response.json();
        
        if (data.status === "success") {
          setAirData(data.data);
          
          // Animate the values
          animateCounter(aqiUS, data.data.current.pollution.aqius);
          animateCounter(aqiCN, data.data.current.pollution.aqicn);
          animateCounter(temperature, data.data.current.weather.tp);
        } else {
          setError("Failed to load air quality data");
        }
      } catch (error) {
        console.error("Error fetching air data:", error);
        setError("Error fetching air quality data");
      } finally {
        setLoading(false);
      }
    };

    fetchAirData();
  }, []);

  // Helper function to animate counters
  const animateCounter = async (motionValue, targetValue) => {
    const incrementValue = Math.max(1, Math.ceil(targetValue / 50));
    
    for (let i = 0; i <= targetValue; i += incrementValue) {
      await new Promise((resolve) => setTimeout(resolve, 30));
      motionValue.set(Math.min(i, targetValue));
    }
  };

  // Function to determine AQI color based on US EPA standard
  const getAqiColor = (aqi) => {
    if (aqi <= 50) return "text-green-600";
    if (aqi <= 100) return "text-yellow-600";
    if (aqi <= 150) return "text-orange-600";
    if (aqi <= 200) return "text-red-600";
    if (aqi <= 300) return "text-purple-600";
    return "text-rose-800";
  };

  // Function to determine AQI category
  const getAqiCategory = (aqi) => {
    if (aqi <= 50) return "Good";
    if (aqi <= 100) return "Moderate";
    if (aqi <= 150) return "Unhealthy for Sensitive Groups";
    if (aqi <= 200) return "Unhealthy";
    if (aqi <= 300) return "Very Unhealthy";
    return "Hazardous";
  };

  // Function to get corresponding background colors
  const getBgColor = (aqi) => {
    if (aqi <= 50) return "bg-green-50";
    if (aqi <= 100) return "bg-yellow-50";
    if (aqi <= 150) return "bg-orange-50";
    if (aqi <= 200) return "bg-red-50";
    if (aqi <= 300) return "bg-purple-50";
    return "bg-rose-50";
  };

  // Function to get weather icon based on the ic code
  const getWeatherIcon = (iconCode) => {
    const iconMap = {
      "01d": "☀️", // clear sky day
      "01n": "🌙", // clear sky night
      "02d": "⛅", // few clouds day
      "02n": "☁️", // few clouds night
      "03d": "☁️", // scattered clouds
      "03n": "☁️", // scattered clouds
      "04d": "☁️", // broken clouds
      "04n": "☁️", // broken clouds
      "09d": "🌧️", // shower rain
      "09n": "🌧️", // shower rain
      "10d": "🌦️", // rain day
      "10n": "🌧️", // rain night
      "11d": "⛈️", // thunderstorm
      "11n": "⛈️", // thunderstorm
      "13d": "❄️", // snow
      "13n": "❄️", // snow
      "50d": "🌫️", // mist
      "50n": "🌫️", // mist
    };
    
    return iconMap[iconCode] || "🌡️"; // default icon if not found
  };

  if (loading) {
    return (
      <section className="bg-gradient-to-b from-green-50 to-white py-12">
        <div className="container px-5 mx-auto text-center">
          <h2 className="text-2xl font-semibold">Loading air quality data...</h2>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-gradient-to-b from-green-50 to-white py-12">
        <div className="container px-5 mx-auto text-center">
          <h2 className="text-2xl font-semibold text-red-600">{error}</h2>
        </div>
      </section>
    );
  }

  const aqiUSValue = airData?.current?.pollution?.aqius || 0;
  const aqiCNValue = airData?.current?.pollution?.aqicn || 0;
  const tempValue = airData?.current?.weather?.tp || 0;
  const weatherIcon = getWeatherIcon(airData?.current?.weather?.ic);
  const humidity = airData?.current?.weather?.hu || 0;
  const windSpeed = airData?.current?.weather?.ws || 0;
  const pressure = airData?.current?.weather?.pr || 0;

  return (
    <section className="bg-gradient-to-b from-green-50 to-white py-12">
      <div className="container px-5 mx-auto">
        <div className="flex flex-col text-center w-full mb-12">
          <h2 className="text-sm text-green-600 tracking-widest font-medium uppercase mb-1">
            EcoWise Air Monitor
          </h2>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Air Quality Index
          </h1>
          <p className="text-xl font-medium text-gray-700 mb-4">
            {airData?.city}, {airData?.state}, {airData?.country}
          </p>
          <p className="lg:w-2/3 mx-auto leading-relaxed text-gray-600">
            With EcoWise, stay informed about air quality in your area. Make informed decisions for your health and wellbeing based on real-time environmental data.
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-6">
          {/* AQI US Card */}
          <motion.div
            className="w-full sm:w-64 md:w-72"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ opacity: 1, y: 0, transition: { duration: 0.5 } }}
            whileHover={{ scale: 1.05, y: -5, transition: { duration: 0.2 } }}
            viewport={{ once: false }}
          >
            <div className={`px-6 py-8 rounded-lg shadow-lg ${getBgColor(aqiUSValue)} border border-gray-200 text-center h-full`}>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                US AQI
              </h2>
              <p className={`${getAqiColor(aqiUSValue)} text-4xl md:text-5xl font-extrabold mb-2`}>
                <motion.span>{roundedAqiUS}</motion.span>
              </p>
              <p className="text-sm font-medium">
                {getAqiCategory(aqiUSValue)}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Main Pollutant: {airData?.current?.pollution?.mainus}
              </p>
            </div>
          </motion.div>
          
          {/* Temperature Card */}
          <motion.div
            className="w-full sm:w-64 md:w-72"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.1 } }}
            whileHover={{ scale: 1.05, y: -5, transition: { duration: 0.2 } }}
            viewport={{ once: false }}
          >
            <div className="px-6 py-8 rounded-lg shadow-lg bg-blue-50 border border-blue-200 text-center h-full">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                Weather {weatherIcon}
              </h2>
              <p className="text-blue-600 text-4xl md:text-5xl font-extrabold mb-2">
                <motion.span>{roundedTemperature}</motion.span>°C
              </p>
              <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
                <div className="text-left">
                  <p className="text-gray-600">Humidity</p>
                  <p className="font-semibold">{humidity}%</p>
                </div>
                <div className="text-left">
                  <p className="text-gray-600">Wind</p>
                  <p className="font-semibold">{windSpeed} m/s</p>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* China AQI Card */}
          <motion.div
            className="w-full sm:w-64 md:w-72"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2 } }}
            whileHover={{ scale: 1.05, y: -5, transition: { duration: 0.2 } }}
            viewport={{ once: false }}
          >
            <div className={`px-6 py-8 rounded-lg shadow-lg ${getBgColor(aqiCNValue)} border border-gray-200 text-center h-full`}>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                China AQI
              </h2>
              <p className={`${getAqiColor(aqiCNValue)} text-4xl md:text-5xl font-extrabold mb-2`}>
                <motion.span>{roundedAqiCN}</motion.span>
              </p>
              <p className="text-sm font-medium">
                {getAqiCategory(aqiCNValue)}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Main Pollutant: {airData?.current?.pollution?.maincn}
              </p>
            </div>
          </motion.div>
        </div>
        
        {/* Last updated timestamp */}
        <div className="text-center mt-8 text-sm text-gray-500">
          Last updated: {new Date(airData?.current?.pollution?.ts).toLocaleString()}
        </div>
      </div>
    </section>
  );
}

export default StatsView;