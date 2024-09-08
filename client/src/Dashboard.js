import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from "./components/ui/button"
import { Input } from "./components/ui/input"
import { useAuth } from './App'
import { Sun, Cloud, CloudRain, Wind, Thermometer, Droplets } from 'lucide-react'

// Mock weather data (replace with actual API calls in a real app)
const mockWeatherData = {
  current: {
    temp: 72,
    condition: 'Sunny',
    humidity: 45,
    windSpeed: 5,
  },
  hourly: [
    { time: '12 PM', temp: 72, condition: 'Sunny' },
    { time: '1 PM', temp: 74, condition: 'Partly Cloudy' },
    { time: '2 PM', temp: 75, condition: 'Cloudy' },
    { time: '3 PM', temp: 73, condition: 'Partly Cloudy' },
  ],
  daily: [
    { day: 'Mon', high: 75, low: 62, condition: 'Sunny' },
    { day: 'Tue', high: 78, low: 64, condition: 'Partly Cloudy' },
    { day: 'Wed', high: 80, low: 66, condition: 'Sunny' },
    { day: 'Thu', high: 77, low: 63, condition: 'Cloudy' },
    { day: 'Fri', high: 76, low: 62, condition: 'Partly Cloudy' },
  ],
}

const mockNewsData = [
  { title: 'Heatwave expected to continue through the weekend', url: '#' },
  { title: 'Local parks implement water conservation measures', url: '#' },
  { title: 'City prepares for potential thunderstorms next week', url: '#' },
]

export default function Dashboard() {
  const [city, setCity] = useState('New York')
  const [weatherData, setWeatherData] = useState(mockWeatherData)
  const [newsData, setNewsData] = useState(mockNewsData)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // In a real app, you would fetch weather data here based on the city
    // For now, we'll just use the mock data
    setWeatherData(mockWeatherData)
  }, [city])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const getWeatherIcon = (condition) => {
    switch (condition.toLowerCase()) {
      case 'sunny': return <Sun className="w-8 h-8 text-yellow-400" />
      case 'cloudy': return <Cloud className="w-8 h-8 text-gray-400" />
      case 'rainy': return <CloudRain className="w-8 h-8 text-blue-400" />
      case 'windy': return <Wind className="w-8 h-8 text-teal-400" />
      default: return <Sun className="w-8 h-8 text-yellow-400" />
    }
  }

  const getWeatherRecommendation = () => {
    const temp = weatherData.current.temp
    const condition = weatherData.current.condition.toLowerCase()

    if (temp > 80) return "It's hot out there! Don't forget to stay hydrated and wear sunscreen."
    if (temp < 50) return "It's chilly today. Bundle up before heading out!"
    if (condition.includes('rain')) return "Don't forget your umbrella!"
    if (condition.includes('wind')) return "It's windy today. Secure any loose items outdoors."
    return "Enjoy the pleasant weather today!"
  }

  return (
    <div className="min-h-screen bg-blue-100">
      <header className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
          <h1 className="text-2xl font-bold mb-4 sm:mb-0">WeatherNow Dashboard</h1>
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <span className="text-center sm:text-left">Welcome, {user.email}</span>
            <Button onClick={handleLogout}>Logout</Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4">
        <div className="mb-8">
          <Input
            type="text"
            placeholder="Enter city name"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="max-w-xs mx-auto sm:mx-0"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Current Weather</h2>
            <div className="flex items-center space-x-4">
              {getWeatherIcon(weatherData.current.condition)}
              <div>
                <p className="text-4xl font-bold">{weatherData.current.temp}°F</p>
                <p className="text-xl">{weatherData.current.condition}</p>
              </div>
            </div>
            <div className="mt-4">
              <p>Humidity: {weatherData.current.humidity}%</p>
              <p>Wind Speed: {weatherData.current.windSpeed} mph</p>
            </div>
            <div className="mt-4 p-4 bg-blue-100 rounded-md">
              <p className="font-semibold">Recommendation:</p>
              <p>{getWeatherRecommendation()}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Hourly Forecast</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {weatherData.hourly.map((hour, index) => (
                <div key={index} className="text-center">
                  <p className="font-semibold">{hour.time}</p>
                  {getWeatherIcon(hour.condition)}
                  <p>{hour.temp}°F</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white p-6 rounded-lg shadow-md overflow-x-auto">
          <h2 className="text-2xl font-bold mb-4">5-Day Forecast</h2>
          <div className="grid grid-cols-5 gap-4 min-w-max sm:min-w-0">
            {weatherData.daily.map((day, index) => (
              <div key={index} className="text-center">
                <p className="font-semibold">{day.day}</p>
                {getWeatherIcon(day.condition)}
                <p>H: {day.high}°F</p>
                <p>L: {day.low}°F</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Top Weather Stories</h2>
          <ul className="space-y-2">
            {newsData.map((story, index) => (
              <li key={index}>
                <a href={story.url} className="text-blue-600 hover:underline">{story.title}</a>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  )
}