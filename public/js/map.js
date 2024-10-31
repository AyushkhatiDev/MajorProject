// public/js/map.js
function initMap(listing) {
    const map = L.map('map').setView([listing.geometry.coordinates[1], listing.geometry.coordinates[0]], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    const marker = L.marker([listing.geometry.coordinates[1], listing.geometry.coordinates[0]])
        .addTo(map)
        .bindPopup(`
            <h6>${listing.title}</h6>
            <p>${listing.location}</p>
            <p>₹${listing.price}/night</p>
        `)
        .openPopup();
}