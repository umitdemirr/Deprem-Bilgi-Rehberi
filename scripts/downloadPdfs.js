const fs = require('fs');
const https = require('https');
const path = require('path');

const pdfUrls = [
    {
        url: 'https://www.afad.gov.tr/.../AFAD_ADP.pdf',
        filename: 'afad-mudahale-plani.pdf'
    },
    {
        url: 'https://www.afad.gov.tr/.../Deprem_Rehberi.pdf',
        filename: 'deprem-rehberi.pdf'
    },
    // ... diğer PDF'ler
];

const downloadPdf = async (url, filename) => {
    const filePath = path.join(__dirname, '../public/docs', filename);
    const file = fs.createWriteStream(filePath);

    return new Promise((resolve, reject) => {
        https.get(url, response => {
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve();
            });
        }).on('error', err => {
            fs.unlink(filePath);
            reject(err);
        });
    });
};

// PDF'leri indir
(async () => {
    for (const pdf of pdfUrls) {
        try {
            await downloadPdf(pdf.url, pdf.filename);
            console.log(`${pdf.filename} başarıyla indirildi`);
        } catch (error) {
            console.error(`${pdf.filename} indirilemedi:`, error);
        }
    }
})(); 