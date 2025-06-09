const map = L.map('map').setView([39.8283, -98.5795], 4);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

const updateClock = () => {
  const now = moment().tz('America/New_York');
  document.getElementById('clock').textContent = `Eastern Time (EST/EDT): ${now.format('hh:mm A')}`;
};
setInterval(updateClock, 1000);
updateClock();

// Example Marker
const marker = L.marker([40.7128, -74.006]).addTo(map);
marker.bindPopup('<b>Conduit Digital</b><br>New Jersey, USA<br><a href="https://www.conduitdigital.us" target="_blank">Visit Website</a>');
