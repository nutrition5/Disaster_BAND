// แทนที่ด้วย API Key และ Spreadsheet ID ของคุณ
const apiKey = 'AIzaSyAAlmTNXoS6JrgY_sBDnZ7KmQZ-oYOD5rs';
const spreadsheetId = '1YKBM3TC4FTLjnQZ9zu2ngT4p1kbBpfU8rvz66km1Wqg';
const sheetName = 'data'; // แทนที่ด้วยชื่อชีตของคุณ

// สร้างแผนที่ Leaflet
var map = L.map('map').setView([13.7563, 100.5018], 7);

// เพิ่ม Tile Layer (แผนที่ฐาน)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// เพิ่ม Marker (ตัวอย่าง)
L.marker([13.7563, 100.5018]).addTo(map).bindPopup('Marker ตัวอย่าง');

fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}?key=${apiKey}`)
    .then(response => response.json())
    .then(data => {
        // แปลงข้อมูลจาก Google Sheets API เป็น GeoJSON
        const geojsonData = {
            type: 'FeatureCollection',
            features: data.values.slice(1).map(row => ({
                type: 'Feature',
                properties: {
                    id: row[0],
                    year: row[1],
                    zone: row[2],
                    agency: row[3],
                    disasterType: row[4],
                    date: row[5],
                    province: row[6],
                    amphoe: row[7],
                    tambon: row[8],
                    supplyType: row[9],
                    amount: row[10],
                    farmers: row[11],
                    animals: row[12]
                },
                geometry: {
                    type: 'Point',
                    coordinates: [parseFloat(row[14]), parseFloat(row[13])] // ลองจิจูด, ละติจูด (แก้ไขตามตำแหน่งคอลัมน์ของคุณ)
                }
            }))
        };

        // ฟังก์ชันกำหนดสีตามปริมาณความช่วยเหลือ
        function getColor(d) {
            return d > 10000 ? '#800026' :
                   d > 5000  ? '#BD0026' :
                   d > 2000  ? '#E31A1C' :
                   d > 1000  ? '#FC4E2A' :
                   d > 500   ? '#FD8D3C' :
                   d > 200   ? '#FEB24C' :
                   d > 100   ? '#FED976' :
                              '#FFEDA0';
        }

        // ฟังก์ชันกำหนดสไตล์ Choropleth Map
        function style(feature) {
            return {
                fillColor: getColor(feature.properties.amount),
                weight: 2,
                opacity: 1,
                color: 'white',
                fillOpacity: 0.7
            };
        }

        // เพิ่ม Choropleth Map ลงในแผนที่
        L.geoJSON(geojsonData, { style: style }).addTo(map);

        // เพิ่ม Marker พร้อม Popup
        L.geoJSON(geojsonData, {
            onEachFeature: function (feature, layer) {
                layer.bindPopup(`ตำบล: ${feature.properties.tambon}<br>อำเภอ: ${feature.properties.amphoe}<br>จังหวัด: ${feature.properties.province}<br>จำนวนที่จ่าย: ${feature.properties.amount}<br>ประเภทเสบียง: ${feature.properties.supplyType}`);
            }
        }).addTo(map);
    });