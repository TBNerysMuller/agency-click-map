// script.js

// Eastern Time Clock
function updateEasternTime() {
  const options = {
    timeZone: 'America/New_York',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  };
  const formatter = new Intl.DateTimeFormat([], options);
  const timeString = formatter.format(new Date());
  document.getElementById('easternTime').textContent = `Eastern Time (EST/EDT): ${timeString}`;
}

setInterval(updateEasternTime, 1000);
updateEasternTime();

// Toggle Key on Mobile
const toggleButton = document.getElementById('toggleKey');
const agencyKey = document.getElementById('agencyKey');

if (toggleButton) {
  toggleButton.addEventListener('click', () => {
    agencyKey.classList.toggle('open');
  });
}

// Map Initialization
const map = L.map('map').setView([39.8283, -98.5795], 4);

L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors & CartoDB',
  subdomains: 'abcd',
  maxZoom: 19,
}).addTo(map);

// Agency Data
const agencies = [
  {
    name: '2626 Consulting',
    location: 'Chicago, IL',
    timezone: 'America/Chicago',
    website: 'https://2626consulting.com',
    lat: 41.8781,
    lng: -87.6298,
    logo: 'logos/2626.png',
  },
  {
    name: 'Ascend Strategy & Design',
    location: 'Valdosta, GA',
    timezone: 'America/New_York',
    website: 'https://ascendstrategy.com',
    lat: 30.8327,
    lng: -83.2785,
    logo: 'logos/ascend.png',
  },
  {
    name: 'Conduit Digital',
    location: 'New Jersey, USA',
    timezone: 'America/New_York',
    website: 'https://conduitdigital.us',
    lat: 39.9526,
    lng: -75.1652,
    logo: 'logos/conduit.png',
  }
];

// Add Markers
agencies.forEach(agency => {
  const icon = L.icon({
    iconUrl: agency.logo,
    iconSize: [40, 40],
    className: 'agency-marker'
  });

  const marker = L.marker([agency.lat, agency.lng], { icon }).addTo(map);

  function getTimeInZone(tz) {
    const now = new Date();
    return new Intl.DateTimeFormat([], {
      timeZone: tz,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(now);
  }

  marker.bindPopup(
    `
    <img src="${agency.logo}" alt="${agency.name}" /><br />
    <h3>${agency.name}</h3>
    ${agency.location}<br />
    Time (${agency.timezone.split('/')[1].replace('_',' ')}): ${getTimeInZone(agency.timezone)}<br />
    <a href="${agency.website}" target="_blank">Visit Website</a>
    `
  );

  const keyItem = document.createElement('li');
  const keyIcon = document.createElement('img');
  keyIcon.src = agency.logo;
  keyIcon.className = 'agency-icon';
  const keyText = document.createElement('span');
  keyText.textContent = agency.name;
  keyItem.appendChild(keyIcon);
  keyItem.appendChild(keyText);
  keyItem.onclick = () => marker.openPopup();

  document.getElementById('agencyKeyList').appendChild(keyItem);
});
