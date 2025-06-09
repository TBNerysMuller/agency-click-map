// Initialize the map
const map = L.map('map').setView([39.8283, -98.5795], 4);

// Add tile layer using CartoDB Positron (light mode, free)
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; <a href="https://carto.com/">CartoDB</a> & contributors'
}).addTo(map);

// Add timezone overlay using Leaflet.timezones plugin
if (L.timezones) {
  L.timezones.addTo(map);
} else {
  console.warn('Leaflet.timezones plugin not found');
}

// Make both conduit logos clickable
const headerLogo = document.getElementById('header-logo');
const bugLogo = document.getElementById('bug-logo');
if (headerLogo) headerLogo.onclick = () => window.open('https://www.conduitdigital.us', '_blank');
if (bugLogo) bugLogo.onclick = () => window.open('https://www.conduitdigital.us', '_blank');

function getLiveTimeInZone(timeZone) {
  const now = new Date();
  const options = {
    timeZone,
    hour: '2-digit',
    minute: '2-digit'
  };
  const formatter = new Intl.DateTimeFormat([], options);
  return formatter.format(now);
}

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

      const localTime = getLiveTimeInZone(agency.timezone);

      const popupHTML = `
        <div>
          <img src="logos/${agency.logo}" alt="${agency.name}" style="width:50px;height:auto;margin-bottom:5px;" /><br/>
          <h3 style="color:#00a8e9;font-family:'Poppins',sans-serif;font-size:16px;">${agency.name}</h3>
          <div style="font-family:'Poppins',sans-serif;color:black;">${agency.location}</div>
          <div style="margin-top:5px;font-family:'Poppins',sans-serif;"><a href="${agency.link}" target="_blank">Visit Website</a></div>
          <div style="margin-top:5px;font-size:12px;color:#333;font-family:'Poppins',sans-serif;">
            Timezone: ${agency.timezone} (${localTime})
          </div>
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

// Mobile toggle for agency key dropdown
const toggleBtn = document.querySelector('.agency-key-toggle');
const agencyKey = document.getElementById('agency-key');
if (toggleBtn) {
  toggleBtn.addEventListener('click', () => {
    agencyKey.classList.toggle('show');
  });
} else {
  console.warn('Toggle button not found');
}
