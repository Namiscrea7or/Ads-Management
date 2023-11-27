var map = L.map('map').setView([10.762835589385107, 106.67990747488228], 15);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Hàm để tải dữ liệu từ máy chủ
function loadDataFromServer() {
    // Sử dụng Ajax để gửi yêu cầu đến máy chủ
    // Ví dụ sử dụng thư viện jQuery để đơn giản hóa việc gọi Ajax
    $.ajax({
        url: './data.js', // Điều chỉnh đường dẫn tới endpoint của máy chủ của bạn
        method: 'GET',
        dataType: 'json',
        success: function (data) {
            // Xử lý dữ liệu nhận được từ máy chủ
            updateMapWithMarkers(data);
        },
        error: function (error) {
            console.error('Error loading data:', error);
        }
    });
}

// Hàm để cập nhật bản đồ với markers từ dữ liệu nhận được
function updateMapWithMarkers(data) {
    // Xóa các markers hiện tại trên bản đồ
    map.eachLayer(function (layer) {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });

    // Thêm markers mới dựa trên dữ liệu nhận được
    data.forEach(function (location) {
        var marker = L.marker(getLatLng(location)).addTo(map);
        // Cấu trúc popup và gắn vào marker
        var popupContent = `
            <strong>${location.name}</strong><br>
            Địa chỉ: ${location.address}<br>
            Khu vực: ${location.area}<br>
            Loại vị trí: ${location.locationType}<br>
            Hình thức quảng cáo: ${location.advertisingType}<br>
            ${location.planned ? "Đã quy hoạch" : "Chưa quy hoạch"}<br>
            <img src="${location.imagePath}" alt="${location.name}" style="max-width: 100%; height: auto;">
        `;
        marker.bindPopup(popupContent);
    });
}

// Hàm để lấy tọa độ từ thông tin địa điểm
function getLatLng(location) {
    // Tạm thời sử dụng tọa độ mẫu cho mục đích minh họa
    return [10.762835589385107, 106.67990747488228];
}

// Khi trang web được tải, gọi hàm để tải dữ liệu từ máy chủ và cập nhật bản đồ
$(document).ready(function () {
    loadDataFromServer();
});
