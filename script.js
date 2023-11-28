var map = L.map('map').setView([10.762835589385107, 106.67990747488228], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

$(document).ready(function () {
    loadDataFromServer();
});

function loadDataFromServer() {
    $.ajax({
        url: './data.json',
        method: 'GET',
        dataType: 'json',
        success: function (data) {
            updateMapWithMarkers(data);
        },
        error: function (error) {
            console.error('Error loading data:', error);
        }
    });
}

function updateMapWithMarkers(data) {
    map.eachLayer(function (layer) {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });

    data.forEach(function (location) {
        var marker = L.marker([location.latitude, location.longitude]).addTo(map);
        marker.bindPopup(`<b>${location.name}</b><br>${location.address}`).on('click', function () {
            showDetails(location);
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
}
// Thêm vào document ready function trong main.js
$(document).ready(function () {
    // ...

    // Hiển thị form báo cáo khi click vào marker
    map.on('popupopen', function () {
        $('#reportForm').show();
    });

    // Gửi báo cáo khi submit form
    $('#report').submit(function (e) {
        e.preventDefault();
        sendReport();
    });
});

function sendReport() {
    // Xử lý logic gửi báo cáo ở đây
    // Lấy giá trị từ form và thực hiện các bước xử lý cần thiết
    // Đảm bảo xử lý cơ chế captcha và gửi dữ liệu về máy chủ
    // Hiển thị thông báo khi báo cáo đã được gửi
}

$(document).ready(function () {
    // ...

    // Cập nhật sự kiện khi popup mở
    map.on('popupopen', function (e) {
        var popup = e.popup;
        var location = popup.options.location;

        // Thêm nút "Báo cáo vi phạm" vào popup
        var reportButton = $('<button id="reportButton">Báo Cáo Vi Phạm</button>');
        reportButton.click(function () {
            // Hiển thị form báo cáo khi click vào nút
            $('#reportForm').show();
            // Hiển thị mapControl (nếu bạn sử dụng)
            map.addControl(geocoder);
        });

        // Hiển thị nút "Báo cáo vi phạm" dưới thông tin chi tiết
        popup.setContent(popup.getContent() + '<br>').append(reportButton[0]);
    });

    // Gửi báo cáo khi submit form
    $('#report').submit(function (e) {
        e.preventDefault();
        sendReport();
        // Ẩn form sau khi gửi
        $('#reportForm').hide();
    });
});

