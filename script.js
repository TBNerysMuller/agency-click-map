// Initialize the map
const map = L.map('map').setView([39.8283, -98.5795], 4);

// ✅ Add timezone overlay
L.timezones.addTo(map);

// Optional: show timezone name on click
L.timezones
  .bindPopup(layer => layer.feature.properties.time_zone)
  .addTo(map);

// Add tile layer using CartoDB Positron (free version)
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; <a href="https://carto.com/">CartoDB</a> & contributors'
}).addTo(map);

// Load agency data
fetch('agencies.json')
  .then(response => response.json())
  .then(agencies => {
    agencies.forEach((agency, index) => {
      const icon = L.icon({
        iconUrl: `logos/${agency.logo}`,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40]
      });

      const marker = L.marker([agency.lat, agency.lng], { icon }).addTo(map);

      const popupHTML = `
        <div>
          <img src="logos/${agency.logo}" alt="${agency.name}" style="width:50px;height:auto;margin-bottom:5px;" /><br/>
          <h3>${agency.name}</h3>
          <div>${agency.location}</div>
          <div style="margin-top:5px;"><a href="${agency.link}" target="_blank">Visit Website</a></div>
          <div style="margin-top:5px;font-size:12px;color:#333;">Timezone: ${agency.timezone}</div>
        </div>
      `;

      marker.bindPopup(popupHTML);

      // Add to sidebar key
      const agencyItem = document.createElement('div');
      agencyItem.className = 'agency-item';
      agencyItem.innerHTML = `
        <img src="logos/${agency.logo}" alt="${agency.name}" />
        <span>${agency.name}</span>
      `;
      agencyItem.onclick = () => {
        map.setView([agency.lat, agency.lng], 6);
        marker.openPopup();
      };
      document.getElementById('agency-key').appendChild(agencyItem);
    });
  });

// Live EST clock with DST handling
function updateESTTime() {
  const estTimeElement = document.getElementById('est-time');
  const now = new Date();
  const options = {
    timeZone: 'America/New_York',
    hour: '2-digit',
    minute: '2-digit'
  };
  const formatter = new Intl.DateTimeFormat([], options);
  estTimeElement.textContent = `Eastern Time (EST/EDT): ${formatter.format(now)}`;
}
setInterval(updateESTTime, 1000);
updateESTTime();
