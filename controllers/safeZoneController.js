const SafeZone = require('../models/SafeZone');
const safeZoneService = require('../services/safeZoneService');

const safeZoneController = {
    getSafeZones: async (req, res) => {
        try {
            // Aktif toplanma alanlarını getir
            const safeZones = await SafeZone.find({ status: 'active' });
            
            // Aktif toplanma alanı olan şehirleri getir
            const cities = await SafeZone.aggregate([
                { 
                    $match: { 
                        status: 'active',
                        city: { $exists: true, $ne: '' }
                    }
                },
                {
                    $group: {
                        _id: {
                            city: '$city',
                            type: {
                                $cond: {
                                    if: { $or: [{ $eq: ['$type', null] }, { $eq: ['$type', ''] }] },
                                    then: 'Diğer',
                                    else: '$type'
                                }
                            }
                        },
                        count: { $sum: 1 }
                    }
                },
                {
                    $group: {
                        _id: '$_id.city',
                        count: { $sum: '$count' },
                        types: {
                            $push: {
                                type: '$_id.type',
                                count: '$count'
                            }
                        }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        name: '$_id',
                        count: 1,
                        types: {
                            $filter: {
                                input: '$types',
                                as: 'type',
                                cond: { $ne: ['$$type.type', 'Diğer'] }
                            }
                        }
                    }
                },
                {
                    $sort: { name: 1 }
                }
            ]);

            // Debug için
            console.log('Şehir verileri:', JSON.stringify(cities, null, 2));

            // İstatistikleri hesapla
            const stats = {
                totalAreas: safeZones.length,
                totalCapacity: safeZones.reduce((sum, zone) => sum + (zone.capacity || 0), 0),
                cityCount: cities.length,
                activeAreas: safeZones.length,
                averageCapacity: Math.round(safeZones.reduce((sum, zone) => sum + (zone.capacity || 0), 0) / safeZones.length)
            };

            // Kapasite aralıkları için filtre seçenekleri
            const filterOptions = {
                capacityRanges: [
                    { label: '0-1000 kişi', min: 0, max: 1000 },
                    { label: '1000-5000 kişi', min: 1000, max: 5000 },
                    { label: '5000+ kişi', min: 5000, max: Infinity }
                ]
            };

            res.render('guvenli-bolge', {
                active: req.active,
                safeZones: JSON.stringify(safeZones),
                cities,
                stats,
                filterOptions
            });
        } catch (error) {
            console.error('Güvenli bölgeler getirilemedi:', error);
            res.status(500).render('error', { error });
        }
    },

    getDistrictsByCity: async (req, res) => {
        try {
            const { city } = req.params;
            
            // Seçilen şehirdeki aktif ilçeleri getir
            const districts = await SafeZone.aggregate([
                { 
                    $match: { 
                        city: city,
                        status: 'active',
                        district: { $exists: true, $ne: '' } // Boş olmayan ilçeleri filtrele
                    }
                },
                {
                    $group: {
                        _id: '$district',
                        count: { $sum: 1 },
                        totalCapacity: { $sum: '$capacity' }
                    }
                },
                { $sort: { _id: 1 } } // İlçeleri alfabetik sırala
            ]);

            res.json(districts.map(d => ({
                name: d._id,
                count: d.count,
                totalCapacity: d.totalCapacity
            })));
        } catch (error) {
            console.error('İlçeler getirilemedi:', error);
            res.status(500).json({ error: 'İlçeler yüklenirken bir hata oluştu' });
        }
    },

    updateSafeZones: async (req, res) => {
        try {
            await safeZoneService.fetchAllSafeZones();
            res.redirect('/guvenli-bolge');
        } catch (error) {
            res.status(500).render('error', {
                message: 'Veriler güncellenirken bir hata oluştu'
            });
        }
    },
};

module.exports = safeZoneController; 