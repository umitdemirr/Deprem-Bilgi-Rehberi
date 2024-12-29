// Tema durumunu localStorage'dan al veya varsayılan olarak light kullan
let currentTheme = localStorage.getItem('theme') || 'light';

// Sayfa yüklendiğinde mevcut temayı uygula
document.addEventListener('DOMContentLoaded', () => {
    applyTheme(currentTheme);
    updateThemeIcon(currentTheme);
});

// Tema değiştirme butonuna tıklandığında
document.getElementById('theme-toggle').addEventListener('click', () => {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', currentTheme);
    applyTheme(currentTheme);
    updateThemeIcon(currentTheme);
});

// Temayı uygula
function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme);
    
    // Tema değişikliği olayını tetikle
    document.dispatchEvent(new CustomEvent('themeChanged', {
        detail: { theme: theme }
    }));
}

// Tema ikonunu güncelle
function updateThemeIcon(theme) {
    const icon = document.querySelector('#theme-toggle i');
    if (theme === 'dark') {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
} 