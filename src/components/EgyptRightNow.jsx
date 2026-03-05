import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

/**
 * Weather code to emoji/description mapping (WMO Weather interpretation codes)
 * https://open-meteo.com/en/docs#weathervariables
 */
const weatherCodeMap = {
  0: { emoji: '☀️', desc: 'Clear Sky' },
  1: { emoji: '🌤️', desc: 'Mainly Clear' },
  2: { emoji: '⛅', desc: 'Partly Cloudy' },
  3: { emoji: '☁️', desc: 'Overcast' },
  45: { emoji: '🌫️', desc: 'Foggy' },
  48: { emoji: '🌫️', desc: 'Depositing Rime Fog' },
  51: { emoji: '🌦️', desc: 'Light Drizzle' },
  53: { emoji: '🌦️', desc: 'Moderate Drizzle' },
  55: { emoji: '🌦️', desc: 'Dense Drizzle' },
  56: { emoji: '🌧️', desc: 'Freezing Drizzle' },
  57: { emoji: '🌧️', desc: 'Dense Freezing Drizzle' },
  61: { emoji: '🌧️', desc: 'Slight Rain' },
  63: { emoji: '🌧️', desc: 'Moderate Rain' },
  65: { emoji: '🌧️', desc: 'Heavy Rain' },
  66: { emoji: '🌧️', desc: 'Freezing Rain' },
  67: { emoji: '🌧️', desc: 'Heavy Freezing Rain' },
  71: { emoji: '🌨️', desc: 'Slight Snowfall' },
  73: { emoji: '🌨️', desc: 'Moderate Snowfall' },
  75: { emoji: '❄️', desc: 'Heavy Snowfall' },
  77: { emoji: '🌨️', desc: 'Snow Grains' },
  80: { emoji: '🌦️', desc: 'Slight Showers' },
  81: { emoji: '🌧️', desc: 'Moderate Showers' },
  82: { emoji: '⛈️', desc: 'Violent Showers' },
  85: { emoji: '🌨️', desc: 'Slight Snow Showers' },
  86: { emoji: '🌨️', desc: 'Heavy Snow Showers' },
  95: { emoji: '⛈️', desc: 'Thunderstorm' },
  96: { emoji: '⛈️', desc: 'Thunderstorm w/ Hail' },
  99: { emoji: '⛈️', desc: 'Thunderstorm w/ Heavy Hail' },
}

const getWeather = (code) => weatherCodeMap[code] || { emoji: '🌡️', desc: 'Unknown' }

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const dayNamesShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

// Cairo coordinates
const CAIRO_LAT = 30.0444
const CAIRO_LON = 31.2357

/**
 * EgyptRightNow — Real-time Egypt info widget
 * Shows current time, date, weather, and 7-day forecast for Cairo, Egypt
 * Uses Open-Meteo free API (no key required)
 */
const EgyptRightNow = () => {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Fetch weather data from Open-Meteo
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true)
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${CAIRO_LAT}&longitude=${CAIRO_LON}&current=temperature_2m,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=Africa%2FCairo&forecast_days=7`
        const res = await fetch(url)
        if (!res.ok) throw new Error('Weather API error')
        const data = await res.json()
        setWeather(data)
        setError(null)
      } catch (err) {
        console.error('Failed to fetch weather:', err)
        setError('Unable to load weather data')
      } finally {
        setLoading(false)
      }
    }

    fetchWeather()
    // Refresh weather every 15 minutes
    const weatherInterval = setInterval(fetchWeather, 15 * 60 * 1000)
    return () => clearInterval(weatherInterval)
  }, [])

  // Format time for Cairo (EET/EEST)
  const cairoTime = currentTime.toLocaleTimeString('en-US', {
    timeZone: 'Africa/Cairo',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  })

  const cairoDate = new Date(currentTime.toLocaleString('en-US', { timeZone: 'Africa/Cairo' }))
  const dayName = dayNames[cairoDate.getDay()]
  const monthName = monthNames[cairoDate.getMonth()]
  const dayNumber = cairoDate.getDate()
  const year = cairoDate.getFullYear()

  // Determine timezone abbreviation
  const tzAbbr = currentTime.toLocaleString('en-US', { timeZone: 'Africa/Cairo', timeZoneName: 'short' }).split(' ').pop()

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.2 },
    },
  }

  return (
    <div className="bg-white py-12 md:py-16">
      <div className="container-custom">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <span className="inline-block text-primary-500 text-sm font-semibold uppercase tracking-wider mb-3">
            Live from Cairo
          </span>
          <h2
            className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Egypt Right Now
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-sm md:text-base">
            Real-time conditions in Cairo — plan your visit with up-to-date info
          </p>
        </motion.div>

        {/* Info Cards Row */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8"
        >
          {/* Current Time Card */}
          <motion.div
            variants={fadeInUp}
            className="bg-gray-50 border border-gray-200 rounded-2xl p-5 md:p-6 text-center hover:bg-gray-100 transition-colors duration-300"
          >
            <div className="text-3xl mb-3">🕐</div>
            <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Current Time</p>
            <p className="text-gray-900 text-xl md:text-2xl font-bold tabular-nums">{cairoTime}</p>
            <p className="text-primary-500 text-xs mt-1 font-medium">{tzAbbr}</p>
          </motion.div>

          {/* Today's Date Card */}
          <motion.div
            variants={fadeInUp}
            className="bg-gray-50 border border-gray-200 rounded-2xl p-5 md:p-6 text-center hover:bg-gray-100 transition-colors duration-300"
          >
            <div className="text-3xl mb-3">📅</div>
            <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Today's Date</p>
            <p className="text-gray-900 text-lg md:text-xl font-bold">
              {monthName} {dayNumber}, {year}
            </p>
            <p className="text-primary-500 text-xs mt-1 font-medium">{dayName}</p>
          </motion.div>

          {/* Current Weather Card */}
          <motion.div
            variants={fadeInUp}
            className="bg-gray-50 border border-gray-200 rounded-2xl p-5 md:p-6 text-center hover:bg-gray-100 transition-colors duration-300"
          >
            {loading ? (
              <>
                <div className="text-3xl mb-3 animate-pulse">🌡️</div>
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Current Weather</p>
                <div className="h-7 bg-gray-200 rounded w-20 mx-auto animate-pulse" />
              </>
            ) : error ? (
              <>
                <div className="text-3xl mb-3">⚠️</div>
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Current Weather</p>
                <p className="text-gray-400 text-sm">Unavailable</p>
              </>
            ) : weather?.current ? (
              <>
                <div className="text-3xl mb-3">{getWeather(weather.current.weather_code).emoji}</div>
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Current Weather</p>
                <p className="text-gray-900 text-xl md:text-2xl font-bold">
                  {Math.round(weather.current.temperature_2m)}°C
                </p>
                <p className="text-primary-500 text-xs mt-1 font-medium">
                  {getWeather(weather.current.weather_code).desc}
                </p>
              </>
            ) : null}
          </motion.div>

          {/* Today's Range Card */}
          <motion.div
            variants={fadeInUp}
            className="bg-gray-50 border border-gray-200 rounded-2xl p-5 md:p-6 text-center hover:bg-gray-100 transition-colors duration-300"
          >
            {loading ? (
              <>
                <div className="text-3xl mb-3 animate-pulse">🌡️</div>
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Today's Range</p>
                <div className="h-7 bg-gray-200 rounded w-24 mx-auto animate-pulse" />
              </>
            ) : error ? (
              <>
                <div className="text-3xl mb-3">⚠️</div>
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Today's Range</p>
                <p className="text-gray-400 text-sm">Unavailable</p>
              </>
            ) : weather?.daily ? (
              <>
                <div className="text-3xl mb-3">🌡️</div>
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Today's Range</p>
                <p className="text-gray-900 text-lg md:text-xl font-bold">
                  {Math.round(weather.daily.temperature_2m_max[0])}° / {Math.round(weather.daily.temperature_2m_min[0])}°
                </p>
                <p className="text-primary-500 text-xs mt-1 font-medium">
                  Wind: {Math.round(weather.current.wind_speed_10m)} km/h
                </p>
              </>
            ) : null}
          </motion.div>
        </motion.div>

        {/* 7-Day Forecast */}
        {!loading && !error && weather?.daily && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-4 text-center">
              7-Day Weather Forecast
            </h3>
            <div className="grid grid-cols-7 gap-2 md:gap-3">
              {weather.daily.time.map((date, index) => {
                const forecastDate = new Date(date + 'T00:00:00')
                const isToday = index === 0
                const dayLabel = isToday ? 'Today' : index === 1 ? 'Tomorrow' : dayNamesShort[forecastDate.getDay()]
                const weatherInfo = getWeather(weather.daily.weather_code[index])

                return (
                  <motion.div
                    key={date}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    className={`rounded-xl p-3 md:p-4 text-center transition-colors duration-300 ${
                      isToday
                        ? 'bg-primary-50 border border-primary-300'
                        : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <p className={`text-xs font-semibold mb-2 ${isToday ? 'text-primary-500' : 'text-gray-400'}`}>
                      {dayLabel}
                    </p>
                    <div className="text-xl md:text-2xl mb-2">{weatherInfo.emoji}</div>
                    <p className="text-gray-900 text-sm font-bold">
                      {Math.round(weather.daily.temperature_2m_max[index])}°
                    </p>
                    <p className="text-gray-400 text-xs">
                      {Math.round(weather.daily.temperature_2m_min[index])}°
                    </p>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* Loading state for forecast */}
        {loading && (
          <div className="text-center py-8">
            <div className="inline-flex items-center gap-2 text-gray-400 text-sm">
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Loading weather data...
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default EgyptRightNow