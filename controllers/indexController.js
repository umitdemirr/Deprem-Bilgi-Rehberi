// Her route'da tema durumunu kontrol et
router.use((req, res, next) => {
    res.locals.theme = req.cookies.theme || 'light';
    next();
}); 

router.get('/bilgi-kosesi', (req, res) => {
    res.render('info', {
        active: 'bilgi-kosesi',
        title: 'Bilgi Köşesi'
    });
});