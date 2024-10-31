// public/js/clusterMap.js
function initClusterMap(listings) {
    const map = L.map('cluster-map').setView([20.5937, 78.9629], 5); // Center of India

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    const markers = L.markerClusterGroup();
    
    for(let listing of listings) {
        const marker = L.marker([
            listing.geometry.coordinates[1], 
            listing.geometry.coordinates[0]
        ])
        .bindPopup(`
            <h6><a href="/listings/${listing._id}">${listing.title}</a></h6>
            <p>${listing.location}</p>
            <p>₹${listing.price}/night</p>
        `);
        markers.addLayer(marker);
    }

    map.addLayer(markers);
}