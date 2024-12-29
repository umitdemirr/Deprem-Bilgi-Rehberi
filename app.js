const express = require('express');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const path = require('path');
require('dotenv').config();

const app = express();

// Handlebars konfigürasyonu
const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: '.handlebars',
    helpers: {
        eq: function (a, b) {
            return a === b;
        },
        formatDate: function (date) {
            return new Date(date).toLocaleString('tr-TR');
        },
        getMagnitudeClass: function (magnitude) {
            if (magnitude >= 6) return 'bg-danger';
            if (magnitude >= 5) return 'bg-warning text-dark';
            if (magnitude >= 4) return 'bg-info text-dark';
            return 'bg-success';
        },
        json: function(context) {
            return JSON.stringify(context, null, 0)
                .replace(/</g, '\\u003c')
                .replace(/>/g, '\\u003e')
                .replace(/&/g, '\\u0026')
                .replace(/\u2028/g, '\\u2028')
                .replace(/\u2029/g, '\\u2029');
        },
        formatNumber: function(number) {
            if (!number && number !== 0) return '0';
            return new Intl.NumberFormat('tr-TR').format(number);
        }
    },
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }
});

// Handlebars'ı yapılandır
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', './views');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Statik dosyaları servis et
app.use('/js', express.static(path.join(__dirname, 'public/js')));
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Routes
const indexRouter = require('./routes/index');
app.use('/', indexRouter);

// MongoDB bağlantısı
mongoose.connect(process.env.MONGODB_ATLAS_URI)
    .then(() => console.log('MongoDB\'ye başarıyla bağlanıldı'))
    .catch(err => console.error('MongoDB bağlantı hatası:', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Sunucu ${PORT} portunda çalışıyor`);
});

// Handlebars helpers
hbs.handlebars.registerHelper('eq', function(a, b) {
    return a === b;
});
  