# WeatherNow App

WeatherNow is a full-stack weather application that provides real-time weather information, forecasts, and related news for any location worldwide. Built with React for the frontend and Node.js with Express for the backend, this app offers a comprehensive and user-friendly weather experience.


## Features

- **Real-time Weather Data**: Get up-to-date weather information for any global location.
- **Geolocation Support**: Automatically fetch weather data based on the user's current location.
- **City-based Search**: Look up weather information for any city worldwide.
- **7-Day Forecast**: View a week-long weather forecast to plan ahead.
- **Hourly Forecast**: Access detailed hour-by-hour weather predictions.
- **Weather-based Recommendations**: Receive smart suggestions based on current and upcoming weather conditions.
- **Temperature Unit Conversion**: Toggle between Celsius and Fahrenheit.
- **Responsive Design**: Enjoy a seamless experience across desktop and mobile devices.
- **Weather-related News**: Stay informed with the latest weather stories for your area.

## Technologies Used

- Frontend:
  - React
  - React Router for navigation
  - Axios for API requests
  - Tailwind CSS for styling
  - Framer Motion for animations
  - Lucide React for icons
- Backend:
  - Node.js
  - Express.js
  - Axios for external API requests
- APIs:
  - WeatherAPI for weather data
  - GNews API for weather-related news

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/weathernow-app.git
   cd weathernow-app
   ```

2. Install dependencies for both frontend and backend:
   ```
   cd frontend
   npm install
   cd ../backend
   npm install
   ```

3. Create a `.env` file in the backend directory with your API keys:
   ```
   REACT_WEATHER_API_KEY=your_weatherapi_key
   REACT_GNEWS_API_KEY=your_gnews_api_key
   ```

### Running the App

1. Start the backend server:
   ```
   cd backend
   node server.js
   ```

2. In a new terminal, start the frontend development server:
   ```
   cd frontend
   npm start
   ```

3. Open your browser and navigate to `http://localhost:3000` to use the app.

## Project Structure

- `/frontend`: Contains the React frontend application
  - `/src`: Source files for the React app
    - `/components`: Reusable React components
    - `/pages`: Main page components (LandingPage, Dashboard)
- `/backend`: Contains the Node.js/Express backend application
  - `server.js`: Main server file
  - `/routes`: API route definitions
  - `/controllers`: Request handlers for routes

## Acknowledgments

- [WeatherAPI](https://www.weatherapi.com/) for providing weather data
- [GNews API](https://gnews.io/) for weather-related news articles
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Framer Motion](https://www.framer.com/motion/) for smooth animations
- [Lucide React](https://lucide.dev/) for beautiful icons

