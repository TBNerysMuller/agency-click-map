
// Initialize the map
const map = L.map('map').setView([39.8283, -98.5795], 4); // Center of the USA

// Add CartoDB Positron basemap (light mode, no API key required)
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
  subdomains: 'abcd',
  maxZoom: 19
}).addTo(map);

// Update Eastern time in header every second
function updateEasternTime() {
  const now = new Date().toLocaleTimeString("en-US", {
    timeZone: "America/New_York",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });
  document.getElementById('eastern-time').innerText = now;
}
setInterval(updateEasternTime, 1000);
updateEasternTime();

// Load agency data and add markers
fetch('agencies.json')
  .then(response => response.json())
  .then(agencies => {
    agencies.forEach(agency => {
      const icon = L.icon({
        iconUrl: agency.icon,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40]
      });

      const marker = L.marker([agency.lat, agency.lng], { icon }).addTo(map);

      // Format popup content
      const now = new Date().toLocaleTimeString("en-US", {
        timeZone: agency.timezone,
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
      });

      const popupHTML = \`
        <div class="popup">
          <img src="\${agency.popupImage}" alt="\${agency.name}" style="max-width: 60px; display: block; margin: 0 auto 0.5rem;" />
          <h3 style="font-family: Poppins, sans-serif; text-align: center; color: #00a8e9; margin: 0;">\${agency.name}</h3>
          <p style="text-align: center; font-family: Poppins, sans-serif; margin: 0;">\${agency.location}</p>
          <p style="text-align: center; font-family: Poppins, sans-serif; margin: 0;"><strong>Time (\${agency.timezone}):</strong> \${now}</p>
          <p style="text-align: center;"><a href="\${agency.url}" target="_blank" style="color: #00a8e9; text-decoration: none; font-family: Poppins, sans-serif;">Visit Website</a></p>
        </div>
      \`;

      marker.bindPopup(popupHTML);
    });
  })
  .catch(error => {
    console.error("Error loading agencies.json:", error);
  });
