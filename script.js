// Initialize the map
const map = L.map('map').setView([39.8283, -98.5795], 4);

// Load CartoDB Positron tiles
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; OpenStreetMap contributors & CartoDB',
  subdomains: 'abcd',
  maxZoom: 19
}).addTo(map);

// Helper: Get formatted time string
function getLiveTime(tz) {
  return new Date().toLocaleTimeString('en-US', {
    timeZone: tz,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });
}

// Helper: Generate popup HTML content
function generatePopupContent(agency) {
  return `
    <div style="text-align:center">
      <img src="${agency.icon}" alt="${agency.name}" style="width:50px;height:50px;margin-bottom:5px;">
      <h3>${agency.name}</h3>
      <div>${agency.city}, ${agency.state}</div>
      <div>Time: ${getLiveTime(agency.timezone)} (${agency.timezone})</div>
      <a href="${agency.website}" target="_blank">Visit Website</a>
    </div>
  `;
}

// Fetch and render agency markers
fetch('agencies.json')
  .then(response => response.json())
  .then(data => {
    const keyContainer = document.getElementById('agency-key');

    data.forEach(agency => {
      const customIcon = L.icon({
        iconUrl: agency.icon,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40]
      });

      const marker = L.marker(agency.coordinates, { icon: customIcon }).addTo(map);
      marker.bindPopup(generatePopupContent(agency));

      // Update popup every second while open
      marker.on('popupopen', () => {
        marker._popupInterval = setInterval(() => {
          const popup = marker.getPopup();
          popup.setContent(generatePopupContent(agency));
        }, 1000);
      });

      marker.on('popupclose', () => {
        clearInterval(marker._popupInterval);
      });

      // Render agency key and click to focus
      const keyItem = document.createElement('div');
      keyItem.classList.add('key-entry');
      keyItem.innerHTML = `<img src="${agency.icon}" alt="${agency.name}" /><span>${agency.name}</span>`;
      keyItem.addEventListener('click', () => {
        map.setView(agency.coordinates, 6);
        marker.openPopup();
      });
      keyContainer.appendChild(keyItem);
    });
  });

// Eastern Time Clock (Header)
function updateEasternClock() {
  const estClock = document.getElementById('est-time');
  const now = new Date().toLocaleTimeString('en-US', {
    timeZone: 'America/New_York',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  estClock.textContent = `Eastern Time (EST): ${now}`;
}
setInterval(updateEasternClock, 1000);
updateEasternClock();

// Mobile Key Toggle
const toggleButton = document.getElementById('toggle-key');
if (toggleButton) {
  toggleButton.addEventListener('click', () => {
    const key = document.getElementById('agency-key');
    key.style.display = key.style.display === 'block' ? 'none' : 'block';
  });
}
