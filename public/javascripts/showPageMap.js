mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: shelter.geometry.coordinates, // starting position [lng, lat]
    zoom: 15 // starting zoom
});

const marker = new mapboxgl.Marker()
    .setLngLat(shelter.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 5 })
        .setHTML(
            `<h6>${shelter.title}</h6><p>${shelter.location}</p>`
        )
    )
    .addTo(map)