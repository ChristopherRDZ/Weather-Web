let searchCities = document.getElementById('search-city');
let listCitiesContainer = document.getElementById('display-cities');
let citiesList = document.getElementById('cities-list');
let cities = [];
let citiesMatch = [];
let citiesShown = [];
let forecastDayBtns = [];
let forecastDaySelected;
let citySelected, weather;
let weatherImgs = {
    'night': 'https://img.icons8.com/?size=100&id=VT8HlhlnhUwL&format=png&color=000000',
    'rainyNight': 'https://img.icons8.com/?size=100&id=wBPV56Uje50D&format=png&color=000000',
    'stormyNight': 'https://img.icons8.com/?size=100&id=PwHEPRMlRd4a&format=png&color=000000',
    'sunny': 'https://img.icons8.com/?size=100&id=8EUmYhfLPTCF&format=png&color=000000',
    'cloudy': 'https://img.icons8.com/?size=100&id=W8fUZZSmXssu&format=png&color=000000',
    'partlyCloudy': 'https://img.icons8.com/?size=100&id=zIVmoh4T8wh7&format=png&color=000000',
    'rainy': 'https://img.icons8.com/?size=100&id=kKxyuLXD4w0n&format=png&color=000000',
    'stormy': 'https://img.icons8.com/?size=100&id=DlsFhDMp4rhs&format=png&color=000000',
    'snowy': 'https://img.icons8.com/?size=100&id=5esfsIY8G6W1&format=png&color=000000'
};

document.getElementById("weather-box").classList.add('hideElement');
document.getElementById("forecast").classList.add('hideElement');

function getWeatherImg(weatherCode, isDay){
    if(isDay == 1){
        if(weatherCode == 0 || weatherCode == 1){
            return weatherImgs.sunny;
        }else if(weatherCode == 2 || weatherCode == 3 || weatherCode == 45 || weatherCode == 48){
            return weatherImgs.cloudy;
        }else if(weatherCode == 71 || weatherCode == 73 || weatherCode == 75 || weatherCode == 77 || weatherCode == 85 || weatherCode == 86){
            return weatherImgs.snowy;
        }else if(weatherCode == 95 || weatherCode == 96 || weatherCode == 99){
            return weatherImgs.stormy;
        }else{
            return weatherImgs.rainy;
        }
    }else{
        if(weatherCode == 0 || weatherCode == 1 ){
            return weatherImgs.night;
        }else if(weatherCode == 2 || weatherCode == 3 || weatherCode == 45 || weatherCode == 48){
            return weatherImgs.cloudy;
        }else if(weatherCode == 71 || weatherCode == 73 || weatherCode == 75 || weatherCode == 77 || weatherCode == 85 || weatherCode == 86){
            return weatherImgs.snowy;
        }else if(weatherCode == 95 || weatherCode == 96 || weatherCode == 99){
            return weatherImgs.stormyNight;
        }else{
            return weatherImgs.rainyNight;
        }
    }
}

function convertDay(day){
    switch(day){
        case 0:
            return 'Domingo';
        case 1:
            return 'Lunes';
        case 2:
            return 'Martes';
        case 3:
            return 'Miércoles';
        case 4:
            return 'Jueves';
        case 5:
            return 'Viernes';
        case 6:
            return 'Sábado';
    }
}

function convertMonth(month){
    switch(month){
        case 0:
            return 'Enero';
        case 1:
            return 'Febrero';
        case 2:
            return 'Marzo';
        case 3:
            return 'Abril';
        case 4:
            return 'Mayo';
        case 5:
            return 'Junio';
        case 6:
            return 'Julio';
        case 7:
            return 'Agosto';
        case 8:
            return 'Septiembre';
        case 9:
            return 'Octubre';
        case 10:
            return 'Noviembre';
        case 11:
            return 'Diciembre';
    }
}

async function loadCities() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/master/cities.json');
        cities = await response.json();
    } catch (error) {
        console.error('Error fetching cities:', error);
    }
}

async function loadWeather() {
    try {
        let latitude = citySelected.latitude;
        let longitude = citySelected.longitude;
        let response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m,precipitation_probability,is_day&hourly=temperature_2m,apparent_temperature,precipitation_probability,weather_code,wind_speed_10m,relative_humidity_2m,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_mean&timezone=auto`);
        weather = await response.json();
    } catch (error) {
        console.error('Error fetching weather:', error);
    }
}

searchCities.addEventListener('keyup', function() {
    try {
        let query = searchCities.value;
        if (query.length >= 1) {
            listCitiesContainer.classList.remove('hideElement');
            let firstOption = query.charAt(0).toUpperCase() + query.slice(1);
            let secondOption = query.charAt(0).toLowerCase() + query.slice(1);
            citiesMatch = [];
            for (let i = 0 ; i < cities.length; i++){
                let city = cities[i].name;
                if (city.startsWith(firstOption) || city.startsWith(secondOption)) {
                    citiesMatch.push(cities[i]); 
                }
            }
            let list = '';
            for (let i = 0; i < citiesMatch.length; i++) {
                list += `<li id="city${i}">${citiesMatch[i].name}, ${citiesMatch[i].state_name}, ${citiesMatch[i].country_name}</li>`;
            }
            citiesList.innerHTML = list;
        }else{
            listCitiesContainer.classList.add('hideElement');
            citiesList.innerHTML = '';
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

document.getElementById("search-box").addEventListener('mouseleave', function() {
    if (citiesMatch.length > 0) {
        listCitiesContainer.classList.add('hideElement');
    }
});

document.getElementById("search-box").addEventListener('mouseenter', function() {
    if (citiesMatch.length > 0) {
        listCitiesContainer.classList.remove('hideElement');
    }
});

listCitiesContainer.addEventListener('mouseenter', function() {
    for (let i = 0; i < citiesMatch.length; i++) {
        document.getElementById(`city${i}`).addEventListener('click', function() {
            searchCities.value = citiesMatch[i].name + ', ' + citiesMatch[i].state_name + ', ' + citiesMatch[i].country_name;
            citySelected = citiesMatch[i];
            listCitiesContainer.classList.add('hideElement');
            citiesList.innerHTML = '';
            loadWeather().then( () => {
                displayCurrentWeather();
                renderForecastDays();
            }).catch( (error) => {
                console.error('Error:', error);
            });
        });
    }
});

function displayCurrentWeather(){
    let temperature = weather.current.temperature_2m;
    let apparent_temperature = weather.current.apparent_temperature;
    let weatherCode = weather.current.weather_code;
    let windSpeed = weather.current.wind_speed_10m;
    let currentTime = new Date(weather.current.time);
    let year = currentTime.getFullYear();
    let month = currentTime.getMonth();
    let day = currentTime.getDate();
    let dayofweek = currentTime.getDay();
    let isDay = weather.current.is_day;
    let img = getWeatherImg(weatherCode, isDay);

    document.getElementById("weather-box").classList.remove('hideElement');

    let currentDayEl = document.getElementById('current-day');
    let currentWeatherIconEl = document.getElementById('current-weather-icon');
    let currentTemperatureEl = document.getElementById('current-weather-temp');
    let currentWeatherWindEl = document.getElementById('current-weather-wind');
    let currentWeatherApparentEl = document.getElementById('current-weather-apparent');

    currentDayEl.textContent = `${convertDay(dayofweek)} ${day} de ${convertMonth(month)} de ${year}, ${citySelected.name}, ${citySelected.state_name}, ${citySelected.country_code}`;
    currentWeatherIconEl.style.backgroundImage = `url(${img})`;
    currentTemperatureEl.textContent = `${temperature}°C`;
    currentWeatherWindEl.textContent = `${windSpeed} km/h`;
    currentWeatherApparentEl.textContent = `${apparent_temperature}°C`;
}

function renderForecastDays(){
    let forecastDays = weather.daily;
    let forecastDaysEl = document.getElementById('forecast-days');
    document.getElementById("forecast").classList.remove('hideElement');

    let forecastDaysHtml = '';
    for(let i = 0; i < 7; i++){
        let day = new Date(forecastDays.time[i] + "T00:00");
        let wc = forecastDays.weather_code[i];
        let img = getWeatherImg(wc, 1);
        let minTemp = forecastDays.temperature_2m_min[i];
        let maxTemp = forecastDays.temperature_2m_max[i];
        let precipitation = forecastDays.precipitation_probability_mean[i];

        forecastDaysHtml += `<div id="forecast-day${i}" class="forecast-day">
            <h3 id="forecast-day-week${i}" class="forecast-day-week">${convertDay(day.getDay())}</h3>
            <p id="forecast-day-date${i}" class="forecast-day-date">${day.getDate() + ' ' + convertMonth(day.getMonth()).slice(0, 3)}</p>
            <div id="forecast-day-img${i}" class="forecast-day-img" style="background-image: url(${img})"></div>
            <p id="forecast-day-precipitation${i}" class="forecast-precipitation">${precipitation}%</p>
            <p><span id="day-minTemp${i}" class="minTemp">${maxTemp}°</span>/<span id="day-maxTemp${i}" class="maxTemp">${minTemp}°</span></p>
        </div>`;
    }
    forecastDaysEl.innerHTML = forecastDaysHtml;
    forecastDayBtns = [];
    for(let i = 0; i < 7; i++){
        forecastDayBtns.push(document.getElementById(`forecast-day${i}`));
    }

    forecastDaySelected = 0;
    renderForecastDaysHours();
    forecastDayBtns[0].style.border = '0.125rem solid #0004ff';
    
    for (let i = 0; i < forecastDayBtns.length; i++) {
        forecastDayBtns[i].addEventListener('click', function() {
            forecastDaySelected = i;
            forecastDayBtns[i].style.border = '0.125rem solid #0004ff';
            for(let j = 0; j < forecastDayBtns.length; j++){
                if(j != i){
                    forecastDayBtns[j].style.border = '';
                }
            }
            renderForecastDaysHours();
            console.log('click');
        });
    }
}

function renderForecastDaysHours(){
    let forecastHours = weather.hourly;
    let forecastHoursEl = document.getElementById('forecast-hours');
    let forecastHoursHtml = '';

    let start = forecastDaySelected * 24;
    let end = start + 24;
    for(let i = start; i < end; i++){
        let hour = new Date(forecastHours.time[i]);
        let wc = forecastHours.weather_code[i];
        let img = getWeatherImg(wc, forecastHours.is_day[i]);
        let temp = forecastHours.temperature_2m[i];
        let apparent = forecastHours.apparent_temperature[i];
        let wind = forecastHours.wind_speed_10m[i];
        let precipitation = forecastHours.precipitation_probability[i];
        let humidity = forecastHours.relative_humidity_2m[i];

        forecastHoursHtml += `<div id="forecast-hour${i}" class="forecast-hour">
            <p id="forecast-hour-time${i}" class="forecast-hour-time">${hour.getHours()}:00</p>
            <div id="forecast-hour-img${i}" class="forecast-hour-img" style="background-image: url(${img})"></div>
            <p id="forecast-hour-precipitation${i}" class="forecast-hour-precipitation">${precipitation}%</p>
            <p id="forecast-hour-temp${i}" class="forecast-hour-temp">${Math.round(temp)}°C</p>
            <p id="forecast-hour-wind${i}" class="forecast-hour-wind">Viento: ${wind}km/h</p>
            <p id="forecast-hour-apparent${i}" class="forecast-hour-apparent">Sensación Térmica: ${apparent}°C</p>
            <p id="forecast-hour-humidity${i}" class="forecast-hour-humidity">Humedad: ${humidity}%</p>
        </div>`;
    }
    forecastHoursEl.innerHTML = forecastHoursHtml;
}

document.addEventListener('DOMContentLoaded', loadCities);