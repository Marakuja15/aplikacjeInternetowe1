
const API_KEY = 'b3017924b9479c09456f4b5da5f562a7'; 


const btn = document.getElementById('getWeatherBtn');
const input = document.getElementById('cityInput');
const currentSection = document.getElementById('currentWeatherSection');
const forecastSection = document.getElementById('forecastSection');

btn.addEventListener('click', function() {
    const city = input.value.trim();

    if (city === "") {
        alert("Proszę wpisać nazwę miasta.");
        return;
    }

    currentSection.innerHTML = '<p>Ładowanie pogody bieżącej...</p>';
    forecastSection.innerHTML = '<p>Ładowanie prognozy...</p>';

    getCurrentWeatherXHR(city);
    getForecastFetch(city);
});


function getCurrentWeatherXHR(city) {
    const xhr = new XMLHttpRequest();
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=pl`;

    xhr.open('GET', url, true);

    xhr.onload = function() {
        if (this.status === 200) {
            const data = JSON.parse(this.responseText);
            console.log("Otrzymane dane z API (Current):", data);
            displayCurrentWeather(data);
        } else {
            currentSection.innerHTML = `<p class="error">Błąd XHR: ${this.status} - Nie znaleziono miasta lub błędny klucz API.</p>`;
        }
    };

    xhr.onerror = function() {
        currentSection.innerHTML = '<p class="error">Wystąpił błąd połączenia (XHR).</p>';
    };

    xhr.send();
}

function getForecastFetch(city) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=pl`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Błąd HTTP: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Dane prognozy (Fetch):", data);
            displayForecast(data);
        })
        .catch(error => {
            forecastSection.innerHTML = `<p class="error">Błąd Fetch: ${error.message}</p>`;
        });
}

function displayCurrentWeather(data) {
    const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    
    const html = `
        <h2>Pogoda teraz: ${data.name}, ${data.sys.country}</h2>
        <div class="weather-card current-card">
            <img src="${iconUrl}" alt="Ikona pogody">
            <div>
                <p><strong>Temperatura:</strong> ${Math.round(data.main.temp)}°C</p>
                <p><strong>Odczuwalna:</strong> ${Math.round(data.main.feels_like)}°C</p>
                <p><strong>Opis:</strong> ${data.weather[0].description}</p>
                <p><strong>Wilgotność:</strong> ${data.main.humidity}%</p>
            </div>
        </div>
    `;
    currentSection.innerHTML = html;
}

function displayForecast(data) {
    let html = `<h2>Prognoza (najbliższe wpisy co 3h):</h2><div class="forecast-grid">`;


    const forecastList = data.list.slice(0, 5); 

    forecastList.forEach(item => {
        const date = new Date(item.dt * 1000);
        const timeString = date.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
        const dateString = date.toLocaleDateString('pl-PL');
        const iconUrl = `https://openweathermap.org/img/wn/${item.weather[0].icon}.png`;

        html += `
            <div class="forecast-item">
                <p class="date">${dateString}</p>
                <p class="time">${timeString}</p>
                <img src="${iconUrl}" alt="Ikona">
                <p class="temp">${Math.round(item.main.temp)}°C</p>
                <p class="desc">${item.weather[0].description}</p>
            </div>
        `;
    });

    html += `</div>`;
    forecastSection.innerHTML = html;
}