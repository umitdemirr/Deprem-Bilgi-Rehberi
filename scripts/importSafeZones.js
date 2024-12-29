require('dotenv').config();
const mongoose = require('mongoose');
const SafeZone = require('../models/safeZone');


// CSV formatında veriyi oluşturmak için fonksiyon
function generateCSV() {
    const header = "Alan Adı,Adres,Enlem,Boylam,Kapasite,İlçe\n";
    const rows = malatyaSafeZones.map(zone => {
        return `"${zone.name}","${zone.address}",${zone.location.coordinates[1]},${zone.location.coordinates[0]},${zone.capacity},"${zone.district}"`;
    }).join('\n');
    
    return header + rows;
}

// Mevcut örnek verilere Malatya verilerini ekle
const sampleSafeZones = [
    // ... mevcut veriler ...
].concat(malatyaSafeZones);

// CSV dosyası oluştur
const fs = require('fs');
fs.writeFileSync('malatya_toplanma_alanlari.csv', generateCSV());

async function importSafeZones() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB bağlantısı başarılı');

        // Mevcut verileri temizle
        await SafeZone.deleteMany({});
        console.log('Mevcut veriler temizlendi');

        // Yeni verileri ekle
        const result = await SafeZone.insertMany(sampleSafeZones);
        console.log(`${result.length} toplanma alanı eklendi`);

        mongoose.connection.close();
    } catch (error) {
        console.error('Veri ekleme hatası:', error);
        process.exit(1);
    }
}

importSafeZones(); 