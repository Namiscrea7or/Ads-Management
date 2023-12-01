// mapDisplay.js

// Import thư viện Leaflet
import L from 'leaflet';

// Khởi tạo bản đồ và đặt tọa độ trung tâm
const map = L.map('map').setView([51.505, -0.09], 13);

// Thêm bản đồ từ OpenStreetMap vào bản đồ
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Tạo marker và thêm vào bản đồ
const marker = L.marker([51.5, -0.09]).addTo(map);

// Thêm popup cho marker
marker.bindPopup('Hello, this is a sample popup!').openPopup();
