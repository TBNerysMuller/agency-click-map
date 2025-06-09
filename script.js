// Initialize the map
const map = L.map('map').setView([39.8283, -98.5795], 4); // Centered on US

// Load CartoDB Positron tiles (free)
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; OpenStreetMap contributors & CartoDB',
  subdomains: 'abcd',
  maxZoom: 19
}).addTo(map);

// Function to get live time in the specified time zone
function getLiveTime(tz) {
  const now = new Date().toLocaleTimeString('en-US', {
    timeZone: tz,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  return now;
}

// Load agency data
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

      const popupHTML = `
        <div style="text-align:center">
          <img src="${agency.icon}" alt="${agency.name}" style="width:50px;height:50px;margin-bottom:5px;">
          <h3>${agency.name}</h3>
          <div>${agency.city}, ${agency.state}</div>
          <div>Time: ${getLiveTime(agency.timezone)} (${agency.timezone})</div>
          <a href="${agency.website}" target="_blank">Visit Website</a>
        </div>
      `;
      marker.bindPopup(popupHTML);

      // Add to agency key
      const keyItem = document.createElement('div');
      keyItem.classList.add('key-entry');
      keyItem.innerHTML = `<img src="${agency.icon}" alt="${agency.name}" /><span>${agency.name}</span>`;
      keyContainer.appendChild(keyItem);
    });
  });

// Eastern Time Clock
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

// Mobile Toggle
const toggleButton = document.getElementById('toggle-key');
if (toggleButton) {
  toggleButton.addEventListener('click', () => {
    const key = document.getElementById('agency-key');
    key.style.display = key.style.display === 'block' ? 'none' : 'block';
  });
}
