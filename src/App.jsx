import React, { useState } from 'react';
import { Cloud, CloudRain, Wind, Thermometer, AlertTriangle, Calendar, MapPin, CheckCircle } from 'lucide-react';

function App() {
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const analyzeWeather = async () => {
    if (!location || !date) {
      setError('Please enter both location and date');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      // Step 1: Geocode location
      const geoResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1&language=en&format=json`
      );
      const geoData = await geoResponse.json();

      if (!geoData.results || geoData.results.length === 0) {
        setError('Location not found. Try a different city name.');
        setLoading(false);
        return;
      }

      const { latitude, longitude, name, country } = geoData.results[0];

      // Step 2: Get weather forecast
      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max,relative_humidity_2m_mean&timezone=auto&start_date=${date}&end_date=${date}`
      );
      const weatherData = await weatherResponse.json();

      if (!weatherData.daily) {
        setError('Weather data not available for this date.');
        setLoading(false);
        return;
      }

      const daily = weatherData.daily;
      const tempMax = daily.temperature_2m_max[0];
      const tempMin = daily.temperature_2m_min[0];
      const precipitation = daily.precipitation_sum[0];
      const windSpeed = daily.windspeed_10m_max[0];
      const humidity = daily.relative_humidity_2m_mean[0];

      // Analysis thresholds
      const warnings = [];

      if (tempMax > 35) {
        warnings.push({
          type: 'very hot',
          icon: '🔥',
          severity: 'high',
          message: `Very Hot: ${tempMax}°C expected`,
          advice: 'Stay hydrated, seek shade, avoid midday activities'
        });
      }

      if (tempMin < 0) {
        warnings.push({
          type: 'very cold',
          icon: '❄️',
          severity: 'high',
          message: `Very Cold: ${tempMin}°C expected`,
          advice: 'Dress warmly, protect extremities, check for ice'
        });
      }

      if (precipitation > 10) {
        warnings.push({
          type: 'very wet',
          icon: '🌧️',
          severity: 'high',
          message: `Very Wet: ${precipitation}mm rain expected`,
          advice: 'Bring waterproof gear, consider indoor backup plan'
        });
      } else if (precipitation > 2) {
        warnings.push({
          type: 'light rain',
          icon: '🌦️',
          severity: 'medium',
          message: `Light Rain: ${precipitation}mm expected`,
          advice: 'Pack an umbrella or light rain jacket'
        });
      }

      if (windSpeed > 40) {
        warnings.push({
          type: 'very windy',
          icon: '💨',
          severity: 'high',
          message: `Very Windy: ${windSpeed} km/h gusts`,
          advice: 'Secure loose items, avoid tall structures'
        });
      }

      // Discomfort index (simplified heat index)
      if (tempMax > 28 && humidity > 70) {
        warnings.push({
          type: 'very uncomfortable',
          icon: '😰',
          severity: 'medium',
          message: `Uncomfortable: High heat + ${humidity}% humidity`,
          advice: 'Heat index will feel much hotter, limit outdoor activities'
        });
      }

      setResult({
        location: `${name}, ${country}`,
        date: date,
        coords: { latitude, longitude },
        weather: {
          tempMax,
          tempMin,
          precipitation,
          windSpeed,
          humidity
        },
        warnings,
        safe: warnings.length === 0
      });

    } catch (err) {
      setError('Failed to fetch weather data. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'high': return 'bg-red-100 border-red-300 text-red-800';
      case 'medium': return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      default: return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🎉 Will It Rain on My Parade?
          </h1>
          <p className="text-gray-600">
            Check weather conditions for your outdoor events
          </p>
        </div>

        {/* Input Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 mr-1" />
                Location
              </label>
              <input
                type="text"
                placeholder="e.g., London, Tokyo, New York"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && analyzeWeather()}
              />
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 mr-1" />
                Event Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                max={new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <button
            onClick={analyzeWeather}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Analyzing Weather...' : 'Check My Event Weather'}
          </button>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-4">
            {/* Location & Date Info */}
            <div className="bg-white rounded-xl shadow-md p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{result.location}</h2>
                  <p className="text-gray-600">{new Date(result.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                {result.safe && (
                  <CheckCircle className="w-12 h-12 text-green-500" />
                )}
              </div>

              {/* Weather Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <div className="bg-orange-50 p-3 rounded-lg">
                  <Thermometer className="w-5 h-5 text-orange-500 mb-1" />
                  <div className="text-xs text-gray-600">High</div>
                  <div className="text-lg font-bold text-gray-800">{result.weather.tempMax}°C</div>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <Thermometer className="w-5 h-5 text-blue-500 mb-1" />
                  <div className="text-xs text-gray-600">Low</div>
                  <div className="text-lg font-bold text-gray-800">{result.weather.tempMin}°C</div>
                </div>
                <div className="bg-cyan-50 p-3 rounded-lg">
                  <CloudRain className="w-5 h-5 text-cyan-500 mb-1" />
                  <div className="text-xs text-gray-600">Rain</div>
                  <div className="text-lg font-bold text-gray-800">{result.weather.precipitation}mm</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <Wind className="w-5 h-5 text-gray-500 mb-1" />
                  <div className="text-xs text-gray-600">Wind</div>
                  <div className="text-lg font-bold text-gray-800">{result.weather.windSpeed} km/h</div>
                </div>
              </div>
            </div>

            {/* Warnings or All Clear */}
            {result.safe ? (
              <div className="bg-green-50 border-2 border-green-300 rounded-xl p-6 text-center">
                <div className="text-6xl mb-3">☀️</div>
                <h3 className="text-2xl font-bold text-green-800 mb-2">All Clear!</h3>
                <p className="text-green-700">
                  Weather conditions look favorable for your outdoor event. Have a great time!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-gray-800 flex items-center">
                  <AlertTriangle className="w-6 h-6 text-yellow-500 mr-2" />
                  Weather Advisories
                </h3>
                {result.warnings.map((warning, idx) => (
                  <div
                    key={idx}
                    className={`border-2 rounded-xl p-5 ${getSeverityColor(warning.severity)}`}
                  >
                    <div className="flex items-start">
                      <span className="text-3xl mr-3">{warning.icon}</span>
                      <div className="flex-1">
                        <h4 className="font-bold text-lg mb-1">{warning.message}</h4>
                        <p className="text-sm opacity-90">{warning.advice}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>Data from Open-Meteo API • Forecast up to 14 days ahead</p>
          <p className="mt-1">Created for NASA Space Apps Challenge 2024</p>
        </div>
      </div>
    </div>
  );
}

export default App;