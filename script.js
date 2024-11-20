import CONFIG from './config.js';

const apiKey = CONFIG.API_KEY;
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=";
let unit = "metric";
let currentCity = "Buffalo"
const units = {
    metric: {
        temp: "°C",
        windSpeed: "km/hr",
        visibility: "km"
    },
    imperial: {
        temp: "°F",
        windSpeed: "mph",
        visibility: "mi"
    }
}

const weatherIcons = {
    Thunderstorm: '<i class="fa-solid fa-cloud-bolt fa-8x"></i>',
    Drizzle: '<i class="fa-solid fa-cloud-rain fa-8x"></i>',
    Rain: '<i class="fa-solid fa-cloud-showers-heavy fa-8x"></i>',
    Snow: '<i class="fa-solid fa-snowflake"></i>',
    Mist: '<i class="fa-solid fa-smog fa-8x"></i>',
    Smoke: '<i class="fa-solid fa-smog fa-8x"></i>',
    Haze: '<i class="fa-solid fa-smog fa-8x"></i>',
    Dust: '<i class="fa-solid fa-smog fa-8x"></i>',
    Fog: '<i class="fa-solid fa-smog fa-8x"></i>',
    Sand: '<i class="fa-solid fa-smog fa-8x"></i>',
    Dust: '<i class="fa-solid fa-smog fa-8x"></i>',
    Ash: '<i class="fa-solid fa-smog fa-8x"></i>',
    Squall: '<i class="fa-solid fa-smog fa-8x"></i>',
    Tornado: '<i class="fa-solid fa-tornado fa-8x"></i>',
    Clear: '<i class="fa-solid fa-cloud-sun fa-8x"></i>',
    Clouds: '<i class="fa-solid fa-cloud fa-8x"></i>'
}

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const toggleBox = document.getElementById("unit");

function getTimeInTimezone(unixTimestamp, timezoneOffset) {
    const date = new Date(parseInt(unixTimestamp) * 1000);
    const utcTime = date.getTime();
    const offsetInMilliseconds = timezoneOffset * 1000;
    const timezoneTime = new Date(utcTime + offsetInMilliseconds);
    let hours = timezoneTime.getUTCHours();
    const minutes = timezoneTime.getUTCMinutes().toString().padStart(2, '0');
    const amOrPm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const formattedTime = `${hours}:${minutes} ${amOrPm}`;
    return formattedTime;
}

function formatDate(unixTimestamp) {
    const date = new Date(parseInt(unixTimestamp) * 1000);
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const dayOfWeek = days[date.getUTCDay()];
    const month = months[date.getUTCMonth()];
    const day = date.getUTCDate();

    return `${dayOfWeek}, ${month} ${day}`;
}

async function checkWeather(city) {
    unit = toggleBox.checked ? "imperial" : "metric";
    currentCity = city || currentCity;
    let finalUrl = apiUrl + `${city}&appid=${apiKey}&units=${unit}`;
    const response = await fetch(finalUrl);
    if (response.status === 404 || response.status === 400) {
        document.querySelector(".error").style.display = "block";
    } else {
        document.querySelector(".error").style.display = "none";
        let data = await response.json();
        document.querySelector(".city").innerHTML = data.name;
        document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + (unit === "metric" ? units.metric.temp : units.imperial.temp);
        document.querySelector(".humidity").innerHTML = Math.round(data.main.humidity) + " %";
        document.querySelector(".wind-speed").innerHTML = unit === "metric" ? `${Math.round(data.wind.speed * 3.6)} ${units.metric.windSpeed}` : `${Math.round(data.wind.speed)} ${units.imperial.windSpeed}`;
        document.querySelector(".sunrise").innerHTML = getTimeInTimezone(data.sys.sunrise, data.timezone);
        document.querySelector(".sunset").innerHTML = getTimeInTimezone(data.sys.sunset, data.timezone);
        document.querySelector('.date').innerHTML = formatDate(data.dt);
        document.querySelector('.feels-like').innerHTML = `Feels like ${Math.round(data.main.feels_like)} ${unit === "metric" ? units.metric.temp : units.imperial.temp}`;
        document.querySelector('.visibility').innerHTML = unit === "metric" ? `${Math.round(data.visibility / 1000)} ${units.metric.visibility}` : `${Math.round(data.visibility / 1609)} ${units.imperial.visibility}`;
        document.querySelector('.pressure').innerHTML = data.main.pressure + " hPa";
        document.querySelector('.weather-icon').innerHTML = weatherIcons[data.weather[0].main];
    }
}


searchBtn.addEventListener("click", () => {
    checkWeather(searchBox.value);
});

toggleBox.addEventListener("click", () => {
    let city = searchBox.value;
    if (!city) {
        checkWeather(currentCity);
    } else {
        checkWeather(searchBox.value);
    }

})
checkWeather("Buffalo");