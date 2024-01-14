const registerForm = document.getElementById('registerForm');

var predefinedMapContainer = document.getElementById('predefinedMapContainer');
var addressInput = document.getElementById('address');
var predefinedMap = L.map('predefinedMap');
navigator.geolocation.getCurrentPosition(function (position) {
  var lat = position.coords.latitude;
  var lng = position.coords.longitude;

  predefinedMap.setView([lat, lng], 14);
  reverseGeocode(predefinedMap.getCenter());
  addressInput.value = `(${predefinedMap.getCenter().lat.toFixed(6)}, ${predefinedMap.getCenter().lng.toFixed(6)})`;
});

function initializeMap() {
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(predefinedMap);
  var geocoder = L.Control.Geocoder.nominatim();



  predefinedMap.on('click', function (e) {
    if (predefinedMapContainer.style.display === 'block') {
      reverseGeocode(e.latlng);
      toggleMap();
    }
  });

  predefinedMap.on('moveend', function () {
    reverseGeocode(predefinedMap.getCenter());
    addressInput.value = `(${predefinedMap.getCenter().lat.toFixed(6)}, ${predefinedMap.getCenter().lng.toFixed(6)})`;
  });

  return predefinedMap;
}


function toggleMap() {
  predefinedMap.invalidateSize();

  if (predefinedMapContainer.style.display === 'none') {
    predefinedMapContainer.style.display = 'block';
    setTimeout(function () {
      predefinedMap.invalidateSize();
    }, 5);

    if (!predefinedMapInner._leaflet_id) {
      var innerMap = L.map('predefinedMapInner').setView([10.762835589385107, 106.67990747488228], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(innerMap);

      innerMap.on('click', function (e) {
        reverseGeocode(e.latlng);
        toggleMap();
      });
    }
  } else {
    predefinedMapContainer.style.display = 'none';
    onAddressInput();
  }
}

function getAndSetUserLocation() {
  navigator.geolocation.getCurrentPosition(function (position) {
    var lat = position.coords.latitude;
    var lng = position.coords.longitude;

    predefinedMap.setView([lat, lng], 14);
    reverseGeocode(predefinedMap.getCenter());
    addressInput.value = `(${predefinedMap.getCenter().lat.toFixed(6)}, ${predefinedMap.getCenter().lng.toFixed(6)})`;
  });
}

function onAddressInput() {
  console.log('Address changed to:', addressInput.value);
}

function reverseGeocode(latlng) {
  var url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}&zoom=18&addressdetails=1`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.display_name) {
        addressInput.value = data.display_name;
      } else {
        addressInput.value = `(${latlng.lat.toFixed(6)}, ${latlng.lng.toFixed(6)})`;
      }
    })
    .catch(error => {
      console.error('Error during reverse geocoding:', error);
    });
}

window.toggleMap = toggleMap;

if (registerForm) {
  registerForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const address = document.getElementById('address').value;
    const dob = document.getElementById('registerDob').value;
    const phoneNumber = document.getElementById('registerPhoneNumber').value;

    fetch('http://localhost:3030/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        full_name: name,
        email: email,
        password: password,
        address: address,
        dob: dob,
        phone_number: phoneNumber,
      }),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
        localStorage.setItem('accessToken', 'Bearer ' + data.accessToken);
        window.location.href = '/';
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Error')
      });
  });
} else {
  console.error('registerForm is null or undefined.');
}
