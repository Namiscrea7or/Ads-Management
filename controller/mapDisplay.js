
const map = L.map('map').setView([10.762835589385107, 106.67990747488228], 13);

const userRole = localStorage.getItem('userRole')

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

const geocoder = L.Control.Geocoder.nominatim();

var button = document.createElement('button');
button.style.display = 'none'; // Initially hide the button
document.body.appendChild(button);

map.on('click', function (e) {
  var latlng = e.latlng;

  // Sử dụng geocoder để lấy địa chỉ từ tọa độ
  geocoder.reverse(latlng, map.options.crs.scale(map.getZoom()), function (results) {
    if (results.length > 0) {
      var address = results[0].name; // Lấy tên đường, quận huyện, thành phố, v.v.

      // Hiển thị thông tin địa chỉ
      console.log('Địa chỉ:', address);

      // Hiển thị thông tin bảng quảng cáo (thay thế bằng logic hiển thị thông tin từ dữ liệu của bạn)
      var locationData = { name: 'Tên địa điểm', address: address, /* ... các thông tin khác ... */ };
      detailWhenClick(locationData);

      // Check user role
      if (userRole === 'Cán bộ Sở') {
        // Update button properties
        button.innerHTML = 'Your Button Text';
        button.style.display = 'block'; // Show the button

        // Remove previous click event listener to avoid multiple bindings
        button.removeEventListener('click', previousClickListener);

        // Add an event listener to the button
        button.addEventListener('click', function () {
          // Your button click logic goes here
          console.log('Button clicked for location:', locationData);
          // Hide the button after click
          button.style.display = 'none';
        });

        // Save the current click event listener to remove it later
        var previousClickListener = button.addEventListener('click', function () {});
      }
    }
  });
});




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

var detailsVisible = false; // Biến để kiểm tra trạng thái hiển thị/ẩn details

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
  // hàm xử lý thông tin khi click
  var detailsHTML = `<h3>Thông tin Điểm Đặt Quảng Cáo</h3>
                     <p><strong>Địa chỉ:</strong> ${location.address}</p>
                     <!-- ... Các thông tin khác ... -->`;
  $('#details').html(detailsHTML);

  // Hiển thị form báo cáo
}

function hideDetails() {
  // Ẩn thông tin chi tiết
  $('#details').html('');

  // Đặt trạng thái hiển thị/ẩn thành false
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