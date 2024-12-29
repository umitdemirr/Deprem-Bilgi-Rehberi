const mongoose = require('mongoose');
const Earthquake = require('../models/earthquake');
const SafeZone = require('../models/safeZone');
const InfoArticle = require('../models/infoArticle');
require('dotenv').config();

// Örnek deprem verileri
const earthquakes = [
    {
        date: new Date('2024-03-15T10:30:00'),
        location: {
            type: 'Point',
            coordinates: [29.0395, 40.1885]
        },
        magnitude: 4.2,
        depth: 7.5,
        city: 'İstanbul',
        district: 'Kartal',
        description: 'ISTANBUL-KARTAL'
    },
    {
        date: new Date('2024-03-14T15:45:00'),
        location: {
            type: 'Point',
            coordinates: [27.1428, 38.4192]
        },
        magnitude: 3.8,
        depth: 5.2,
        city: 'İzmir',
        district: 'Bornova',
        description: 'IZMIR-BORNOVA'
    },
    {
        date: new Date('2024-03-13T08:15:00'),
        location: {
            type: 'Point',
            coordinates: [32.8597, 39.9334]
        },
        magnitude: 3.5,
        depth: 6.8,
        city: 'Ankara',
        district: 'Çankaya',
        description: 'ANKARA-CANKAYA'
    }
];

// Örnek güvenli bölge verileri
const safeZones = [
    {
        name: 'Yıldız Parkı Toplanma Alanı',
        location: {
            type: 'Point',
            coordinates: [29.0214, 41.0492]
        },
        address: 'Yıldız Mah. Beşiktaş/İstanbul',
        capacity: 5000,
        type: 'park',
        facilities: ['tuvalet', 'su', 'elektrik', 'ilk yardım'],
        contactInfo: {
            phone: '0212 XXX XX XX',
            email: 'yildiz@example.com'
        }
    },
    {
        name: 'Kültürpark Toplanma Alanı',
        location: {
            type: 'Point',
            coordinates: [27.1428, 38.4192]
        },
        address: 'Kültürpark, Konak/İzmir',
        capacity: 10000,
        type: 'park',
        facilities: ['tuvalet', 'su', 'elektrik', 'ilk yardım', 'çadır alanı'],
        contactInfo: {
            phone: '0232 XXX XX XX',
            email: 'kulturpark@example.com'
        }
    }
];

// Örnek bilgi makaleleri
const articles = [
    {
        title: 'Deprem Çantası Nasıl Hazırlanır?',
        content: `
            <h2>Deprem Çantasında Bulunması Gerekenler</h2>
            <ul>
                <li>Su ve uzun ömürlü gıdalar</li>
                <li>İlk yardım malzemeleri</li>
                <li>El feneri ve yedek piller</li>
                <li>Önemli evrakların kopyaları</li>
                <li>Şarj aleti ve powerbank</li>
            </ul>
            <p>Detaylı bilgi için makalenin devamını okuyun...</p>
        `,
        category: 'önce',
        author: 'AFAD Uzmanı',
        tags: ['deprem çantası', 'hazırlık', 'güvenlik']
    },
    {
        title: 'Deprem Anında Yapılması Gerekenler',
        content: `
            <h2>Deprem Sırasında Güvende Kalın</h2>
            <ul>
                <li>Çök-Kapan-Tutun hareketini uygulayın</li>
                <li>Sağlam bir masa altına girin</li>
                <li>Pencerelerden uzak durun</li>
                <li>Asansör kullanmayın</li>
            </ul>
        `,
        category: 'sırası',
        author: 'Deprem Uzmanı',
        tags: ['deprem anı', 'güvenlik', 'hayatta kalma']
    },
    {
        title: 'Deprem Sonrası İlk 72 Saat',
        content: `
            <h2>Deprem Sonrası Kritik Saatler</h2>
            <ul>
                <li>Artçı sarsıntılara karşı dikkatli olun</li>
                <li>Binayı kontrol edin</li>
                <li>Yardım ekiplerini bekleyin</li>
                <li>İletişim kanallarını açık tutun</li>
            </ul>
        `,
        category: 'sonrası',
        author: 'AFAD Uzmanı',
        tags: ['deprem sonrası', 'güvenlik', 'ilk yardım']
    }
];

// Veritabanına kaydet
async function seedDatabase() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        
        // Mevcut verileri temizle
        await Earthquake.deleteMany({});
        await SafeZone.deleteMany({});
        await InfoArticle.deleteMany({});

        // Yeni verileri ekle
        await Earthquake.insertMany(earthquakes);
        await SafeZone.insertMany(safeZones);
        await InfoArticle.insertMany(articles);

        console.log('Örnek veriler başarıyla eklendi!');
        process.exit(0);
    } catch (error) {
        console.error('Veri eklenirken hata:', error);
        process.exit(1);
    }
}

seedDatabase(); 