# 🎉 Will It Rain on My Parade?

A weather advisory app for outdoor event planning, built for NASA Space Apps Challenge 2024.

## 🌟 Features

- **Location Search**: Check weather for any city worldwide
- **Date Selection**: Plan events up to 14 days in advance
- **5 Weather Conditions Analysis**:
  - 🔥 Very Hot (>35°C)
  - ❄️ Very Cold (<0°C)
  - 🌧️ Very Wet (>10mm rain)
  - 💨 Very Windy (>40 km/h)
  - 😰 Very Uncomfortable (high heat + humidity)
- **Visual Warnings**: Color-coded severity levels with actionable advice
- **Real-time Data**: Uses Open-Meteo API for accurate forecasts

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ installed
- npm or yarn package manager

### Local Development

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/weather-parade.git
cd weather-parade
```

2. **Install dependencies**
```bash
npm install
```

3. **Run development server**
```bash
npm run dev
```

4. **Open in browser**
```
http://localhost:5173
```

### Build for Production

```bash
npm run build
```

## 🌐 Deployment

This app is deployed on Vercel. Every push to the main branch automatically deploys.

**Live Demo**: [Your Vercel URL]

## 🛠️ Tech Stack

- **React** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Open-Meteo API** - Weather data (no API key required!)

## 📊 Data Sources

- Weather forecasts from [Open-Meteo](https://open-meteo.com/)
- Geocoding via Open-Meteo Geocoding API

## 👨‍💻 Author

**Ali Nasir**
- Specialization: AI, Data Science, Computer Vision
- Challenge: NASA Space Apps Challenge 2025

## 📝 License

MIT License - feel free to use this project for your own purposes!

## 🙏 Acknowledgments

- NASA Space Apps Challenge 2024
- Open-Meteo for free weather data API
- All the amazing open-source libraries used in this project