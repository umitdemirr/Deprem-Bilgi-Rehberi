const axios = require('axios');
const cheerio = require('cheerio');
const SafeZone = require('../models/SafeZone');

// Güvenli bölgeleri çeken ve veritabanına kaydeden servis
const safeZoneService = {
    async fetchSafeZones() {
        try {
            const response = await axios.get('https://www.ankara.bel.tr/toplanma-alanlari');
            const data = response.data;
            
            // Veriyi parse et
            const safeZones = this.parseSafeZoneData(data);
            
            // Veritabanına kaydet
            await this.saveSafeZones(safeZones);
            
            return safeZones;
        } catch (error) {
            console.error('Güvenli bölgeler verisi çekilirken hata:', error);
            throw error;
        }
    },

    // Güvenli bölgeleri parse eden fonksiyon
    parseSafeZoneData(data) {
        const $ = cheerio.load(data);
        const safeZones = [];

        // "toplanma alanları" klasöründeki bilgileri seçin
        $('.toplanma-alanlari-class').each((index, element) => {
            const name = $(element).find('.name-class').text().trim(); // İsim için uygun seçici
            const uniqueId = $(element).find('.unique-id-class').text().trim(); // Benzersiz ID için uygun seçici
            const city = $(element).find('.city-class').text().trim(); // Şehir için uygun seçici
            const district = $(element).find('.district-class').text().trim(); // İlçe için uygun seçici
            const coordinates = $(element).find('.coordinates-class').text().trim().split(',').map(Number); // Koordinatlar için uygun seçici
            const capacity = parseInt($(element).find('.capacity-class').text().trim(), 10); // Kapasite için uygun seçici
            const source = 'municipality'; // Kaynağı sabit olarak belirleyebilirsiniz

            safeZones.push({
                name,
                uniqueId,
                city,
                district,
                location: {
                    type: 'Point',
                    coordinates
                },
                capacity,
                source
            });
        });

        return safeZones;
    },

    // Güvenli bölgeleri veritabanına kaydetme fonksiyonu
    async saveSafeZones(safeZones) {
        for (const zone of safeZones) {
            try {
                await SafeZone.findOneAndUpdate(
                    { name: zone.name }, // Benzersiz alan
                    zone,
                    { upsert: true, new: true }
                );
            } catch (error) {
                console.error('Güvenli bölge kaydedilirken hata:', error);
            }
        }
    }
};

module.exports = safeZoneService; 