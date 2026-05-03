// =========================================================
// Modern Weather Dashboard - JavaScript Logic
// Team Members: Omar Ahmed Ramadan (API & DOM), Shimaa Hussien (DB) & Ahmed Aldmrdash (Leader)
// =========================================================

// Configuration
const API_KEY = 'dc6995fce2cbfe9781f339cb5d7a2288';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

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

// 2. Event Handling: Handle search form submission and prevent page reload
document.getElementById('search-form').addEventListener('submit', async (e) => {
    e.preventDefault(); 
    
    const cityInput = document.getElementById('city-input');
    const city = cityInput.value.trim();
    
    if (city) {
        const isSuccess = await fetchWeatherData(city);
        if (isSuccess) {
            await saveCityToHistory(city); // Wait for the city to be saved
        }
        cityInput.value = ''; // Clear search input
    }
});

// 3. Fetch API (async/await): Fetch weather data with error handling
const fetchWeatherData = async (city) => {
    try {
        const [currentRes, forecastRes] = await Promise.all([
            fetch(`${BASE_URL}/weather?q=${city}&units=metric&appid=${API_KEY}`),
            fetch(`${BASE_URL}/forecast?q=${city}&units=metric&appid=${API_KEY}`)
        ]);

        if (!currentRes.ok || !forecastRes.ok) {
            alert("City not found. Please check the spelling.");
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

// 4. DOM Manipulation: Display current weather (with full country name)
const displayCurrentWeather = (data) => {
    const weatherSection = document.getElementById('current-weather');
    const iconUrl = getWeatherIcon(data.weather[0]?.description || '');
    
    // Attempt to get the full country name
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
};

// 5. Array Methods: Display 5-day forecast (calculating true daily max/min)
const displayForecast = (data) => {
    const forecastContainer = document.getElementById('forecast-cards');
    const forecastSection = document.querySelector('.forecast-section');
    if (!forecastContainer) return; 

    forecastContainer.innerHTML = ''; 

    // Aggregate daily data to find highest and lowest temperatures
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
            // Capture weather condition around noon
            if (item.dt_txt.includes("12:00:00")) {
                dailyForecasts[dateStr].weather = item.weather;
            }
        }
    });

    // Convert object to array and take the first 5 days
    const dailyData = Object.values(dailyForecasts).slice(0, 5);

    // Build forecast cards
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

    // Render detailed table
    renderForecastTable(dailyData, forecastSection || forecastContainer.parentElement);
};

// 6. HTML Table Requirement: Render forecast table
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

// 7. PHP Integration: Save new city to database (Wait for success)
const saveCityToHistory = async (city) => {
    try {
        const response = await fetch('api/save_city.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `city=${encodeURIComponent(city)}`
        });
        
        if (response.ok) {
            await updateSidebar(); // Update sidebar immediately after saving
        }
    } catch (err) {
        console.warn("Database Error: Could not save to history.");
    }
};

// 8. PHP Integration: Fetch history and display strictly as received from server
const updateSidebar = async () => {
    try {
        const response = await fetch('api/get_history.php');
        if (!response.ok) return;
        
        const history = await response.json();
        const sidebarContainer = document.getElementById('saved-cities');
        
        if (sidebarContainer) {
            // If history is empty, show a fallback message
            if (history.length === 0) {
                sidebarContainer.innerHTML = '<p style="color: var(--text-dim); font-size: 0.8rem; padding: 10px;">No recent searches</p>';
                return;
            }

            // Display cities exactly in the order they come from the DB (Latest ID First)
            // Added saveCityToHistory inside onclick to push the city to the top when clicked
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

// =========================================================
// 10. Dark/Light Mode Toggle Logic
// =========================================================
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Check Local Storage for previous theme preference
const currentTheme = localStorage.getItem('theme');
if (currentTheme === 'light') {
    body.classList.add('light-mode');
    themeToggle.innerHTML = '🌙 Dark Mode';
}

// Toggle logic on button click
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

// 9. Load history when the page first opens
window.onload = updateSidebar;