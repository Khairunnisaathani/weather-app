const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const message = document.getElementById("message");
const weatherResult = document.getElementById("weatherResult");

// Weather description and icons
function getWeatherInfo(code) {

    const weatherTypes = {
        0: ["Clear Sky", "☀️"],
        1: ["Mainly Clear", "🌤️"],
        2: ["Partly Cloudy", "⛅"],
        3: ["Overcast", "☁️"],
        45: ["Foggy", "🌫️"],
        48: ["Depositing Rime Fog", "🌫️"],
        51: ["Light Drizzle", "🌦️"],
        53: ["Moderate Drizzle", "🌦️"],
        55: ["Dense Drizzle", "🌧️"],
        61: ["Slight Rain", "🌧️"],
        63: ["Moderate Rain", "🌧️"],
        65: ["Heavy Rain", "🌧️"],
        71: ["Slight Snow", "🌨️"],
        73: ["Moderate Snow", "❄️"],
        75: ["Heavy Snow", "❄️"],
        80: ["Rain Showers", "🌦️"],
        81: ["Moderate Rain Showers", "🌧️"],
        82: ["Heavy Rain Showers", "⛈️"],
        95: ["Thunderstorm", "⛈️"],
        96: ["Thunderstorm with Hail", "⛈️"],
        99: ["Heavy Thunderstorm with Hail", "⛈️"]
    };

    return weatherTypes[code] || ["Unknown Weather", "🌡️"];
}


// Fetch weather information
async function getWeather() {

    const city = cityInput.value.trim();

    // Check empty input
    if (city === "") {
        weatherResult.hidden = true;
        message.textContent = "Please enter a city name.";
        return;
    }

    // Loading state
    searchBtn.disabled = true;
    searchBtn.textContent = "Loading...";
    message.textContent = "Fetching weather information...";
    weatherResult.hidden = true;

    try {

        // Step 1: Find city coordinates
        const geoURL =
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

        const geoResponse = await fetch(geoURL);

        if (!geoResponse.ok) {
            throw new Error("Unable to find city information.");
        }

        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            throw new Error("City not found. Please enter a valid city name.");
        }

        const location = geoData.results[0];

        const latitude = location.latitude;
        const longitude = location.longitude;

        // Step 2: Get weather using coordinates
        const weatherURL =
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto`;

        const weatherResponse = await fetch(weatherURL);

        if (!weatherResponse.ok) {
            throw new Error("Unable to fetch weather information.");
        }

        const weatherData = await weatherResponse.json();

        const current = weatherData.current;

        // Step 3: Display weather information
        const weatherInfo = getWeatherInfo(current.weather_code);

        document.getElementById("cityName").textContent =
            `${location.name}, ${location.country}`;

        document.getElementById("weatherIcon").textContent =
            weatherInfo[1];

        document.getElementById("temperature").textContent =
            `${current.temperature_2m}°C`;

        document.getElementById("description").textContent =
            weatherInfo[0];

        document.getElementById("feelsLike").textContent =
            `${current.apparent_temperature}°C`;

        document.getElementById("humidity").textContent =
            `${current.relative_humidity_2m}%`;

        document.getElementById("windSpeed").textContent =
            `${current.wind_speed_10m} km/h`;

        message.textContent = "Weather information loaded successfully!";

        weatherResult.hidden = false;

    }

    catch (error) {

        message.textContent = error.message;
        weatherResult.hidden = true;

    }

    finally {

        searchBtn.disabled = false;
        searchBtn.textContent = "Search";

    }
}


// Button click event
searchBtn.addEventListener("click", getWeather);


// Enter key event
cityInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        getWeather();
    }

});