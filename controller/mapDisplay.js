const map = L.map('map').setView([10.762835589385107, 106.67990747488228], 13);

const userRole = localStorage.getItem('userRole')

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

const geocoder = L.Control.Geocoder.nominatim();

var adsCheckButton = document.createElement('button');
adsCheckButton.style.display = 'none';
document.body.appendChild(adsCheckButton);
let checkBtn = false;
map.on('click', function (e) {
  var latlng = e.latlng;

  geocoder.reverse(latlng, map.options.crs.scale(map.getZoom()), function (results) {
    console.log(results);

    if (results.length > 0) {
      var address = results[0].name;
      var { ward, district } = extractAddressInfo(address);

      var latitude = latlng.lat;
      var longitude = latlng.lng;

      console.log('Địa chỉ:', address);
      console.log('Quận:', district);
      console.log('Phường:', ward);
      console.log('Latitude:', latitude);
      console.log('Longitude:', longitude);

      var locationData = {
        name: 'Tên địa điểm',
        address: address,
        district: district,
        ward: ward,
        latitude: latitude,
        longitude: longitude
      };
      var clickedOnMarker = false;
      map.eachLayer(function (layer) {
        if (layer instanceof L.Marker && layer.getLatLng().equals(latlng)) {
          clickedOnMarker = true;
        }
      });

      if (!clickedOnMarker) {
        detailWhenClick(locationData);
        if (userRole === 'Cán bộ Sở') {
          adsCheckButton.style.display = 'block';
          adsCheckButton.innerHTML = 'Tạo điểm quảng cáo';
          if(checkBtn === false) {
            adsCheckButton.style.display = 'block';
            checkBtn = true;
          }
      
          adsCheckButton.addEventListener('click', function () {
            console.log('Button clicked for location:', locationData);
            showReportForm(locationData);
            checkBtn = false;
            adsCheckButton.style.display = 'none';
          });
        }
      }    
    }
  });
});

function extractAddressInfo(address) {
  var parts = address.split(',');
  var ward = '';
  var district = '';

  for (var i = 0; i < parts.length; i++) {
    var part = parts[i].trim();

    if (part.includes('Ward') || part.includes('Phường')) {
      ward = part.replace(/(Ward|Phường)/i, '').trim();
    }

    if (part.includes('District') || part.includes('Quận')) {
      district = part.replace(/(District|Quận)/i, '').trim();
    }
  }

  return { ward, district };
}

function showReportForm(locationData) {
  var formHTML = `<form id="adsCheck">
                    <label for="adType">Advertising Type:</label>
                    <select id="adType" name="adType" required>
                      <option value="Cổ động chính trị">Cổ động chính trị</option>
                      <option value="Quảng cáo thương mại">Quảng cáo thương mại</option>
                      <option value="Xã hội hoá">Xã hội hoá</option>
                    </select>
                    <label for="locationType">Location Type:</label>
                    <select id="locationType" name="locationType" required>
                      <option value="Đất công">Đất công</option>
                      <option value="Đất tư nhân">Đất tư nhân</option>
                      <option value="Trung tâm thương mại">Trung tâm thương mại</option>
                      <option value="Chợ">Chợ</option>
                      <option value="Cây xăng">Cây xăng</option>
                      <option value="Nhà chờ xe buýt">Nhà chờ xe buýt</option>
                    </select>
                    <label for="latitude">Latitude:</label>
                    <input type="text" id="latitude" name="latitude" value="${locationData.latitude}" readonly>
                    <label for="longitude">Longitude:</label>
                    <input type="text" id="longitude" name="longitude" value="${locationData.longitude}" readonly>
                    
                    <label for="planningStatus">Đã quy hoạch chưa:</label>
                    <select id="planningStatus" name="planningStatus" required>
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                    <input type="hidden" id="reportedAddress" name="reportedAddress" value="${locationData.address}">
                    <input type="hidden" id="reportedWard" name="reportedWard" value="${locationData.ward || ''}">
                    <input type="hidden" id="reportedDistrict" name="reportedDistrict" value="${locationData.district || ''}">
                    <button type="button" onclick="submitForm()">Submit</button>
                 </form>`;
  $('#details').append(formHTML);
}


window.submitForm = function () {
  var accessToken = localStorage.getItem('accessToken');

  if (!accessToken) {
    console.error('Access token not available');
    return;
  }
  // var imageInput = document.getElementById('image');
  // var image = imageInput.files[0];
  var locationData = {
    adType: document.getElementById('adType').value,
    locationType: document.getElementById('locationType').value,
    latitude: document.getElementById('latitude').value,
    longitude: document.getElementById('longitude').value,
    address: document.getElementById('reportedAddress').value,
    ward: document.getElementById('reportedWard').value,
    district: document.getElementById('reportedDistrict').value,
    planningStatus: document.getElementById('planningStatus').value,

  };

  console.log(locationData)

  fetch('http://localhost:3030/api/marker/marker', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': accessToken,
    },
    body: JSON.stringify(locationData)
  })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      alert('Success');
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Fail');
    });
};




function loadDataFromServer() {
  console.log('Loading data from server');
  $.ajax({
    url: 'http://localhost:3030/api/marker/info',
    method: 'GET',
    headers: {
      'Authorization': localStorage.getItem('accessToken'),
    },
    success: function (data) {
      console.log('Data loaded successfully:', data);
      updateMapWithMarkers(data.markerList);
    },
    error: function (error) {
      console.error('Error loading data:', error);
    }
  });
}


var detailsVisible = false;

function updateMapWithMarkers(data) {
  console.log('Updating map with markers:', data);
  map.eachLayer(function (layer) {
    if (layer instanceof L.Marker) {
      map.removeLayer(layer);
    }
  });
  let rpBtnState = false;
  data.forEach(function (location) {
    console.log('Adding marker for location:', location);

    var marker = L.marker([location.latitude, location.longitude]).addTo(map);

    marker.bindPopup(`<br>${location.address}`).on('click', function () {
      if(rpBtnState === false) {
        $('#reportButton').css('display', 'block');
        rpBtnState = true;
      }
      else {
        $('#reportButton').css('display', 'none');
        rpBtnState = false;
      }
      adsCheckButton.style.display = 'none';
      if (detailsVisible) {
        hideDetails();
      } else {
        showDetails(location);
      }
    });
  });
}

function showDetails(location) {
  var detailsHTML = `<h3>Thông tin Điểm Đặt Quảng Cáo</h3>
                       <p><strong>Địa chỉ:</strong> ${location.address}</p>
                       <p><strong>Khu vực:</strong> Quận: ${location.ward}, Phường:${location.district}</p>
                       <p><strong>Loại vị trí:</strong> ${location.locationType}</p>
                       <p><strong>Loại quảng cáo:</strong> ${location.adType}</p>
                       <p><strong>Thông tin quy hoạch:</strong> ${location.planningStatus ? "Đã quy hoạch" : "Chưa quy hoạch"}</p>
                       `;

  // Kiểm tra xem có hình ảnh hay không
  if (location.image) {
    detailsHTML += `<p><strong>Hình ảnh:</strong> <img src="${location.image}" alt="${location.address}" style="max-width: 100%; height: auto;"></p>`;
  }

  // Kiểm tra xem có bảng quảng cáo hay không
  if (location.billboards && location.billboards.length > 0) {
    detailsHTML += `<h3>Thông tin Bảng Quảng Cáo</h3>`;
    detailsHTML += `<ul>`;
    location.billboards.forEach(function (billboard) {
      detailsHTML += `<li>
                            <strong>Loại bảng:</strong> ${billboard.type}, 
                            <strong>Kích thước:</strong> ${billboard.size}, 
                            <strong>Ngày hết hạn:</strong> ${billboard.expirationDate}
                            <br>
                            <img src="${billboard.image}" alt="${location.address}" style="max-width: 100%; height: auto;">
                        </li>`;
    });
    detailsHTML += `</ul>`;
  }

  $('#details').html(detailsHTML);
  detailsVisible = true;
}


function detailWhenClick(location) {
  var detailsHTML = `<h3>Thông tin Điểm Đặt Quảng Cáo</h3>
                     <p><strong>Địa chỉ:</strong> ${location.address}</p>`;
  $('#details').html(detailsHTML);
}

function hideDetails() {
  $('#details').html('');
  detailsVisible = false;
}

function initializeMap() {
  loadDataFromServer();
  var control = L.Control.geocoder({
    position: 'topright',
    geocoder: geocoder
  }).addTo(map);

  map.on('click', function (e) {
    var latlng = e.latlng;
    console.log(latlng);
    geocoder.reverse(latlng, map.options.crs.scale(map.getZoom()), function (results) {
      console.log(results);
    });
  });
}

$(document).ready(function () {
  $('#reportForm').hide();

  map.on('popupopen', function () {
    $('#reportButton').css('display', 'block');
  });

  map.on('popupclose', function () {
    $('#reportForm').hide();
    $('#reportButton').css('display', 'none');
  });
  

  $('#reportButton').click(function () {
    $('#reportForm').toggle();
  });

  $('#report').submit(function (e) {
    e.preventDefault();
    sendReport();
    $('#reportForm').hide();
    $('#reportButton').css('display', 'none');
  });

  initializeMap();
});
