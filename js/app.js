// =========================================================
// Modern Weather Dashboard - JavaScript Logic
// Team Members: Omar Ahmed Ramadan (API & DOM), Shimaa Hussien (DB) & Ahmed Aldmrdash (Leader)
// =========================================================

// Configuration
const API_KEY = 'dc6995fce2cbfe9781f339cb5d7a2288';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// =========================================================
// Helper Functions & Bonuses
// =========================================================

// 1. Local Icons Mapping: Link weather conditions to local images
function getWeatherIcon(condition) {
    const desc = condition.toLowerCase();
    const path = "images/"; 

    if (desc.includes("clear")) return `${path}clear.png`;
    if (desc.includes("few clouds")) return `${path}Few-clouds.png`;
    if (desc.includes("scattered clouds")) return `${path}Scattered-clouds.png`;
    if (desc.includes("broken clouds")) return `${path}Broken-clouds.png`;
    if (desc.includes("overcast clouds")) return `${path}Overcast-clouds.png`;
    if (desc.includes("light rain")) return `${path}Light-rain.png`;
    if (desc.includes("moderate rain")) return `${path}Moderate-rain.png`;
    if (desc.includes("heavy intensity rain")) return `${path}Heavy-intensity-rain.png`;
    if (desc.includes("thunderstorm with rain")) return `${path}Thunderstorm-with-rain.png`;
    if (desc.includes("thunderstorm")) return `${path}Thunderstorm.png`;
    if (desc.includes("light snow")) return `${path}Light-snow.png`;
    if (desc.includes("heavy snow")) return `${path}Heavy-snow.png`;
    if (desc.includes("drizzle")) return `${path}Drizzle.png`;
    if (desc.includes("mist")) return `${path}Mist.png`;
    if (desc.includes("fog")) return `${path}Fog.png`;
    if (desc.includes("haze")) return `${path}haze.png`;
    if (desc.includes("dust")) return `${path}Dust.png`;
    if (desc.includes("sand")) return `${path}Sand.png`;
    if (desc.includes("smoke")) return `${path}Smoke.png`;

    // Default icon if no match is found
    return `${path}icon.png`; 
}

// 2. BONUS FEATURE 2: Dynamic Background Change based on weather (Fully Covered)
const updateBackground = (condition) => {
    const desc = condition.toLowerCase();
    const body = document.body;

    // Clear previous background classes
    body.classList.remove('bg-clear', 'bg-clouds', 'bg-rain', 'bg-thunderstorm', 'bg-snow', 'bg-mist');

    // Cover all possible conditions from OpenWeatherMap
    if (desc.includes("clear")) {
        body.classList.add('bg-clear');
    } 
    else if (desc.includes("cloud") || desc.includes("overcast")) {
        body.classList.add('bg-clouds');
    } 
    else if (desc.includes("rain") || desc.includes("drizzle") || desc.includes("squall")) {
        body.classList.add('bg-rain');
    } 
    else if (desc.includes("thunderstorm") || desc.includes("tornado")) {
        body.classList.add('bg-thunderstorm'); 
    } 
    else if (desc.includes("snow") || desc.includes("sleet")) {
        body.classList.add('bg-snow');
    } 
    else if (desc.includes("mist") || desc.includes("fog") || desc.includes("haze") || 
             desc.includes("dust") || desc.includes("sand") || desc.includes("smoke") || desc.includes("ash")) {
        body.classList.add('bg-mist'); 
    } 
    else {
        // Fallback condition
        body.classList.add('bg-clouds'); 
    }
};

// 3. BONUS FEATURE 3: Interactive Map with "Click to Explore" Feature
let map;
let marker;

const updateMap = (lat, lon, temp, city) => {
    if (!map) {
        map = L.map('map').setView([lat, lon], 10);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        // --- NEW: Add click listener to the map ---
        map.on('click', async (e) => {
            const { lat, lng } = e.latlng;
            
            // Show a small loading indicator
            if(typeof Swal !== 'undefined') Swal.showLoading();

            try {
                // Fetch weather by coordinates (Lat/Lon)
                const response = await fetch(`${BASE_URL}/weather?lat=${lat}&lon=${lng}&units=metric&appid=${API_KEY}`);
                const data = await response.json();

                if (data && data.name) {
                    // Update UI with the new clicked location's weather
                    displayCurrentWeather(data);
                    // Update Sidebar and Database
                    saveCityToHistory(data.name);

                    // Fetch and display forecast for this new location
                    const forecastRes = await fetch(`${BASE_URL}/forecast?q=${data.name}&units=metric&appid=${API_KEY}`);
                    const forecastData = await forecastRes.json();
                    displayForecast(forecastData);
                }
                if(typeof Swal !== 'undefined') Swal.close();
            } catch (err) {
                if(typeof Swal !== 'undefined') Swal.fire({ icon: 'error', title: 'Error', text: 'Could not fetch weather for this point.' });
            }
        });
    } else {
        map.flyTo([lat, lon], 10, {
            animate: true,
            duration: 1.5 
        });
    }

    if (marker) {
        map.removeLayer(marker);
    }

    marker = L.marker([lat, lon]).addTo(map)
        .bindPopup(`<strong style="color:#0284c7;">${city}</strong><br>Temp: ${Math.round(temp)}°C`)
        .openPopup();
};

// =========================================================
// API & Data Handling
// =========================================================

// 4. Fetch API (async/await): Fetch weather data with error handling
const fetchWeatherData = async (city) => {
    try {
        const [currentRes, forecastRes] = await Promise.all([
            fetch(`${BASE_URL}/weather?q=${city}&units=metric&appid=${API_KEY}`),
            fetch(`${BASE_URL}/forecast?q=${city}&units=metric&appid=${API_KEY}`)
        ]);

        if (!currentRes.ok || !forecastRes.ok) {
            // SweetAlert2 Error Notification
            if(typeof Swal !== 'undefined') {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'City not found. Please check the spelling!',
                    confirmButtonColor: '#38bdf8',
                    background: document.body.classList.contains('light-mode') ? '#fff' : '#1e293b',
                    color: document.body.classList.contains('light-mode') ? '#0f172a' : '#f8fafc'
                });
            } else {
                alert("City not found. Please check the spelling.");
            }
            return false;
        }

        const currentData = await currentRes.json();
        const forecastData = await forecastRes.json();

        // Update UI
        displayCurrentWeather(currentData);
        displayForecast(forecastData);
        
        return true; 
    } catch (error) {
        console.error("JavaScript Execution Error:", error);
        return false;
    }
};

// 5. DOM Manipulation: Display current weather & Smart Tips
const displayCurrentWeather = (data) => {
    updateBackground(data.weather[0].description);
    
    const weatherSection = document.getElementById('current-weather');
    const iconUrl = getWeatherIcon(data.weather[0]?.description || '');
    
    let fullCountryName = data.sys.country;
    try {
        const regionNames = new Intl.DisplayNames(['en'], {type: 'region'});
        fullCountryName = regionNames.of(data.sys.country);
    } catch (e) {
        console.warn("Could not translate country code.");
    }
    
    weatherSection.innerHTML = `
        <div class="current-weather-card">
            <h2>${data.name}, ${fullCountryName}</h2>
            <div class="weather-info">
                <img src="${iconUrl}" alt="${data.weather[0]?.description || 'weather'}">
                <div class="details">
                    <p class="temp">${Math.round(data.main.temp)}°C</p>
                    <p class="desc" style="text-transform: capitalize;">${data.weather[0]?.description || ''}</p>
                </div>
            </div>
        </div>
    `;

    // Update the interactive map
    const lat = data.coord.lat;
    const lon = data.coord.lon;
    const currentTemp = data.main.temp;
    updateMap(lat, lon, currentTemp, data.name);

    // ==========================================
    // Smart Advice Logic (SweetAlert2 Toast)
    // ==========================================
    let advice = "";
    let adviceIcon = "info";

    if (data.weather[0].main.toLowerCase() === "rain" || data.weather[0].main.toLowerCase() === "drizzle") {
        advice = "It's raining! Don't forget your umbrella ☂️";
        adviceIcon = "warning";
    } else if (data.main.temp > 30) {
        advice = "It's quite hot! Stay hydrated and drink plenty of water 💧";
        adviceIcon = "warning";
    } else if (data.main.temp < 15) {
        advice = "It's cold out there! Wear something heavy 🧥";
        adviceIcon = "info";
    } else {
        advice = "The weather is great! Have a wonderful day 🌟";
        adviceIcon = "success";
    }

    // Show sleek toast notification (10 seconds with Close Button)
    if(typeof Swal !== 'undefined') {
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            showCloseButton: true,
            timer: 10000,
            timerProgressBar: true,
            background: document.body.classList.contains('light-mode') ? '#fff' : '#1e293b',
            color: document.body.classList.contains('light-mode') ? '#0f172a' : '#f8fafc'
        });

        Toast.fire({
            icon: adviceIcon,
            title: `${data.name} Weather`,
            text: advice
        });
    }
};

// 6. Array Methods: Display 5-day forecast
const displayForecast = (data) => {
    const forecastContainer = document.getElementById('forecast-cards');
    const forecastSection = document.querySelector('.forecast-section');
    if (!forecastContainer) return; 

    forecastContainer.innerHTML = ''; 

    const dailyForecasts = {};
    
    data.list.forEach(item => {
        const dateStr = item.dt_txt.split(' ')[0]; 
        
        if (!dailyForecasts[dateStr]) {
            dailyForecasts[dateStr] = {
                dt: item.dt,
                weather: item.weather, 
                temp_max: item.main.temp_max,
                temp_min: item.main.temp_min
            };
        } else {
            if (item.main.temp_max > dailyForecasts[dateStr].temp_max) {
                dailyForecasts[dateStr].temp_max = item.main.temp_max;
            }
            if (item.main.temp_min < dailyForecasts[dateStr].temp_min) {
                dailyForecasts[dateStr].temp_min = item.main.temp_min;
            }
            if (item.dt_txt.includes("12:00:00")) {
                dailyForecasts[dateStr].weather = item.weather;
            }
        }
    });

    const dailyData = Object.values(dailyForecasts).slice(0, 5);

    dailyData.forEach(day => {
        const date = new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' });
        const iconUrl = getWeatherIcon(day.weather[0]?.description || '');
        
        const card = document.createElement('div');
        card.className = 'weather-card';
        card.innerHTML = `
            <h4>${date}</h4>
            <div style="display: flex; align-items: center; justify-content: center; gap: 10px; margin: 15px 0;">
                <img src="${iconUrl}" alt="Weather Icon" style="width: 50px; height: auto;">
                <span style="font-size: 0.9rem; text-transform: capitalize; color: var(--text-dim); text-align: left;">
                    ${day.weather[0]?.description || 'Unknown'}
                </span>
            </div>
            <p><strong>${Math.round(day.temp_max)}°</strong> / ${Math.round(day.temp_min)}°</p>
        `;
        forecastContainer.appendChild(card);
    });

    renderForecastTable(dailyData, forecastSection || forecastContainer.parentElement);
};

// 7. Render forecast table
const renderForecastTable = (dailyData, container) => {
    if (!container) return; 

    const oldTable = container.querySelector('.forecast-table');
    if (oldTable) oldTable.remove();

    const table = document.createElement('table');
    table.className = 'forecast-table';
    table.innerHTML = `
        <thead>
            <tr>
                <th>Day</th>
                <th>Date</th>
                <th>Icon</th>
                <th>Condition</th>
                <th>High</th>
                <th>Low</th>
            </tr>
        </thead>
        <tbody>
            ${dailyData.map(day => {
                const iconUrl = getWeatherIcon(day.weather[0]?.description || '');
                const dayName = new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'long' });
                const fullDate = new Date(day.dt * 1000).toLocaleDateString();

                return `
                <tr>
                    <td style="font-weight: bold; color: var(--accent-color);">${dayName}</td>
                    <td>${fullDate}</td>
                    <td>
                        <img src="${iconUrl}" alt="Icon" style="width: 40px; height: auto; filter: drop-shadow(0 0 5px rgba(56, 189, 248, 0.4));">
                    </td>
                    <td style="text-transform: capitalize;">${day.weather[0]?.description || 'N/A'}</td>
                    <td>${Math.round(day.temp_max)}°C</td>
                    <td>${Math.round(day.temp_min)}°C</td>
                </tr>
                `;
            }).join('')}
        </tbody>
    `;
    container.appendChild(table);
};

// =========================================================
// Backend Integration & Auto-Detect
// =========================================================

// 8. PHP Integration: Save new city to database
const saveCityToHistory = async (city) => {
    try {
        const response = await fetch('api/save_city.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `city=${encodeURIComponent(city)}`
        });
        
        if (response.ok) {
            await updateSidebar(); 
        }
    } catch (err) {
        console.warn("Database Error: Could not save to history.");
    }
};

// 9. PHP Integration: Fetch history
const updateSidebar = async () => {
    try {
        const response = await fetch('api/get_history.php');
        if (!response.ok) return;
        
        const history = await response.json();
        const sidebarContainer = document.getElementById('saved-cities');
        
        if (sidebarContainer) {
            if (history.length === 0) {
                sidebarContainer.innerHTML = '<p style="color: var(--text-dim); font-size: 0.8rem; padding: 10px;">No recent searches</p>';
                return;
            }

            sidebarContainer.innerHTML = history.map(item => `
                <div class="saved-city" onclick="fetchWeatherData('${item.city_name}'); saveCityToHistory('${item.city_name}');">
                    ${item.city_name}
                </div>
            `).join('');
        }
    } catch (error) {
        console.warn("UI Error: Could not refresh sidebar. Check PHP connection.");
    }
};

// 10. BONUS FEATURE 1: Auto-Detect User Location
const getUserLocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            try {
                const response = await fetch(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
                const data = await response.json();
                
                if (data && data.name) {
                    const isSuccess = await fetchWeatherData(data.name);
                    if (isSuccess) {
                        saveCityToHistory(data.name); 
                    }
                }
            } catch (error) {
                console.warn("Could not fetch weather for current location.");
            }
        }, (error) => {
            console.log("User denied geolocation access or it failed.");
        });
    }
};

// =========================================================
// Event Listeners & Initialization
// =========================================================

// Handle search form submission
document.getElementById('search-form').addEventListener('submit', async (e) => {
    e.preventDefault(); 
    
    const cityInput = document.getElementById('city-input');
    const city = cityInput.value.trim();
    
    if (city) {
        const isSuccess = await fetchWeatherData(city);
        if (isSuccess) {
            await saveCityToHistory(city); 
        }
        cityInput.value = ''; 
    }
});

// Dark/Light Mode Toggle Logic
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

const currentTheme = localStorage.getItem('theme');
if (currentTheme === 'light') {
    body.classList.add('light-mode');
    themeToggle.innerHTML = '🌙 Dark Mode';
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('light-mode');
    
    if (body.classList.contains('light-mode')) {
        localStorage.setItem('theme', 'light');
        themeToggle.innerHTML = '🌙 Dark Mode';
    } else {
        localStorage.setItem('theme', 'dark');
        themeToggle.innerHTML = '☀️ Light Mode';
    }
});

// Load history and auto-detect location on startup
window.onload = () => {
    updateSidebar();
    getUserLocation(); 
};