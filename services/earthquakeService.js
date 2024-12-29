const axios = require('axios');
const Earthquake = require('../models/earthquake');

const earthquakeService = {
    async fetchFromKandilli() {
        try {
            const response = await axios.get('http://www.koeri.boun.edu.tr/scripts/lst0.asp');
            const data = response.data;
            
            // Veriyi parse et
            const earthquakes = this.parseKandilliData(data);
            
            // Veritabanına kaydet
            await this.saveEarthquakes(earthquakes);
            
            return earthquakes;
        } catch (error) {
            console.error('Kandilli verisi çekilirken hata:', error);
            throw error;
        }
    },

    parseKandilliData(data) {
        const lines = data.split('\n');
        const earthquakes = [];
        
        // İlk 6 satırı atla (header bilgileri)
        for (let i = 6; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line) {
                const parts = line.split(/\s+/);
                if (parts.length >= 9) {
                    const earthquake = {
                        date: new Date(`${parts[0]} ${parts[1]}`),
                        location: {
                            type: 'Point',
                            coordinates: [
                                parseFloat(parts[2]), // longitude
                                parseFloat(parts[3])  // latitude
                            ]
                        },
                        depth: parseFloat(parts[4]),
                        magnitude: parseFloat(parts[6]),
                        city: parts[8],
                        district: parts[9] || '',
                        description: parts.slice(8).join(' ')
                    };
                    earthquakes.push(earthquake);
                }
            }
        }
        return earthquakes;
    },

    async saveEarthquakes(earthquakes) {
        for (const eq of earthquakes) {
            try {
                await Earthquake.findOneAndUpdate(
                    {
                        date: eq.date,
                        'location.coordinates': eq.location.coordinates
                    },
                    eq,
                    { upsert: true, new: true }
                );
            } catch (error) {
                console.error('Deprem kaydedilirken hata:', error);
            }
        }
    }
};

module.exports = earthquakeService; 