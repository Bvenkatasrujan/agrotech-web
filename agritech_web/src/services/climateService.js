
/**
 * Climate Service using Open-Meteo API (No API key required for non-commercial use)
 * Supports Geocoding (City to Lat/Lon) and Weather Forecasting.
 */

export const climateService = {
    getWeather: async (city) => {
        try {
            // 1. Geocoding: Get Lat/Lon for the city name
            const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`);
            const geoData = await geoRes.json();

            if (!geoData.results || geoData.results.length === 0) {
                throw new Error('City not found');
            }

            const { latitude, longitude, name, country } = geoData.results[0];

            // 2. Weather Forecast: Get current and daily data
            const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,surface_pressure,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=auto`);
            const weatherData = await weatherRes.json();

            // Open-Meteo uses WMO Weather interpretation codes
            const interpretWmoCode = (code) => {
                const codes = {
                    0: 'Clear sky',
                    1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
                    45: 'Fog', 48: 'Depositing rime fog',
                    51: 'Light drizzle', 53: 'Moderate drizzle', 55: 'Dense drizzle',
                    61: 'Slight rain', 63: 'Moderate rain', 65: 'Heavy rain',
                    71: 'Slight snow', 73: 'Moderate snow', 75: 'Heavy snow',
                    77: 'Snow grains',
                    80: 'Slight rain showers', 81: 'Moderate rain showers', 82: 'Violent rain showers',
                    85: 'Slight snow showers', 86: 'Heavy snow showers',
                    95: 'Thunderstorm', 96: 'Thunderstorm with slight hail', 99: 'Thunderstorm with heavy hail'
                };
                return codes[code] || 'Unknown';
            };

            // Process 5-day forecast
            const forecast = [];
            for (let i = 0; i < 5; i++) {
                forecast.push({
                    date: new Date(weatherData.daily.time[i]).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
                    temp: Math.round((weatherData.daily.temperature_2m_max[i] + weatherData.daily.temperature_2m_min[i]) / 2),
                    description: interpretWmoCode(weatherData.daily.weather_code[i])
                });
            }

            return {
                temp: Math.round(weatherData.current.temperature_2m),
                condition: interpretWmoCode(weatherData.daily.weather_code[0]),
                humidity: weatherData.current.relative_humidity_2m,
                wind: Math.round(weatherData.current.wind_speed_10m),
                pressure: weatherData.current.surface_pressure,
                sunrise: new Date(weatherData.daily.sunrise[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                sunset: new Date(weatherData.daily.sunset[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                aqi: 1, // Open-Meteo has a separate Air Quality API if needed
                forecast: forecast,
                name: `${name}, ${country}`
            };

        } catch (error) {
            console.error("Weather API Error:", error);
            throw error;
        }
    }
};
