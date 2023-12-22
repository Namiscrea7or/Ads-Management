const map = L.map('map').setView([10.762835589385107, 106.67990747488228], 13);

const userRole = localStorage.getItem('userRole')

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

const geocoder = L.Control.Geocoder.nominatim();

var button = document.createElement('button');
button.style.display = 'none';
document.body.appendChild(button);

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
      detailWhenClick(locationData);

      if (userRole === 'Cán bộ Sở') {
        button.innerHTML = 'Your Button Text';
        button.style.display = 'block';

        button.removeEventListener('click', previousClickListener);

        button.addEventListener('click', function () {
          console.log('Button clicked for location:', locationData);
          showReportForm(locationData);
        });

        var previousClickListener = button.addEventListener('click', function () {});
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
  var formHTML = `<form id="reportForm">
                    <label for="reportDescription">Report Description:</label>
                    <textarea id="reportDescription" name="reportDescription" required></textarea>
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
                    <input type="hidden" id="reportedAddress" name="reportedAddress" value="${locationData.address}">
                    <input type="hidden" id="reportedWard" name="reportedWard" value="${locationData.ward || ''}">
                    <input type="hidden" id="reportedDistrict" name="reportedDistrict" value="${locationData.district || ''}">
                    <button type="submit">Submit Report</button>
                 </form>`;

  $('#details').append(formHTML);
}

function loadDataFromServer() {
  console.log('Loading data from server');
  $.ajax({
    url: '/data.json',
    method: 'GET',
    dataType: 'json',
    success: function (data) {
      console.log('Data loaded successfully:', data);
      updateMapWithMarkers(data);
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

  data.forEach(function (location) {
    console.log('Adding marker for location:', location);

    var marker = L.marker([location.latitude, location.longitude]).addTo(map);

    marker.bindPopup(`<b>${location.name}</b><br>${location.address}`).on('click', function () {
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
                       <p><strong>Khu vực:</strong> ${location.area}</p>
                       <p><strong>Loại vị trí:</strong> ${location.locationType}</p>
                       <p><strong>Hình thức quảng cáo:</strong> ${location.advertisingType}</p>
                       <p><strong>Thông tin quy hoạch:</strong> ${location.planned ? "Đã quy hoạch" : "Chưa quy hoạch"}</p>
                       <p><img src="${location.imagePath}" alt="${location.name}" style="max-width: 100%; height: auto;"></p>`;

  detailsHTML += `<h3>Thông tin Bảng Quảng Cáo</h3>`;
  detailsHTML += `<ul>`;
  location.billboards.forEach(function (billboard) {
    detailsHTML += `<li>
                            <strong>Loại bảng:</strong> ${billboard.type}, 
                            <strong>Kích thước:</strong> ${billboard.size}, 
                            <strong>Ngày hết hạn:</strong> ${billboard.expirationDate}
                            <br>
                            <img src="${billboard.image}" alt="${location.name}" style="max-width: 100%; height: auto;">
                        </li>`;
  });
  detailsHTML += `</ul>`;

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
