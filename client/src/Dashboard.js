import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Sun, Cloud, CloudRain, Wind, MapPin, Thermometer } from "lucide-react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Dashboard() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [newsData, setNewsData] = useState([]);
  const [isCelsius, setIsCelsius] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");
    const q = searchParams.get("q");

    if (lat && lon) {
      fetchWeatherData(lat, lon);
    } else if (q) {
      fetchWeatherData(null, null, q);
    } else {
      setIsLoading(false);
      toast.error("No location specified. Please enter a city name.");
    }
  }, [location.search]);

  const fetchWeatherData = async (lat, lon, q) => {
    setIsLoading(true);
    try {
      let url = "https://weathernow-backend.vercel.app/api/weather?";
      if (lat && lon) {
        url += `lat=${lat}&lon=${lon}`;
      } else if (q) {
        url += `q=${encodeURIComponent(q)}`;
      }
      const response = await axios.get(url);
      setWeatherData(response.data);
      setCity(response.data.location.name);
      fetchNewsData(response.data.location.name);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      toast.error("Failed to fetch weather data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchNewsData = async (city) => {
    try {
      const response = await axios.get(
        `https://weathernow-backend.vercel.app/api/news?city=${encodeURIComponent(
          city
        )}`
      );
      setNewsData(response.data.articles);
    } catch (error) {
      console.error("Error fetching news data:", error);
      toast.warn("Unable to fetch news stories at this time.");
    }
  };

  const handleCityChange = async (e) => {
    e.preventDefault();
    if (city.trim()) {
      navigate(`/dashboard?q=${encodeURIComponent(city.trim())}`);
    } else {
      toast.error("Please enter a valid city name.");
    }
  };

  const getWeatherIcon = (condition) => {
    switch (condition.toLowerCase()) {
      case "sunny":
      case "clear":
        return <Sun className="w-8 h-8 text-yellow-400" />;
      case "partly cloudy":
      case "cloudy":
      case "overcast":
        return <Cloud className="w-8 h-8 text-gray-400" />;
      case "rain":
      case "light rain":
      case "heavy rain":
        return <CloudRain className="w-8 h-8 text-blue-400" />;
      case "wind":
      case "windy":
        return <Wind className="w-8 h-8 text-teal-400" />;
      default:
        return <Sun className="w-8 h-8 text-yellow-400" />;
    }
  };

  const getWeatherRecommendation = (temp, condition) => {
    const tempC = isCelsius ? temp : ((temp - 32) * 5) / 9;
    if (tempC > 30)
      return "It's hot out there! Don't forget to stay hydrated and wear sunscreen.";
    if (tempC < 10) return "It's chilly today. Bundle up before heading out!";
    if (condition.toLowerCase().includes("rain"))
      return "Don't forget your umbrella!";
    if (condition.toLowerCase().includes("wind"))
      return "It's windy today. Secure any loose items outdoors.";
    return "Enjoy the pleasant weather today!";
  };

  const toggleTemperatureUnit = () => {
    setIsCelsius(!isCelsius);
  };

  const convertTemperature = (temp) => {
    if (isCelsius) {
      return (((temp - 32) * 5) / 9).toFixed(1);
    }
    return temp.toFixed(1);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-blue-100">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!weatherData) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-blue-100">
        <h1 className="text-2xl font-bold mb-4">No weather data available</h1>
        <p className="mb-4">
          Please enter a city name to get weather information.
        </p>
        <form
          onSubmit={handleCityChange}
          className="flex items-center space-x-2"
        >
          <Input
            type="text"
            placeholder="Enter city name"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="max-w-xs"
          />
          <Button type="submit">Search</Button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-100">
      <ToastContainer />
      <header className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
          <h1 className="text-2xl font-bold mb-4 sm:mb-0">
            WeatherNow Dashboard
          </h1>
          <form
            onSubmit={handleCityChange}
            className="flex items-center space-x-4"
          >
            <MapPin className="w-5 h-5" />
            <Input
              type="text"
              placeholder="Enter city name"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="max-w-xs text-black"
            />
            <Button type="submit">Search</Button>
          </form>
        </div>
      </header>

      <main className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Current Weather</h2>
              <Button
                onClick={toggleTemperatureUnit}
                className="flex items-center"
              >
                <Thermometer className="w-4 h-4 mr-2" />
                {isCelsius ? "°C to °F" : "°F to °C"}
              </Button>
            </div>
            <div className="flex items-center space-x-4">
              {getWeatherIcon(weatherData.current.condition.text)}
              <div>
                <p className="text-4xl font-bold">
                  {convertTemperature(weatherData.current.temp_f)}°
                  {isCelsius ? "C" : "F"}
                </p>
                <p className="text-xl">{weatherData.current.condition.text}</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p>Humidity: {weatherData.current.humidity}%</p>
                <p>Wind Speed: {weatherData.current.wind_mph} mph</p>
              </div>
              <div>
                <p>
                  Feels Like:{" "}
                  {convertTemperature(weatherData.current.feelslike_f)}°
                  {isCelsius ? "C" : "F"}
                </p>
                <p>UV Index: {weatherData.current.uv}</p>
              </div>
            </div>
            <div className="mt-4 p-4 bg-blue-100 rounded-md">
              <p className="font-semibold">Recommendation:</p>
              <p>
                {getWeatherRecommendation(
                  weatherData.current.temp_f,
                  weatherData.current.condition.text
                )}
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Hourly Forecast</h2>
            <div className="overflow-x-auto">
              <div className="inline-flex space-x-4">
                {weatherData.forecast.forecastday[0].hour
                  .slice(0, 8)
                  .map((hour, index) => (
                    <div key={index} className="text-center">
                      <p className="font-semibold">
                        {new Date(hour.time).getHours()}:00
                      </p>
                      {getWeatherIcon(hour.condition.text)}
                      <p>
                        {convertTemperature(hour.temp_f)}°
                        {isCelsius ? "C" : "F"}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">7-Day Forecast</h2>
          <div className="grid grid-cols-7 gap-4">
            {weatherData.forecast.forecastday.map((day, index) => (
              <div key={index} className="text-center">
                <p className="font-semibold">
                  {new Date(day.date).toLocaleDateString("en-US", {
                    weekday: "short",
                  })}
                </p>
                {getWeatherIcon(day.day.condition.text)}
                <p>
                  H: {convertTemperature(day.day.maxtemp_f)}°
                  {isCelsius ? "C" : "F"}
                </p>
                <p>
                  L: {convertTemperature(day.day.mintemp_f)}°
                  {isCelsius ? "C" : "F"}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Top Weather Stories</h2>
          {newsData.length > 0 ? (
            <ul className="space-y-2">
              {newsData.map((story, index) => (
                <li key={index}>
                  <a
                    href={story.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {story.title}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p>No weather stories available at the moment.</p>
          )}
        </div>
      </main>
    </div>
  );
}
