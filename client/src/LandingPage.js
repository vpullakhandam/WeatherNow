import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Sun,
  Cloud,
  CloudRain,
  Wind,
  MapPin,
  Newspaper,
  Clock,
  Umbrella,
  Calendar,
  Thermometer,
  AlertCircle,
} from "lucide-react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function LandingPage() {
  const [currentWeather, setCurrentWeather] = useState("sunny");
  const [isLoading, setIsLoading] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [city, setCity] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const weathers = ["sunny", "cloudy", "rainy", "windy"];
    const interval = setInterval(() => {
      setCurrentWeather(weathers[Math.floor(Math.random() * weathers.length)]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const weatherIcons = {
    sunny: <Sun className="w-24 h-24 text-yellow-400" />,
    cloudy: <Cloud className="w-24 h-24 text-gray-400" />,
    rainy: <CloudRain className="w-24 h-24 text-blue-400" />,
    windy: <Wind className="w-24 h-24 text-teal-400" />,
  };

  const handleGetStarted = () => {
    setIsLoading(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setIsLoading(false);
          navigate(`/dashboard?lat=${latitude}&lon=${longitude}`);
        },
        (error) => {
          setIsLoading(false);
          console.error("Error getting location:", error);
          let errorMessage = "Unable to retrieve your location. ";
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage +=
                "Please enable location services to use this feature.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage += "Location information is unavailable.";
              break;
            case error.TIMEOUT:
              errorMessage += "The request to get your location timed out.";
              break;
            default:
              errorMessage += "An unknown error occurred.";
          }
          toast.error(errorMessage, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          setShowSearch(true);
        },
        { timeout: 10000 }
      );
    } else {
      setIsLoading(false);
      toast.warn(
        "Geolocation is not supported by your browser. Please enter a city name.",
        {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
      setShowSearch(true);
    }
  };

  const handleCitySubmit = (e) => {
    e.preventDefault();
    if (city.trim()) {
      navigate(`/dashboard?q=${encodeURIComponent(city.trim())}`);
    } else {
      toast.error("Please enter a valid city name.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-200">
      <ToastContainer />
      <section className="container mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-blue-800">
            WeatherNow App
          </h1>
          <p className="text-lg sm:text-xl mb-8 text-blue-600">
            Your personalized weather companion with real-time updates.
          </p>
        </motion.div>
        <motion.div
          animate={{ rotate: currentWeather === "windy" ? [0, 5, -5, 0] : 0 }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="mb-12"
        >
          {weatherIcons[currentWeather]}
        </motion.div>
        {!showSearch ? (
          <Button
            className="text-lg px-6 py-3 rounded-full transform hover:scale-105 flex items-center"
            onClick={handleGetStarted}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="animate-spin mr-2">
                  <AlertCircle className="w-5 h-5" />
                </span>
                Loading...
              </>
            ) : (
              "Get Started"
            )}
          </Button>
        ) : (
          <div className="w-full max-w-md">
            <p className="text-xl mb-4 text-blue-700 font-semibold">
              Find out the weather in your favorite city!
            </p>
            <form
              onSubmit={handleCitySubmit}
              className="flex items-center space-x-2"
            >
              <Input
                type="text"
                placeholder="Enter city name"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="flex-grow"
              />
              <Button type="submit">
                <MapPin className="w-5 h-5 mr-2" />
                Search
              </Button>
            </form>
          </div>
        )}
      </section>

      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-blue-800">
            Efficient Features
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <MapPin className="w-12 h-12 text-red-500" />,
                title: "Auto-Location",
                description:
                  "Get instant weather updates based on your current location.",
              },
              {
                icon: <Newspaper className="w-12 h-12 text-purple-500" />,
                title: "Top Weather Stories",
                description:
                  "Stay informed with the latest weather-related news for your area.",
              },
              {
                icon: <Clock className="w-12 h-12 text-green-500" />,
                title: "Hourly Forecasts",
                description:
                  "Plan your day with detailed hour-by-hour weather predictions.",
              },
              {
                icon: <Calendar className="w-12 h-12 text-blue-500" />,
                title: "Weekly Forecasts",
                description:
                  "Stay prepared with accurate 7-day weather outlooks.",
              },
              {
                icon: <Umbrella className="w-12 h-12 text-yellow-500" />,
                title: "Weather-Based Recommendations",
                description:
                  "Receive smart suggestions based on current and upcoming weather conditions.",
              },
              {
                icon: <Thermometer className="w-12 h-12 text-red-500" />,
                title: "Detailed Weather Data",
                description:
                  "Access comprehensive weather information including temperature, humidity, wind speed, and more.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-blue-50 p-6 rounded-lg shadow-lg text-center"
              >
                <div className="mb-4 flex justify-center">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-blue-800">
                  {feature.title}
                </h3>
                <p className="text-blue-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-blue-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-blue-400">
            &copy; {new Date().getFullYear()} WeatherNow App. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
