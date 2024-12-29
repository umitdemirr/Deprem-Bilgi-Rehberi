// Global değişkenler
let map;
let markers = {
    locations: []
};

// İl-İlçe verileri
const cityData = {
    istanbul: ['Kadıköy', 'Beşiktaş', 'Üsküdar', 'Şişli'],
    ankara: ['Çankaya', 'Keçiören', 'Mamak', 'Yenimahalle'],
    izmir: ['Konak', 'Karşıyaka', 'Bornova', 'Buca']
};

// Filtreleme durumu
let filterState = {
    city: '',
    district: '',
    minCapacity: 0
};

// Marker oluşturma fonksiyonu
function createMarker(position, properties) {
    const marker = L.marker([position.lat, position.lng], {
        icon: L.divIcon({
            className: 'custom-div-icon',
            html: "<div class='marker-pin'></div>",
            iconSize: [30, 42],
            iconAnchor: [15, 42],
            popupAnchor: [0, -45]
        })
    });
    
    const popupContent = `
        <div class="safe-zone-popup">
            <h5 class="popup-title">${properties.title}</h5>
            <div class="popup-content">
                <div class="info-row">
                    <i class="fas fa-city"></i>
                    <span>${properties.city}</span>
                </div>
                <div class="info-row">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${properties.district}</span>
                </div>
                <div class="info-row">
                    <i class="fas fa-users"></i>
                    <span>Kapasite: ${properties.capacity}</span>
                </div>
            </div>
        </div>
    `;

    marker.bindPopup(popupContent, {
        maxWidth: 300,
        className: 'custom-popup'
    });
    
    markers.locations.push({
        marker: marker,
        properties: properties
    });
    
    return marker;
}

// Filtreleme fonksiyonu
function applyFilters() {
    markers.locations.forEach(location => {
        const props = location.properties;
        const marker = location.marker;
        
        const cityMatch = !filterState.city || props.city.toLowerCase() === filterState.city;
        const districtMatch = !filterState.district || props.district.toLowerCase() === filterState.district;
        const capacityMatch = props.capacity >= filterState.minCapacity;
        
        if (cityMatch && districtMatch && capacityMatch) {
            if (!map.hasLayer(marker)) {
                marker.addTo(map);
            }
        } else {
            if (map.hasLayer(marker)) {
                map.removeLayer(marker);
            }
        }
    });
}

// Event Listener'ları ekle
document.addEventListener('DOMContentLoaded', function() {
    // Filtreleme işlemleri
    const citySelect = document.getElementById('city-filter');
    const districtSelect = document.getElementById('district-filter');
    const capacityFilter = document.getElementById('capacity-filter');
    const capacityValue = document.getElementById('capacity-value');

    if (citySelect && districtSelect && capacityFilter && capacityValue) {
        // Şehir seçimi değiştiğinde
        citySelect.addEventListener('change', function() {
            filterState.city = this.value;
            
            // İlçe listesini güncelle
            districtSelect.innerHTML = '<option value="">Tüm İlçeler</option>';
            
            if (this.value && cityData[this.value]) {
                cityData[this.value].forEach(district => {
                    const option = document.createElement('option');
                    option.value = district.toLowerCase();
                    option.textContent = district;
                    districtSelect.appendChild(option);
                });
            }
            
            applyFilters();
        });
        
        // İlçe seçimi değiştiğinde
        districtSelect.addEventListener('change', function() {
            filterState.district = this.value;
            applyFilters();
        });
        
        // Kapasite değeri değiştiğinde
        capacityFilter.addEventListener('input', function() {
            capacityValue.textContent = this.value;
            filterState.minCapacity = parseInt(this.value);
            applyFilters();
        });
    }
}); 