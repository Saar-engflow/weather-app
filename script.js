// Modern Weather App with enhanced features
// API key should be in .env file and referenced properly

// DOM Elements
const getWeatherDiv = document.getElementById('show-weather');
const getBtn = document.getElementById('get-weather');
const locationInput = document.getElementById('location-input');
const unitToggle = document.getElementById('unit-toggle');
const locationIcon = document.getElementById('location-icon');

// State
let isCelsius = true;
let lastWeatherData = null;

// Get API key from environment (in production, you'd need a backend proxy)
// For now, using placeholder - replace with your actual key
const API_KEY = 'API_KEY'; // Should come from .env in real implementation

// Format date and time
const formatTime = (timestamp, timezone) => {
    const date = new Date((timestamp + timezone) * 1000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
};

// Get weather icon based on condition
const getWeatherIcon = (condition) => {
    const icons = {
        'Clear': '☀️',
        'Clouds': '☁️',
        'Rain': '🌧️',
        'Drizzle': '🌦️',
        'Thunderstorm': '⛈️',
        'Snow': '❄️',
        'Mist': '🌫️',
        'Smoke': '💨',
        'Haze': '🌁',
        'Fog': '🌫️'
    };
    return icons[condition] || '🌤️';
};

// Convert temperature unit
const convertTemp = (temp) => {
    if (!isCelsius) {
        return (temp * 9/5 + 32).toFixed(1); // Convert to Fahrenheit
    }
    return temp.toFixed(1);
};

// Get current temperature unit
const getTempUnit = () => {
    return isCelsius ? '°C' : '°F';
};

// Fetch weather data
const fetchWeather = async (city = null) => {
    const cityName = city || locationInput.value.trim();
    
    if (!cityName) {
        showError('Please enter a city name');
        return;
    }

    // Show loading state
    getWeatherDiv.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <p>Fetching weather data for ${cityName}...</p>
        </div>
    `;

    try {
        // Using OpenWeatherMap API
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)}&appid=${API_KEY}&units=metric`
        );
        
        if (!response.ok) {
            throw new Error('City not found. Please try again.');
        }
        
        const data = await response.json();
        lastWeatherData = data;
        displayWeather(data);
        
    } catch (error) {
        showError(error.message);
    }
};

// Display weather data
const displayWeather = (data) => {
    const weather = data.weather[0];
    const main = data.main;
    const wind = data.wind;
    const sys = data.sys;
    
    const temp = convertTemp(main.temp);
    const feelsLike = convertTemp(main.feels_like);
    const tempMin = convertTemp(main.temp_min);
    const tempMax = convertTemp(main.temp_max);
    const unit = getTempUnit();
    
    const sunrise = formatTime(sys.sunrise, data.timezone);
    const sunset = formatTime(sys.sunset, data.timezone);
    
    getWeatherDiv.innerHTML = `
        <div class="weather-card">
            <div class="weather-header">
                <div class="location">
                    <h2>${data.name}, ${data.sys.country}</h2>
                    <p class="date">${formatDate(data.dt)}</p>
                </div>
                <div class="temp-main">
                    <div class="temp-icon">${getWeatherIcon(weather.main)}</div>
                    <div class="temp-value">
                        <span class="temp">${temp}${unit}</span>
                        <span class="feels-like">Feels like ${feelsLike}${unit}</span>
                    </div>
                </div>
            </div>
            
            <div class="weather-details">
                <div class="weather-condition">
                    <h3>${weather.main}</h3>
                    <p>${weather.description}</p>
                </div>
                
                <div class="details-grid">
                    <div class="detail-item">
                        <span class="detail-label">Humidity</span>
                        <span class="detail-value">${main.humidity}%</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Wind</span>
                        <span class="detail-value">${wind.speed} m/s</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Pressure</span>
                        <span class="detail-value">${main.pressure} hPa</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Visibility</span>
                        <span class="detail-value">${(data.visibility / 1000).toFixed(1)} km</span>
                    </div>
                </div>
                
                <div class="temp-range">
                    <div class="min-temp">
                        <span>Min</span>
                        <span>${tempMin}${unit}</span>
                    </div>
                    <div class="temp-bar">
                        <div class="temp-fill" style="width: ${((main.temp - main.temp_min) / (main.temp_max - main.temp_min)) * 100}%"></div>
                    </div>
                    <div class="max-temp">
                        <span>Max</span>
                        <span>${tempMax}${unit}</span>
                    </div>
                </div>
                
                <div class="sun-times">
                    <div class="sunrise">
                        <span>🌅 Sunrise</span>
                        <span>${sunrise}</span>
                    </div>
                    <div class="sunset">
                        <span>🌇 Sunset</span>
                        <span>${sunset}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
};

// Show error message
const showError = (message) => {
    getWeatherDiv.innerHTML = `
        <div class="error-card">
            <div class="error-icon">⚠️</div>
            <h3>Oops! Something went wrong</h3>
            <p>${message}</p>
            <button class="retry-btn" onclick="retryLastSearch()">Try Again</button>
        </div>
    `;
};

// Retry last search
const retryLastSearch = () => {
    if (locationInput.value.trim()) {
        fetchWeather();
    }
};

// Get current location
const getCurrentLocation = () => {
    if (navigator.geolocation) {
        getWeatherDiv.innerHTML = `
            <div class="loading">
                <div class="spinner"></div>
                <p>Detecting your location...</p>
            </div>
        `;
        
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    const response = await fetch(
                        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
                    );
                    
                    if (!response.ok) throw new Error('Location not found');
                    
                    const data = await response.json();
                    locationInput.value = data.name;
                    lastWeatherData = data;
                    displayWeather(data);
                    
                } catch (error) {
                    showError('Could not get weather for your location');
                }
            },
            (error) => {
                showError('Please enable location access or enter city manually');
            }
        );
    } else {
        showError('Geolocation is not supported by your browser');
    }
};

// Toggle temperature unit
const toggleUnit = () => {
    isCelsius = !isCelsius;
    unitToggle.textContent = isCelsius ? '°C' : '°F';
    unitToggle.classList.toggle('active', !isCelsius);
    
    if (lastWeatherData) {
        displayWeather(lastWeatherData);
    }
};

// Search on Enter key
locationInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        fetchWeather();
    }
});

// Event Listeners
getBtn.addEventListener('click', () => fetchWeather());
unitToggle.addEventListener('click', toggleUnit);
locationIcon.addEventListener('click', getCurrentLocation);

// Initialize with a default city
window.addEventListener('DOMContentLoaded', () => {
    fetchWeather('London');
});
