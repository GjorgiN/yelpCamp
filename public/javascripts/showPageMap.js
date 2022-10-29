mapboxgl.accessToken = mapToken;
const campgroundParsed = JSON.parse(campgroundStringified);
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/light-v9', // style URL
    center: campgroundParsed.geometry.coordinates, // starting position [lng, lat]
    zoom: 7, // starting zoom
    projection: 'globe' // display the map as a 3D globe
});


map.on('style.load', () => {
    map.setFog({}); // Set the default atmosphere style
});

map.addControl(new mapboxgl.NavigationControl(), 'top-right');

const marker1 = new mapboxgl.Marker()
    .setLngLat(campgroundParsed.geometry.coordinates)
    .setPopup(new mapboxgl.Popup({ closeOnClick: true })
        .setHTML(`<h6>${campgroundParsed.title}</h6><p>${campgroundParsed.location}</p>`))
    .addTo(map);

