const accessToken = localStorage.getItem('accessToken');
const itemsPerPage = 2;
let currentPageCBP = 1;
let currentPageCBQ = 1;
let currentPageGuests = 1;

document.addEventListener('DOMContentLoaded', function () {
  console.log('Access Token:', accessToken);

  if (!accessToken) {
    console.error('Access token not found in localStorage.');
    return;
  }

  fetchUserInfo(accessToken);
});

async function fetchUserInfo(accessToken) {
  try {
    const response = await fetch('http://localhost:3030/api/user/info', {
      method: 'GET',
      headers: {
        'Authorization': accessToken
      },
    });

    const data = await response.json();
    handleSuccess(data);
  } catch (error) {
    handleError(error);
  }
}

function handleResponse(response) {
  if (!response.ok) {
    console.error(`HTTP error! Status: ${response.status}`);
    return response.text().then(html => {
      console.error('HTML Content:', html);
      throw new Error('Non-JSON response received.');
    });
  }

  return response.json();
}

function handleSuccess(response) {
  if (response.success) {
    console.log(response);
    renderUserInfo(response.user);
    localStorage.setItem('userRole', response.user.role);
  } else {
    console.log('error');
    console.error('Error from server:', response.error);
  }
}

function handleError(error) {
  console.error('Error fetching user information:', error.message);
}

function renderUserInfo(user) {
  const userDetailsElement = document.getElementById('user-details');
  const additionalActionsElement = document.getElementById('additional-actions');

  const html = `
    <h2>${user.full_name}</h2>
    <p>Email: ${user.email}</p>
    <p>Phone Number: ${user.phone_number}</p>
    <p>Date of Birth: ${user.dob} </p>
    <p>Role: ${user.role} </p>
  `;
  userDetailsElement.innerHTML = html;

  if (user.role === 'Cán bộ Sở') {
    const additionalActionsHtml = `
      <button id="createDistrictOfficerBtn">Tạo cán bộ phường</button>
      <button id="createWardOfficerBtn">Tạo cán bộ quận</button>
      <button id="manageCBP">Quản lí Cán bộ Phường</button>
      <button id="manageCBQ">Quản lí Cán bộ Quận</button>
      <button id = "manageGuest">Quản lí người dân</button>
    `;
    additionalActionsElement.innerHTML = additionalActionsHtml;

    document.getElementById('createDistrictOfficerBtn').addEventListener('click', () => showCreateAccountForm('Cán bộ Phường'));
    document.getElementById('createWardOfficerBtn').addEventListener('click', () => showCreateAccountForm('Cán bộ Quận'));
    document.getElementById('manageCBP').addEventListener('click', () => {
      clearOtherLists();
      showWardOfficers();
    });

    document.getElementById('manageCBQ').addEventListener('click', () => {
      clearOtherLists();
      showDistrictOfficers();
    });

    document.getElementById('manageGuest').addEventListener('click', () => {
      clearOtherLists();
      showGuests();
    });
  }
}

function clearOtherLists() {
  const cbqElement = document.getElementById('cbq');
  const cbpElement = document.getElementById('cbp');
  const guestsElement = document.getElementById('guests');
  const paginationCbp = document.getElementById('pagination-controls-cbp')
  const paginationCbq = document.getElementById('pagination-controls-cbq')
  const paginationGuest = document.getElementById('pagination-controls-guests')
  paginationGuest.innerHTML = '';
  paginationCbp.innerHTML = '';
  paginationCbq.innerHTML = '';
  cbqElement.innerHTML = '';
  cbpElement.innerHTML = '';
  guestsElement.innerHTML = '';
}

function showCreateAccountForm(role) {
  const formHtml = `
  <form id="createAccountForm">
    <label for="email">Email:</label>
    <input type="email" id="email" name="email" required>

    <label for="password">Password:</label>
    <input type="password" id="password" name="password" required>

    <label for="full_name">Full Name:</label>
    <input type="text" id="full_name" name="full_name" required>

    <label for="phone_number">Phone Number:</label>
    <input type="tel" id="phone_number" name="phone_number" required>

    <label for="dob">Date of Birth:</label>
    <input type="date" id="dob" name="dob" required>

    <div id="predefinedMap" style="display: none;"></div>

    <div id="predefinedMapContainer" style="display: none;">
      <div id="predefinedMapInner" style="height: 400px;"></div>
    </div>

    <input type="text" id="address" placeholder="Nhập địa chỉ của bạn">
    <span id="showMapIcon" onclick="toggleMap()">🗺️</span>

    <label for="role">Role:</label>
    <input type="text" id="role" name="role" value="${role}" disabled>

    <input type="submit" value="Submit">
  </form>
`;

const formContainer = document.getElementById('form-container');
formContainer.innerHTML = formHtml;

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



  document.getElementById('createAccountForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    formData.append('role', role);

    fetch('http://localhost:3030/api/auth/register_CB', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': accessToken,
      },
      body: JSON.stringify({
        email: formData.get('email'),
        password: formData.get('password'),
        full_name: formData.get('full_name'),
        phone_number: formData.get('phone_number'),
        dob: formData.get('dob'),
        role: formData.get('role'),
      }),
    })
      .then(handleResponse)
      .then(handleCreateAccountSuccess)
      .catch(handleError);
  });
}

function handleCreateAccountSuccess(response) {
  if (response.success) {
    console.log('Account creation successful:', response);
    alert('Tạo thành công');
    location.reload();
  } else {
    alert('Tạo thất bại')
    console.error('Error creating account:', response.error);
  }
}

function createDistrictOfficerAccount() {
  console.log('Creating District Officer Account');
}

function createWardOfficerAccount() {
  console.log('Creating Ward Officer Account');
}

async function showWardOfficers() {
  try {
    const response = await fetch('http://localhost:3030/api/user/get_cbp_list', {
      method: 'GET',
      headers: {
        'Authorization': accessToken
      },
    });

    const data = await handleResponse(response);
    handleWardOfficersSuccess(data);
  } catch (error) {
    handleError(error);
  }
}

function handleWardOfficersSuccess(response) {
  if (response.success) {
    console.log(response);
    renderWardOfficers(response.cbpList);
  } else {
    console.log('error');
    console.error('Error from server:', response.error);
  }
}

function renderWardOfficers(wardOfficers) {
  const wardOfficersElement = document.getElementById('cbp');
  const paginationControlsCBP = document.getElementById('pagination-controls-cbp');

  paginationControlsCBP.innerHTML = `
    <button id="prevPageCBP">Previous</button>
    <span>Page ${currentPageCBP}</span>
    <button id="nextPageCBP">Next</button>
  `;

  const startIndex = (currentPageCBP - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedWardOfficers = wardOfficers.slice(startIndex, endIndex);

  const html = paginatedWardOfficers.map((officer, index) => `
      <h2>${officer.full_name}</h2>
      <p>Email: ${officer.email}</p>
      <p>Phone Number: ${officer.phone_number}</p>
      <p>Date of Birth: ${officer.dob} </p>
      <div class="button">
        <button class="edit-button" data-index="${startIndex + index}">Sửa</button>
        <button class="delete-button" data-index="${startIndex + index}">Xoá</button>
      </div>
  `).join('');

  wardOfficersElement.innerHTML = html;

  document.getElementById('prevPageCBP').addEventListener('click', () => {
    if (currentPageCBP > 1) {
      currentPageCBP--;
      renderWardOfficers(wardOfficers);
    }
  });

  document.getElementById('nextPageCBP').addEventListener('click', () => {
    const totalPages = Math.ceil(wardOfficers.length / itemsPerPage);
    if (currentPageCBP < totalPages) {
      currentPageCBP++;
      renderWardOfficers(wardOfficers);
    }
  });
  attachEditButtonListeners(wardOfficers)
  attachDeleteButtonListeners(wardOfficers)
}

async function showDistrictOfficers() {
  try {
    const response = await fetch('http://localhost:3030/api/user/get_cbq_list', {
      method: 'GET',
      headers: {
        'Authorization': accessToken
      },
    });

    const data = await handleResponse(response);
    handleDistrictOfficersSuccess(data);
  } catch (error) {
    handleError(error);
  }
}

function handleDistrictOfficersSuccess(response) {
  if (response.success) {
    console.log(response);
    renderDistrictOfficers(response.cbqList);
  } else {
    console.log('error');
    console.error('Error from server:', response.error);
  }
}

function renderDistrictOfficers(districtOfficers) {
  const districtOfficersElement = document.getElementById('cbq');
  const paginationControlsCBQ = document.getElementById('pagination-controls-cbq');

  paginationControlsCBQ.innerHTML = `
    <button id="prevPageCBQ">Previous</button>
    <span>Page ${currentPageCBQ}</span>
    <button id="nextPageCBQ">Next</button>
  `;

  const startIndex = (currentPageCBQ - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedDistrictOfficers = districtOfficers.slice(startIndex, endIndex);

  const html = paginatedDistrictOfficers.map((officer, index) => `
      <h2>${officer.full_name}</h2>
      <p>Email: ${officer.email}</p>
      <p>Phone Number: ${officer.phone_number}</p>
      <p>Date of Birth: ${officer.dob} </p>
      <div class="button">
        <button class="edit-button" data-index="${startIndex + index}">Sửa</button>
        <button class="delete-button" data-index="${startIndex + index}">Xoá</button>
      </div>
  `).join('');

  districtOfficersElement.innerHTML = html;

  document.getElementById('prevPageCBQ').addEventListener('click', () => {
    if (currentPageCBQ > 1) {
      currentPageCBQ--;
      renderDistrictOfficers(districtOfficers);
    }
  });

  document.getElementById('nextPageCBQ').addEventListener('click', () => {
    const totalPages = Math.ceil(districtOfficers.length / itemsPerPage);
    if (currentPageCBQ < totalPages) {
      currentPageCBQ++;
      renderDistrictOfficers(districtOfficers);
    }
  });
  attachEditButtonListeners(districtOfficers)
  attachDeleteButtonListeners(districtOfficers)
}

async function showGuests() {
  try {
    const response = await fetch('http://localhost:3030/api/user/get_guest_list', {
      method: 'GET',
      headers: {
        'Authorization': accessToken
      },
    });

    const data = await handleResponse(response);
    handleGuestsSuccess(data);
  } catch (error) {
    handleError(error);
  }
}

function handleGuestsSuccess(response) {
  if (response.success) {
    console.log(response);
    renderGuests(response.guestList);
  } else {
    console.log('error');
    console.error('Error from server:', response.error);
  }
}

function renderGuests(guests) {
  const guestsElement = document.getElementById('guests');
  const paginationControlsGuests = document.getElementById('pagination-controls-guests');

  paginationControlsGuests.innerHTML = `
    <button id="prevPageGuests">Previous</button>
    <span>Page ${currentPageGuests}</span>
    <button id="nextPageGuests">Next</button>
  `;

  const startIndex = (currentPageGuests - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedGuests = guests.slice(startIndex, endIndex);

  const html = paginatedGuests.map((guest, index) => `
      <h2>${guest.full_name}</h2>
      <p>Email: ${guest.email}</p>
      <p>Phone Number: ${guest.phone_number}</p>
      <p>Date of Birth: ${guest.dob} </p>
      <div class="button">
        <button class="edit-button" data-index="${startIndex + index}">Sửa</button>
        <button class="delete-button" data-index="${startIndex + index}">Xoá</button>
      </div>
  `).join('');

  guestsElement.innerHTML = html;

  document.getElementById('prevPageGuests').addEventListener('click', () => {
    if (currentPageGuests > 1) {
      currentPageGuests--;
      renderGuests(guests);
    }
  });

  document.getElementById('nextPageGuests').addEventListener('click', () => {
    const totalPages = Math.ceil(guests.length / itemsPerPage);
    if (currentPageGuests < totalPages) {
      currentPageGuests++;
      renderGuests(guests);
    }
  });
  attachEditButtonListeners(guests)
  attachDeleteButtonListeners(guests)
}

function attachEditButtonListeners(reports) {
  const editButtons = document.querySelectorAll('.edit-button');
  editButtons.forEach((editButton) => {
    editButton.addEventListener('click', () => {
      const reportIndex = parseInt(editButton.getAttribute('data-index'), 10);
      showEditForm(reports[reportIndex], reportIndex);
    });
  });
}
function attachDeleteButtonListeners(reports) {
  const deleteButtons = document.querySelectorAll('.delete-button');
  deleteButtons.forEach((deleteButton) => {
    deleteButton.addEventListener('click', () => {
      const reportIndex = parseInt(deleteButton.getAttribute('data-index'), 10);
      const confirmation = confirm('Are you sure you want to delete this report?');
      if (confirmation) {
        console.log('có vô đây');
        console.log('đây là ', reports[reportIndex].email);
        deleteReport(reports[reportIndex].email, reportIndex);
      }
    });
  });
}

function showEditForm(user, index) {
  const editForm = document.querySelector('.edit-form');
  console.log('Setting role:', user.role);
  console.log('Setting full_name:', user.full_name);
  console.log('Setting phone_number:', user.phone_number);
  console.log('Setting dob:', user.dob);
  editForm.querySelector('#role').value = user.role;
  editForm.querySelector('#full_name').value = user.full_name;
  editForm.querySelector('#phone').value = user.phone_number;
  editForm.querySelector('#dob').value = user.dob;

  editForm.style.display = 'block';

  const saveButton = editForm.querySelector('.save-edit');
  saveButton.addEventListener('click', () => {
    saveEditedReport(user, index);
  });
}

async function saveEditedReport(report, index) {
  const editForm = document.querySelector('.edit-form');

  const updatedUser = {
    email: report.email,
    role: editForm.querySelector('#role').value,
    full_name: editForm.querySelector('#full_name').value,
    phone_number: editForm.querySelector('#phone').value,
    dob: editForm.querySelector('#dob').value,
  };

  console.log(updatedUser);

  try {
    const response = await fetch(`http://localhost:3030/api/user/update_user`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': accessToken,
      },
      body: JSON.stringify(updatedUser),
    });

    const data = await handleResponse(response);
    if (data.success) {
      editForm.style.display = 'none';
      location.reload();
    }
    else {
      alert(data.message)
      return;
    }
  } catch (error) {
    handleError(error);
  }
}

async function deleteReport(email, index) {
  try {
    console.log(email);
    const response = await fetch(`http://localhost:3030/api/user/${email}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': accessToken,
      },
    });

    const data = await handleResponse(response);
    if (data.success) {
      console.log('User deleted successfully');
      location.reload();
    } else {
      alert('Error deleting user: ' + data.message);
    }
  } catch (error) {
    handleError(error);
  }
}



