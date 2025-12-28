/******************************************
 * MAP INITIALIZATION
 ******************************************/
const map = new ol.Map({
    target: 'map',
    layers: [
        new ol.layer.Tile({
            source: new ol.source.OSM()
        })
    ],
    view: new ol.View({
        center: ol.proj.fromLonLat([0, 0]),
        zoom: 2
    })
});

/******************************************
 * WEATHER - DOM ELEMENTS
 ******************************************/
const weatherBox = document.getElementById('weatherBox');
const weatherContent = document.getElementById('weatherContent');

/******************************************
 * WEATHER - HELPER FUNCTIONS
 ******************************************/
async function fetchWeather(lat, lon) {
    if (!WEATHER_API_KEY) {
        weatherContent.innerHTML = 'Weather API key not provided!';
        return;
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${WEATHER_API_KEY}`;

    weatherContent.innerHTML = 'Loading weather data...';

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        displayWeather(data);
    } catch (err) {
        console.error(err);
        weatherContent.innerHTML = 'Weather data not available';
    }
}

function displayWeather(data) {
    weatherContent.innerHTML = `
        <strong>Temperature:</strong> ${data.main.temp} °C<br>
        <strong>Humidity:</strong> ${data.main.humidity}%<br>
        <strong>Condition:</strong> ${data.weather[0].description}
    `;
}

/******************************************
 * MAP CLICK EVENT
 ******************************************/
map.on('click', function (event) {
    const [lon, lat] = ol.proj.toLonLat(event.coordinate);
    weatherBox.classList.remove('hidden');
    fetchWeather(lat, lon);
});
