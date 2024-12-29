// Şehir arama önerileri için
window.cities = []; // Tüm benzersiz şehirleri tutacak array
window.map = null; // Global map değişkeni
window.safeZoneMap = null; // Güvenli bölgeler haritası için
let earthquakeMarkers = [];  // Deprem işaretleyicilerini tutacak array

// Harita stilleri
const mapStyles = {
    light: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'
};

// Harita başlatma fonksiyonu
function initMap() {
    const mapElement = document.getElementById('mainMap');
    if (!mapElement || window.map) return;

    try {
        const turkeyCenter = [39.0, 35.0];
        window.map = L.map('mainMap').setView(turkeyCenter, 6);
        
        // Mevcut temaya göre harita stilini belirle
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const style = currentTheme === 'dark' ? mapStyles.dark : mapStyles.light;
        
        L.tileLayer(style, {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
        }).addTo(window.map);

        console.log('Harita başlatıldı');

        if (typeof earthquakes !== 'undefined' && earthquakes.length > 0) {
            console.log(`${earthquakes.length} deprem noktası ekleniyor...`);
            // Depremleri haritaya ekle
            earthquakes.forEach(earthquake => {
                if (earthquake.lat && earthquake.lng) {
                    try {
                        // Deprem büyüklüğüne göre daire boyutu ve renk
                        const radius = Math.max(earthquake.magnitude * 4, 6);
                        const color = getMagnitudeColor(earthquake.magnitude);

                        // Daire marker oluştur
                        const marker = L.circleMarker([earthquake.lat, earthquake.lng], {
                            radius: radius,
                            fillColor: color,
                            color: '#000',
                            weight: 1,
                            opacity: 0.8,
                            fillOpacity: 0.6
                        });

                        // Popup içeriği
                        const popupContent = `
                            <div class="earthquake-popup">
                                <h6 class="mb-2">${earthquake.location}</h6>
                                <div class="popup-info">
                                    <span class="magnitude" style="color: ${color}">
                                        <strong>${earthquake.magnitude.toFixed(1)}</strong>
                                    </span>
                                    <span class="details">
                                        <i class="fas fa-arrows-alt-v"></i> ${earthquake.depth} km<br>
                                        <i class="far fa-clock"></i> ${new Date(earthquake.date).toLocaleString('tr-TR')}
                                    </span>
                                </div>
                            </div>
                        `;

                        marker.bindPopup(popupContent);

                        // Hover efektleri
                        marker.on('mouseover', function() {
                            this.setStyle({
                                fillOpacity: 0.9,
                                opacity: 1,
                                weight: 2
                            });
                            this.openPopup();
                        });

                        marker.on('mouseout', function() {
                            this.setStyle({
                                fillOpacity: 0.6,
                                opacity: 0.8,
                                weight: 1
                            });
                        });

                        // Tıklama olayı
                        marker.on('click', function() {
                            window.map.setView([earthquake.lat, earthquake.lng], 8);
                        });

                        marker.addTo(window.map);
                        earthquakeMarkers.push(marker);
                    } catch (err) {
                        console.error('Marker oluşturma hatası:', err);
                    }
                }
            });

            // Tüm depremleri kapsayan sınırları belirle
            if (earthquakeMarkers.length > 0) {
                const group = new L.featureGroup(earthquakeMarkers);
                window.map.fitBounds(group.getBounds().pad(0.1));
            }
        } else {
            console.warn('Deprem verisi bulunamadı veya boş');
        }
    } catch (error) {
        console.error('Harita başlatma hatası:', error);
    }
}

// Güvenli bölgeler haritası için başlatma fonksiyonu
function initSafeZoneMap() {
    const mapElement = document.getElementById('safeZoneMap');
    if (!mapElement || window.safeZoneMap) return;

    try {
        const turkeyCenter = [39.0, 35.0];
        window.safeZoneMap = L.map('safeZoneMap').setView(turkeyCenter, 6);
        
        // Mevcut temaya göre harita stilini belirle
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const style = currentTheme === 'dark' ? mapStyles.dark : mapStyles.light;
        
        L.tileLayer(style, {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
        }).addTo(window.safeZoneMap);

        // ... geri kalan harita kodu ...
    } catch (error) {
        console.error('Harita başlatma hatası:', error);
    }
}

// Haritayı temizle
function clearMarkers() {
    earthquakeMarkers.forEach(marker => {
        if (window.map && marker) {
            window.map.removeLayer(marker);
        }
    });
    earthquakeMarkers = [];
}

// Büyüklüğe göre renk belirleme
function getMagnitudeColor(magnitude) {
    if (magnitude >= 6) return '#dc3545'; // Kırmızı - Çok büyük
    if (magnitude >= 5) return '#fd7e14'; // Turuncu - Büyük
    if (magnitude >= 4) return '#ffc107'; // Sarı - Orta
    if (magnitude >= 3) return '#28a745'; // Yeşil - Küçük
    return '#17a2b8'; // Mavi - Çok küçük
}

// Harita kontrolü
function centerMap() {
    if (window.map) {
        window.map.setView([39.0, 35.0], 6);
    }
}

function toggleMapFullscreen() {
    const mapContainer = document.getElementById('mainMap');
    if (!document.fullscreenElement) {
        mapContainer.requestFullscreen().catch(err => {
            console.error('Tam ekran hatası:', err);
        });
    } else {
        document.exitFullscreen();
    }
}

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM yüklendi');
    
    // Harita elementi kontrolü
    const mapElement = document.getElementById('mainMap');
    console.log('Harita elementi:', mapElement);
    
    // Deprem verilerini kontrol et
    if (typeof earthquakes === 'undefined') {
        console.error('Deprem verileri yüklenemedi!');
        return;
    }
    
    console.log('Deprem verileri:', earthquakes);
    console.log('Toplam deprem sayısı:', earthquakes.length);
    
    if (earthquakes.length > 0) {
        console.log('Örnek deprem verisi:', earthquakes[0]);
    }

    // Haritayı başlat
    initMap();

    // Diğer event listener'lar...
});

// Sayfadan ayrılırken haritayı temizle
window.addEventListener('beforeunload', function() {
    if (window.map) {
        clearMarkers();
        window.map.remove();
        window.map = null;
    }
});

// Şehir önerileri için
function handleCityInput(e) {
    const input = e.target;
    const value = input.value.toLowerCase();
    
    let suggestionBox = document.getElementById('citySuggestions');
    if (!suggestionBox) {
        suggestionBox = document.createElement('div');
        suggestionBox.id = 'citySuggestions';
        suggestionBox.className = 'suggestions-box';
        input.parentNode.appendChild(suggestionBox);
    }
    
    suggestionBox.innerHTML = '';
    
    if (value.length < 2) return;
    
    // Depremlerden benzersiz şehir listesi oluştur
    const cities = [...new Set(earthquakes.map(eq => 
        eq.location.split('-')[0].trim()
    ))];
    
    // Eşleşen şehirleri filtrele
    const matches = cities.filter(city => 
        city.toLowerCase().includes(value)
    );
    
    // Önerileri göster
    if (matches.length > 0) {
        suggestionBox.innerHTML = matches
            .map(city => `
                <div class="suggestion-item" onclick="selectCity('${city}')">
                    <i class="fas fa-city me-2"></i>${city}
                </div>
            `)
            .join('');
    }
}

// Şehir seçimi
function selectCity(city) {
    const input = document.querySelector('input[name="city"]');
    input.value = city;
    document.getElementById('citySuggestions').innerHTML = '';
    document.getElementById('filterForm').submit();
}

// Navbar scroll behavior
let lastScrollTop = 0;
const navbar = document.querySelector('.navbar');
const navbarHeight = navbar.offsetHeight;

window.addEventListener('scroll', () => {
    let currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    
    // Scroll yönünü belirle
    if (currentScroll > lastScrollTop && currentScroll > navbarHeight) {
        // Aşağı scroll
        navbar.style.transform = 'translateY(-100%)';
    } else {
        // Yukarı scroll
        navbar.style.transform = 'translateY(0)';
    }
    
    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
}, { passive: true });

// Tema değişikliğini dinle ve haritayı güncelle
function updateMapStyle(theme) {
    const style = theme === 'dark' ? mapStyles.dark : mapStyles.light;
    
    // Ana harita için
    if (window.map) {
        window.map.eachLayer((layer) => {
            if (layer instanceof L.TileLayer) {
                window.map.removeLayer(layer);
            }
        });
        L.tileLayer(style, {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
        }).addTo(window.map);
    }

    // Güvenli bölgeler haritası için
    if (window.safeZoneMap) {
        window.safeZoneMap.eachLayer((layer) => {
            if (layer instanceof L.TileLayer) {
                window.safeZoneMap.removeLayer(layer);
            }
        });
        L.tileLayer(style, {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
        }).addTo(window.safeZoneMap);
    }
}

// Tema değişikliğini dinle
document.addEventListener('themeChanged', (e) => {
    updateMapStyle(e.detail.theme);
});

// Sayfa yüklendiğinde mevcut temayı kontrol et
document.addEventListener('DOMContentLoaded', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    updateMapStyle(currentTheme);
});
  