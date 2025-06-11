// Initialize the map
const map = L.map('map').setView([39.8283, -98.5795], 4);

// Load CartoDB Positron tiles
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; OpenStreetMap contributors & CartoDB',
  subdomains: 'abcd',
  maxZoom: 19
}).addTo(map);

// Get live formatted time string
function getLiveTime(tz) {
  return new Date().toLocaleTimeString('en-US', {
    timeZone: tz,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });
}

// Get abbreviated timezone name
function getTimeZoneAbbreviation(tz) {
  const now = new Date();
  return new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    timeZoneName: 'short'
  }).formatToParts(now).find(part => part.type === 'timeZoneName').value;
}

// Generate popup HTML
function generatePopupContent(agency) {
  const time = getLiveTime(agency.timezone);
  const tzAbbr = getTimeZoneAbbreviation(agency.timezone);

  return `
    <div style="text-align:center">
      <img src="${agency.icon}" alt="${agency.name}" style="width:50px;height:50px;border-radius:50%;border:2px solid #00a8e9;margin-bottom:8px;">
      <h3>${agency.name}</h3>
      <div>${agency.city}, ${agency.state}</div>
      <div style="margin-bottom:10px;">Time: ${time} (${tzAbbr})</div>
      <div style="display:flex; justify-content:center; gap:10px; margin-top:6px;">
        <a href="${agency.website}" target="_blank" title="Teamwork" style="
          display:inline-flex;
          align-items:center;
          justify-content:center;
          width:32px;
          height:32px;
          border-radius:50%;
        ">
          <img src="assets/teamwork-icon.png" alt="Teamwork" style="width:28px;height:28px;border-radius:50%;">
        </a>
        <a href="${agency.linkedin}" target="_blank" title="LinkedIn" style="
          display:inline-flex;
          align-items:center;
          justify-content:center;
          width:32px;
          height:32px;
          border-radius:50%;
        ">
          <img src="assets/linkedin-icon.png" alt="LinkedIn" style="width:28px;height:28px;border-radius:50%;">
        </a>
      </div>
    </div>
  `;
}

// Load and render agency markers
fetch('agencies.json?nocache=' + new Date().getTime())
  .then(response => response.json())
  .then(data => {
  const keyContainer = document.getElementById('agency-key');

  data.forEach(agency => {
    const iconHTML = `
      <div class="circle-marker">
        <img src="${agency.icon}" alt="${agency.name}" />
      </div>
    `;

    const customIcon = L.divIcon({
      className: '',
      html: iconHTML,
      iconSize: [60, 60],
      iconAnchor: [30, 60],
      popupAnchor: [0, -50]
    });

    const marker = L.marker(agency.coordinates, { icon: customIcon }).addTo(map);
    marker.bindPopup(generatePopupContent(agency));

    marker.on('popupopen', () => {
      const popupEl = document.querySelector('.leaflet-popup-content');
      if (popupEl) {
        L.DomEvent.disableClickPropagation(popupEl);
      }

      marker._popupInterval = setInterval(() => {
        if (marker.isPopupOpen()) {
          marker.getPopup().setContent(generatePopupContent(agency));
        }
      }, 1000);
    });

    marker.on('popupclose', () => {
      clearInterval(marker._popupInterval);
    });

    marker.on('click', () => {
      map.setView(agency.coordinates, 6, {
        animate: true,
        duration: 0.5
      });
      marker.openPopup();
    });

    // ✅ Add to agency key
    const keyItem = document.createElement('div');
    keyItem.classList.add('key-entry');
    keyItem.innerHTML = `<img src="${agency.icon}" alt="${agency.name}" /><span>${agency.name}</span>`;
    keyItem.addEventListener('click', () => {
      map.setView(agency.coordinates, 6, {
        animate: true,
        duration: 0.5
      });
      marker.openPopup();
    });
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

// Mobile Key Toggle
const toggleButton = document.getElementById('toggle-key');
if (toggleButton) {
  toggleButton.addEventListener('click', () => {
    const key = document.getElementById('agency-key');
    key.classList.toggle('show');
  });
}
