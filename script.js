// แทนที่ด้วย API Key และ Spreadsheet ID ของคุณ
const apiKey = '639462274252-qs02gp3oqqeufpsap1k0j8nrffpjjodf.apps.googleusercontent.com';
const spreadsheetId = '1YKBM3TC4FTLjnQZ9zu2ngT4p1kbBpfU8rvz66km1Wqg';
const sheetName = 'data'; // แทนที่ด้วยชื่อชีตของคุณ

// สร้างแผนที่ Leaflet
var map = L.map('map').setView([13.7563, 100.5018], 7); // กำหนดจุดศูนย์กลางและระดับการซูม

// เพิ่ม Tile Layer (แผนที่ฐาน)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// เพิ่ม Marker (ตัวอย่าง)
L.marker([13.7563, 100.5018]).addTo(map)
	.bindPopup('Marker ตัวอย่าง');

fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}?key=${apiKey}`)
    .then(response => response.json())
    .then(data => {
        // แปลงข้อมูลจาก Google Sheets API เป็น GeoJSON
        const geojsonData = {
            type: 'FeatureCollection',
            features: data.values.slice(1).map(row => ({
                type: 'Feature',
                properties: {
                    // กำหนด properties ตามคอลัมน์ใน Google Sheets
                    name: row[0],
                    value: row[1],
                    tambon: row[8], // ข้อมูลตำบลจาก google sheet
                    amphoe: row[7], // ข้อมูลอำเภอจาก google sheet
                    province: row[6], // ข้อมูลจังหวัดจาก google sheet
										type: row[9], //ประเภทเสบียง
                    amount: row[10], // จำนวนที่จ่าย
                },
                geometry: {
                    type: 'Point',
                    coordinates: [parseFloat(row[100.5018]), parseFloat(row[13.7563])] // ลองจิจูด, ละติจูด(แก้ไขตามตำแหน่งคอลัมภ์ข้อมูลพิกัด)
                }
            }))
        };

        // แสดงผล GeoJSON บนแผนที่ Leaflet
        L.geoJSON(geojsonData, {
            onEachFeature: function (feature, layer) {
                layer.bindPopup(`ตำบล: ${feature.properties.tambon}<br>อำเภอ: ${feature.properties.amphoe}<br>จังหวัด: ${feature.properties.province}<br>จำนวน: ${feature.properties.amount}`);
            }
        }).addTo(map);
    });