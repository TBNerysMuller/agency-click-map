// script.js

// Initialize the map
const map = L.map('map').setView([39.8283, -98.5795], 4);

// Add CartoDB Positron tiles
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  subdomains: 'abcd',
  maxZoom: 19
}).addTo(map);

// Load agencies from JSON and add markers
fetch('agencies.json')
  .then(response => response.json())
  .then(data => {
    data.forEach(agency => {
      const icon = L.icon({
        iconUrl: agency.logo,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40]
      });

      const marker = L.marker([agency.lat, agency.lng], { icon: icon }).addTo(map);

      const updateTime = () => {
        const options = {
          timeZone: agency.timezone,
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        };
        const timeString = new Intl.DateTimeFormat([], options).format(new Date());

        const popupContent = `
          <div class="popup-content">
            <img src="${agency.logo}" class="popup-logo" alt="${agency.name} logo">
            <strong>${agency.name}</strong><br>
            ${agency.city}, ${agency.state}<br>
            Time (${agency.timezone}): ${timeString}<br>
            <a href="${agency.website}" target="_blank">Visit Website</a>
          </div>
        `;

        marker.bindPopup(popupContent);
      };

      updateTime();
      setInterval(updateTime, 60000);

      // Add to side menu
      const agencyList = document.getElementById('agency-list');
      const item = document.createElement('div');
      item.className = 'agency-item';
      item.innerHTML = `
        <img src="${agency.logo}" class="key-logo" alt="${agency.name} logo">
        <span>${agency.name}</span>
      `;
      item.onclick = () => {
        map.setView([agency.lat, agency.lng], 8);
        marker.openPopup();
      };
      agencyList.appendChild(item);
    });
  });

// Clock in header
function updateClock() {
  const now = new Date();
  const options = {
    timeZone: 'America/New_York',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  };
  const time = new Intl.DateTimeFormat([], options).format(now);
  document.getElementById('clock').textContent = `Eastern Time (EST/EDT): ${time}`;
}

setInterval(updateClock, 60000);
updateClock();

// Mobile toggle
document.getElementById('toggle-agencies').addEventListener('click', () => {
  const menu = document.getElementById('agency-key');
  menu.classList.toggle('active');
});
