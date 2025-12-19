
const API_KEY = "bd5e378503939ddaee76f12ad7a97608";
const city = "London";
const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`;

fetch(url)
    .then(res => {
        console.log("Status:", res.status);
        return res.json();
    })
    .then(data => console.log("Data:", JSON.stringify(data, null, 2)))
    .catch(err => console.error("Error:", err));
