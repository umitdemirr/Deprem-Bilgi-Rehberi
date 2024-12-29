const axios = require('axios');
const SafeZone = require('../models/SafeZone');

const sampleData = {
    istanbul: [
        {
            name: "Yıldız Parkı",
            type: "TOPLANMA_ALANI",
            location: {
                type: "Point",
                coordinates: [28.9917, 41.0454]
            },
            capacity: 5000,
            address: "Beşiktaş Yıldız Parkı",
            district: "Beşiktaş",
            city: "İSTANBUL",
            status: "AKTİF"
        },
        {
            name: "Göztepe 60. Yıl Parkı",
            type: "TOPLANMA_ALANI",
            location: {
                type: "Point",
                coordinates: [29.0610, 40.9785]
            },
            capacity: 3000,
            address: "Göztepe Mahallesi",
            district: "Kadıköy",
            city: "İSTANBUL",
            status: "AKTİF"
        }
    ],
    ankara: [
        {
            name: "Gençlik Parkı",
            type: "TOPLANMA_ALANI",
            location: {
                type: "Point",
                coordinates: [32.8472, 39.9272]
            },
            capacity: 8000,
            address: "Ulus Meydanı",
            district: "Altındağ",
            city: "ANKARA",
            status: "AKTİF"
        },
        {
            name: "ODTÜ Stadyumu",
            type: "TOPLANMA_ALANI",
            location: {
                type: "Point",
                coordinates: [32.7805, 39.8915]
            },
            capacity: 4000,
            address: "ODTÜ Kampüsü",
            district: "Çankaya",
            city: "ANKARA",
            status: "AKTİF"
        }
    ]
};

const safeZoneService = {
    // Test verileri için
    async fetchSampleData() {
        return [...sampleData.istanbul, ...sampleData.ankara];
    },

    // Tüm şehirlerden verileri çek ve birleştir
    async fetchAllSafeZones() {
        try {
            // Şimdilik örnek veriyi kullanalım
            const allZones = await this.fetchSampleData();
            
            // MongoDB'ye kaydet
            await SafeZone.deleteMany({}); // Mevcut verileri temizle
            await SafeZone.insertMany(allZones);

            return allZones;
        } catch (error) {
            console.error('Veri çekme hatası:', error);
            throw error;
        }
    },

    // En yakın toplanma alanlarını bul
    async findNearestSafeZones(lat, lng, radius = 5000, limit = 10) {
        try {
            return await SafeZone.find({
                location: {
                    $near: {
                        $geometry: {
                            type: "Point",
                            coordinates: [parseFloat(lng), parseFloat(lat)]
                        },
                        $maxDistance: parseInt(radius)
                    }
                }
            }).limit(limit);
        } catch (error) {
            console.error('En yakın toplanma alanları bulunurken hata:', error);
            throw error;
        }
    }
};

module.exports = safeZoneService; 