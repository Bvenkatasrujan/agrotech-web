
async function testWeather() {
    const city = "London";
    try {
        const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`);
        const geoData = await geoRes.json();
        console.log("GeoData:", !!geoData.results);

        const { latitude, longitude } = geoData.results[0];
        const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m&daily=weather_code&timezone=auto`);
        const weatherData = await weatherRes.json();
        console.log("WeatherData Status:", !!weatherData.current);
        console.log("Current Temp:", weatherData.current.temperature_2m);
    } catch (err) {
        console.error("Test Failed:", err);
    }
}
testWeather();
