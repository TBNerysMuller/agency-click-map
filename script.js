// Initialize the map
const map = L.map('map').setView([39.8283, -98.5795], 4);

// Use a free light tile layer (CartoDB Positron)
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; OpenStreetMap &copy; CartoDB',
  subdomains: 'abcd',
  maxZoom: 19
}).addTo(map);

// Load agency data from JSON
fetch('agencies.json')
  .then(response => response.json())
  .then(data => {
    data.forEach(agency => {
      const icon = L.icon({
        iconUrl: `logos/${agency.logo}`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
      });

      const marker = L.marker([agency.lat, agency.lng], { icon }).addTo(map);

      const popupContent = `
        <div>
          <img src="logos/${agency.logo}" alt="${agency.name}" style="height:40px;width:auto;margin-bottom:6px;"><br>
          <h3>${agency.name}</h3>
          <p>${agency.address}</p>
          <p><a href="${agency.website}" target="_blank">${agency.website}</a></p>
          <p style="font-size: 12px; color: #666">${agency.timezone} — <span class="live-time" data-tz="${agency.timezone}"></span></p>
        </div>
      `;

      marker.bindPopup(popupContent);

      // Add to side key
      const item = document.createElement('div');
      item.className = 'agency-item';
      item.innerHTML = `
        <img src="logos/${agency.logo}" alt="${agency.name}">
        <span>${agency.name}</span>
      `;
      item.addEventListener('click', () => {
        map.setView([agency.lat, agency.lng], 7);
        marker.openPopup();
      });
      document.getElementById('agencyList').appendChild(item);
    });
  });

// Time Clock Function
function updateClock() {
  const now = new Date();
  const estTime = now.toLocaleTimeString('en-US', {
    timeZone: 'America/New_York',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
  document.getElementById('clock').innerText = `EST — ${estTime}`;

  document.querySelectorAll('.live-time').forEach(span => {
    const tz = span.getAttribute('data-tz');
    const local = new Date().toLocaleTimeString('en-US', {
      timeZone: tz,
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    span.innerText = local;
  });
}
setInterval(updateClock, 1000);
updateClock();

// Toggle agency list on mobile
const toggleButton = document.getElementById('toggleButton');
if (toggleButton) {
  toggleButton.addEventListener('click', () => {
    const agencyList = document.getElementById('agencyList');
    agencyList.style.display = agencyList.style.display === 'block' ? 'none' : 'block';
  });
}

