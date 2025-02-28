// สร้างแผนที่ Leaflet
var map = L.map('map').setView([13.7563, 100.5018], 7); // กำหนดจุดศูนย์กลางและระดับการซูม

// เพิ่ม Tile Layer (แผนที่ฐาน)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// โหลดข้อมูล GeoJSON (แทนที่ 'tambon_geojson.json' ด้วยชื่อไฟล์ GeoJSON ของคุณ)
fetch('tha_admbnda_adm3_rtsd_20220121_geo.json')
    .then(response => response.json())
    .then(data => {
        // เพิ่ม GeoJSON Layer ลงในแผนที่
        L.geoJSON(data, {
            style: {
                fillColor: 'yellow',
                weight: 1,
                opacity: 1,
                color: 'black',
                fillOpacity: 0.5
            },
            onEachFeature: function (feature, layer) {
                // เพิ่ม Popup หรือ Tooltip เพื่อแสดงข้อมูลเพิ่มเติม
                layer.bindPopup('ตำบล: ' + feature.properties.TAM_NAME); // แก้ไขตาม property ของข้อมูล GeoJSON
            }
        }).addTo(map);
    });