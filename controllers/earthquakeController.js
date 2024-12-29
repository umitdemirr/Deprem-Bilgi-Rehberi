const Earthquake = require('../models/earthquake');
const axios = require('axios');
const cheerio = require('cheerio');
const exphbs = require('express-handlebars');

// Handlebars konfigürasyonunu ekleyin
const hbs = exphbs.create({
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }
});
// Deprem verilerini çeken fonksiyon
const earthquakeController = {
    getEarthquakes: async (req, res) => {
        try {
            let earthquakes = await getEarthquakeData();
            
            // Filtreleme parametreleri
            const { magnitude, city, date } = req.query;
            // Filtreleme işlemi
            if (magnitude || city || date) {
                earthquakes = earthquakes.filter(eq => {
                    // Büyüklük filtresi
                    if (magnitude && eq.magnitude < parseFloat(magnitude)) {
                        return false;
                    }
                    // Şehir filtresi
                    if (city && !eq.location.toLowerCase().includes(city.toLowerCase())) {
                        return false;
                    }
                    // Zaman filtresi
                    if (date) {
                        const eqDate = new Date(eq.date);
                        const now = new Date();
                        
                        switch(date) {
                            case '1h':
                                return (now - eqDate) <= 60 * 60 * 1000;
                            case '6h':
                                return (now - eqDate) <= 6 * 60 * 60 * 1000;
                            case '24h':
                                return (now - eqDate) <= 24 * 60 * 60 * 1000;
                            case 'week':
                                return (now - eqDate) <= 7 * 24 * 60 * 60 * 1000;
                        }
                    }
                    return true;
                });
            }

            // İstatistikleri hesapla
            const stats = {
                last24Hours: earthquakes.filter(eq => {
                    const eqDate = new Date(eq.date);
                    const now = new Date();
                    return (now - eqDate) <= 24 * 60 * 60 * 1000;
                }).length,
                maxMagnitude: Math.max(...earthquakes.map(eq => eq.magnitude)).toFixed(1),
                mostActiveCity: getMostActiveCity(earthquakes),
                totalCount: earthquakes.length
            };

            res.render('earthquakes', {
                earthquakes,
                stats,
                filters: {
                    magnitude: magnitude || '',
                    city: city || '',
                    date: date || ''
                },
                active: req.active,
                additionalHead: `
                    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
                    <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
                `
            });
        } catch (error) {
            console.error('Hata:', error);
            res.status(500).render('error', { 
                message: 'Deprem verileri yüklenirken bir hata oluştu' 
            });
        }
    }
};

// Kandilli verilerini çeken fonksiyon
async function getEarthquakeData() {
    try {
        const response = await axios.get('http://www.koeri.boun.edu.tr/scripts/lst9.asp', {
            timeout: 10000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'tr,en-US;q=0.7,en;q=0.3',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1',
                'Cache-Control': 'no-cache' // Cache'i devre dışı bırak
            }
        });

        return parseKandilliData(response.data);
    } catch (error) {
        console.error('Kandilli veri çekme hatası:', error);
        throw error;
    }
}
// Kandilli verilerini parse eden fonksiyon 
function parseKandilliData(html) {
    try {
        const $ = cheerio.load(html);
        const preText = $('pre').text();
        const lines = preText.split('\n');

        // Türkçe karakter düzeltmeleri için helper fonksiyon
        function fixTurkishChars(text) {
            return text
                .replace(/Ý/g, 'İ')
                .replace(/Þ/g, 'Ş')
                .replace(/Ð/g, 'Ğ')
                .replace(/ý/g, 'ı')
                .replace(/þ/g, 'ş')
                .replace(/ð/g, 'ğ')
                .replace(/ü/g, 'ü')
                .replace(/Ü/g, 'Ü')
                .replace(/Ç/g, 'Ç')
                .replace(/ç/g, 'ç')
                .replace(/Ö/g, 'Ö')
                .replace(/ö/g, 'ö');
        }

        return lines.slice(6)
            .map(line => {
                const parts = line.trim().split(/\s+/);
                if (parts.length < 9) return null;

                try {
                    const [dateStr, timeStr, lat, lng, depth, , magnitude, ...locationParts] = parts;
                    let location = locationParts.join(' ');
                    location = fixTurkishChars(location);
                    
                    return {
                        date: new Date(`${dateStr} ${timeStr}`),
                        lat: parseFloat(lat),
                        lng: parseFloat(lng),
                        depth: parseFloat(depth),
                        magnitude: parseFloat(magnitude),
                        location: location,
                        city: location.split('-')[0].trim()
                    };
                } catch (e) {
                    console.error('Satır ayrıştırma hatası:', e);
                    return null;
                }
            })
            .filter(Boolean)
            .slice(0, 500);
    } catch (error) {
        console.error('Veri ayrıştırma hatası:', error);
        throw error;
    }
}

// En aktif şehri bulma fonksiyonu
function getMostActiveCity(earthquakes) {
    const cityCounts = {};
    earthquakes.forEach(eq => {
        const city = eq.location.split('-')[0].trim();
        cityCounts[city] = (cityCounts[city] || 0) + 1;
    });
    
    return Object.entries(cityCounts)
        .sort(([,a], [,b]) => b - a)[0]?.[0] || 'Bilinmiyor';
}

module.exports = earthquakeController; 