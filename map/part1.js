/******************************************
 * MAP INITIALIZATION (COMMON)
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
 * GEOCODING - UI ELEMENTS
 ******************************************/
const searchInput = document.getElementById('searchInput');
const searchBtn   = document.getElementById('searchBtn');

/******************************************
 * GEOCODING - SEARCH EVENT (LocationIQ)
 ******************************************/
searchBtn.addEventListener('click', async () => {
    const query = searchInput.value.trim();

    if (!query) {
        alert('Please enter a location name');
        return;
    }

    if (!GEOCODING_API_KEY) {
        alert('Geocoding API key not provided!');
        return;
    }

    const geocodeUrl = `https://us1.locationiq.com/v1/search.php?key=${GEOCODING_API_KEY}&q=${encodeURIComponent(query)}&format=json`;

    try {
        const response = await fetch(geocodeUrl);
        if (!response.ok) throw new Error('Geocoding API error');

        const data = await response.json();
        if (!data || data.length === 0) {
            alert('Location not found');
            return;
        }

        // استفاده از اولین نتیجه
        const { lat, lon } = data[0];

        map.getView().animate({
            center: ol.proj.fromLonLat([parseFloat(lon), parseFloat(lat)]),
            zoom: 12,
            duration: 1500
        });

    } catch (error) {
        console.error(error);
        alert('Geocoding failed');
    }
});
