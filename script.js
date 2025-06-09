
// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function () {
  const map = L.map('map').setView([39.8283, -98.5795], 4); // Center of the US

  // Add tile layer
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(map);

  // Load agency data
  fetch('agencies.json')
    .then(response => response.json())
    .then(agencies => {
      agencies.forEach(agency => {
        const customIcon = L.icon({
          iconUrl: agency.icon,
          iconSize: [48, 48],
          iconAnchor: [24, 48],
          popupAnchor: [0, -48]
        });

        const marker = L.marker([agency.lat, agency.lng], { icon: customIcon }).addTo(map);

        const timezone = agency.timezone;
        const localTime = new Date().toLocaleString('en-US', { timeZone: timezone, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });

        const popupContent = \`
          <div class="popup-content">
            <img src="\${agency.icon}" alt="\${agency.name}" style="width: 40px; height: 40px; margin-bottom: 8px;" />
            <h3>\${agency.name}</h3>
            <p>\${agency.city}, \${agency.state}</p>
            <p>Time: (\${timezone}) \${localTime}</p>
            <a href="\${agency.website}" target="_blank">Visit Website</a>
          </div>
        \`;

        marker.bindPopup(popupContent);
      });
    });

  // EST Clock
  function updateESTClock() {
    const now = new Date().toLocaleTimeString('en-US', {
      timeZone: 'America/New_York',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    const estBar = document.getElementById('est-time');
    if (estBar) estBar.textContent = 'Eastern Time (EST): ' + now;
  }

  setInterval(updateESTClock, 1000);
  updateESTClock();
});
