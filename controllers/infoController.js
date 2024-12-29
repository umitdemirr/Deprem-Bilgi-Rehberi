const InfoArticle = require('../models/infoArticle');

const infoController = {
    getInfo: async (req, res) => {
        try {
            const articles = await InfoArticle.find({ isActive: true })
                .sort({ category: 1, order: 1 });

            // Kategorilere göre makaleleri grupla
            const categorizedArticles = {
                önce: articles.filter(a => a.category === 'önce'),
                sırası: articles.filter(a => a.category === 'sırası'),
                sonrası: articles.filter(a => a.category === 'sonrası'),
                genel: articles.filter(a => a.category === 'genel')
            };

            res.render('info', {
                active: 'info',
                pageTitle: 'Bilgi Köşesi',
                articles: categorizedArticles
            });
        } catch (error) {
            console.error('Bilgi köşesi yüklenirken hata:', error);
            res.status(500).render('error', {
                message: 'Sayfa yüklenirken bir hata oluştu'
            });
        }
    },

    getArticleDetail: async (req, res) => {
        try {
            const article = await InfoArticle.findById(req.params.id);
            if (!article) {
                return res.status(404).render('error', {
                    message: 'Makale bulunamadı'
                });
            }

            // İlgili makaleleri getir
            const relatedArticles = await InfoArticle.find({
                category: article.category,
                _id: { $ne: article._id }
            }).limit(3);

            res.render('article-detail', {
                pageTitle: article.title,
                article,
                relatedArticles
            });
        } catch (error) {
            console.error('Makale detayı yüklenirken hata:', error);
            res.status(500).render('error', {
                message: 'Bir hata oluştu'
            });
        }
    },

    getInfoSection: async (req, res) => {
        try {
            const sectionId = req.params.sectionId;
            let content = '';
            let title = '';

            // Her bölüm için içerik tanımla
            switch(sectionId) {
                case 'deprem-cantasi':
                    title = 'Deprem Çantası Hazırlama';
                    content = `
                        <div class="info-content">
                            <h4>Deprem Çantasında Bulunması Gerekenler:</h4>
                            <ul class="checklist">
                                <li>Su (kişi başı 4 litre)</li>
                                <li>Kuru gıda ve konserve</li>
                                <li>El feneri ve yedek piller</li>
                                <li>İlk yardım malzemeleri</li>
                                <li>Önemli evrakların kopyaları</li>
                                <li>İlaçlar ve reçeteler</li>
                                <li>Hijyen malzemeleri</li>
                                <li>Şarj cihazı ve powerbank</li>
                                <li>Düdük</li>
                                <li>Yedek kıyafet</li>
                            </ul>
                        </div>
                    `;
                    break;
                case 'ev-guvenligi':
                    title = 'Ev Güvenliği';
                    content = `
                        <div class="info-content">
                            <h4>Ev Güvenliği İçin Yapılması Gerekenler:</h4>
                            <ul class="checklist">
                                <li>Dolap ve rafları duvara sabitleyin</li>
                                <li>Ağır eşyaları alt raflara yerleştirin</li>
                                <li>Acil çıkış planı hazırlayın</li>
                                <li>Gaz vanası ve elektrik şalterinin yerini öğrenin</li>
                                <li>Yangın söndürücü bulundurun</li>
                            </ul>
                        </div>
                    `;
                    break;
                case 'aile-plani':
                        title = 'Aile Afet Planı';
                        content = `
                            <div class="info-content">
                                <h4>Aile Afet Planı Nasıl Hazırlanır?</h4>
                                <p>Aile bireylerinin olası bir afet sırasında ve sonrasında nasıl hareket edeceğini planlamak hayati önem taşır. İşte bir aile afet planı hazırlarken dikkat edilmesi gereken adımlar:</p>
                                <ul class="checklist">
                                    <li><strong>Acil Durum İletişim Bilgileri:</strong> Tüm aile üyelerinin birbiriyle nasıl iletişim kuracağını belirleyin. Birincil ve ikincil iletişim yöntemlerini yazın.</li>
                                    <li><strong>Toplanma Noktaları:</strong> Afet sonrasında birincil ve alternatif toplanma yerlerini belirleyin (örneğin, mahalle parkı veya belirli bir bina).</li>
                                    <li><strong>Acil Durum Çantası:</strong> Her bireyin ulaşabileceği bir yerde deprem çantası bulundurun.</li>
                                    <li><strong>Riskli Alanların Tespiti:</strong> Evde veya çevrede tehlike yaratabilecek alanları belirleyin (örneğin, ağır mobilyalar, cam yüzeyler, gaz hatları).</li>
                                    <li><strong>Acil Durum Numaraları:</strong> İtfaiye, sağlık ekipleri, AFAD gibi kurumların telefon numaralarını tüm aile üyelerine öğretin.</li>
                                    <li><strong>Afet Tatbikatları:</strong> Ailenizle birlikte düzenli aralıklarla afet tatbikatları yapın. Çıkış yolları ve toplanma noktalarını gözden geçirin.</li>
                                    <li><strong>Çocuklar için Planlama:</strong> Çocukların afet sırasında ne yapmaları gerektiğini kolayca anlayacakları şekilde anlatın. Basit yönergeler verin.</li>
                                    <li><strong>Yaşlılar ve Evcil Hayvanlar:</strong> Evde yaşlı bireyler veya evcil hayvanlar varsa, onlar için özel önlemler alın.</li>
                                    <li><strong>Önemli Belgeler:</strong> Kimlik, tapu, sigorta belgeleri gibi önemli evrakların birer kopyasını çantada bulundurun.</li>
                                    <li><strong>Yakınların Haberdar Edilmesi:</strong> Ailenizin afet sonrası durumunu öğrenmek için yakın akrabalarınıza ulaşma planı yapın.</li>
                                </ul>
                            </div>
                        `;
                        break;

                case 'hayat-ucgeni':
                    title = 'Hayat Üçgeni Pozisyonu';
                    content = `
                        <div class="info-content">
                            <h4>Hayat Üçgeni Pozisyonu Nedir ve Nasıl Alınır?</h4>
                            <p>Deprem sırasında hayatınızı kurtarmak için doğru pozisyon almak hayati önem taşır. Hayat üçgeni pozisyonu, yıkılma riski olan alanlardan kaçınarak, koruma sağlayabilecek alanlarda doğru şekilde konumlanmaktır.</p>
                            <ul class="checklist">
                                <li><strong>Yere Çökün:</strong> Hızlıca yere çökerek dengenizi kaybetmekten kaçının.</li>
                                <li><strong>Başınızı Koruyun:</strong> Ellerinizi başınızın üstüne koyarak kendinizi koruyun. Mümkünse bir yastık veya sert bir malzeme kullanın.</li>
                                <li><strong>Güçlü Bir Nesneye Yanaşın:</strong> Masa, koltuk gibi yıkıldığında size boşluk sağlayabilecek eşyaların yanına siper alın.</li>
                                <li><strong>Hareketsiz Kalın:</strong> Deprem bitene kadar pozisyonunuzu bozmadan hareketsiz kalın.</li>
                            </ul>
                        </div>
                    `;
                     break;                
                case 'guvenli-yerler':
                    title = 'Güvenli Yerler';
                    content = `
                        <div class="info-content">
                            <h4>Deprem Sırasında Güvenli Yerler Nasıl Belirlenir?</h4>
                            <p>Deprem sırasında bulunduğunuz ortamda güvenli bir yer bulmak hayati önem taşır. İşte dikkat etmeniz gereken noktalar:</p>
                            <ul class="checklist">
                                <li><strong>Dayanıklı Mobilyaların Yanı:</strong> Masa, koltuk gibi devrilmeyen ve sizi koruyabilecek mobilyaların yanına geçin.</li>
                                <li><strong>Pencere ve Camlardan Uzak Durun:</strong> Cam kırılmalarından kaçınmak için pencere kenarlarından uzak durun.</li>
                                <li><strong>Kapı Eşiği:</strong> Eski binalarda dayanıklı kapı eşikleri güvenli olabilir, ancak modern yapılarda bu önerilmez.</li>
                                <li><strong>Kaçış Yolları:</strong> Eğer ortam güvenliyse, deprem sonrası kolayca çıkabileceğiniz bir alanın yakınında olun.</li>
                                <li><strong>Duvar Diplerinden Kaçının:</strong> Duvara sabitlenmemiş raf veya dolaplardan uzak durun.</li>
                            </ul>
                        </div>
                    `;
                    break;
                case 'yanlis-davranislar':
                    title = 'Deprem Sırasında Yapılmaması Gerekenler';
                    content = `
                        <div class="info-content">
                            <h4>Deprem Sırasında Yapılmaması Gereken Hatalar</h4>
                            <p>Deprem sırasında yapılan bazı hatalar hayati risk oluşturabilir. İşte kesinlikle yapmamanız gerekenler:</p>
                            <ul class="checklist">
                                <li><strong>Koşmayın:</strong> Panik halinde hareket etmek yaralanmalara neden olabilir.</li>
                                <li><strong>Merdiven veya Asansör Kullanmayın:</strong> Merdivenler ve asansörler deprem sırasında en riskli alanlardır.</li>
                                <li><strong>Pencere veya Balkona Çıkmayın:</strong> Düşme ve cam kırılmalarına maruz kalabilirsiniz.</li>
                                <li><strong>Dolap veya Raf Altında Durmayın:</strong> Üzerinize eşya devrilmesi riskine karşı bu alanlardan kaçının.</li>
                                <li><strong>Açık Alana Çıkmaya Çalışmayın:</strong> Deprem bitene kadar bulunduğunuz yerde güvenli bir pozisyon alın.</li>
                                <li><strong>Elektrik veya Gaz Tesisatına Dokunmayın:</strong> Kaçaklara neden olabilir ve yangın riski oluşturabilir.</li>
                            </ul>
                        </div>
                    `;
                    break;
                
                case 'ilk-yardim':
                    title = 'İlk Yardım';
                    content = `
                        <div class="info-content">
                            <h4>İlk Yardımda Dikkat Edilmesi Gerekenler:</h4>
                            <ul class="checklist">
                                <li>Yaralıyı güvenli bir alana taşımadan önce çevreyi kontrol edin.</li>
                                <li>Temel yaşam desteği uygulamalarını öğrenin ve gerekiyorsa hemen uygulayın.</li>
                                <li>Kanamalarda doğrudan baskı uygulayarak kanamayı durdurmaya çalışın.</li>
                                <li>Kırık veya çıkık durumunda hareket ettirmeden stabilize edin.</li>
                                <li>112 acil çağrı merkezini arayarak doğru bilgi aktarın.</li>
                                <li>İlk yardım çantasını her zaman kolayca ulaşılabilir bir yerde bulundurun.</li>
                            </ul>
                        </div>
                    `;
                    break;
                case 'tahliye':
                    title = 'Tahliye Prosedürleri';
                    content = `
                        <div class="info-content">
                            <h4>Tahliye Prosedürlerinde İzlenecek Adımlar:</h4>
                            <ul class="checklist">
                                <li>Tahliye planınızı önceden belirleyin ve aile bireyleriyle paylaşın.</li>
                                <li>Binadan çıkarken asansör yerine merdivenleri kullanın.</li>
                                <li>Çıkış yollarını açık ve erişilebilir tutun.</li>
                                <li>Önemli belgeleri ve temel ihtiyaçları yanınıza alın.</li>
                                <li>Belirlenen toplanma alanına hızla ve güvenli bir şekilde ulaşın.</li>
                                <li>Panik yapmadan diğer kişilere de yardım etmeye çalışın.</li>
                            </ul>
                        </div>
                    `;
                    break;
                case 'iletisim':
                    title = 'Acil İletişim';
                    content = `
                        <div class="info-content">
                            <h4>Acil Durumlarda İletişim Rehberi:</h4>
                            <ul class="checklist">
                                <li>Aile bireyleriyle bir acil iletişim planı oluşturun.</li>
                                <li>Her bireyin telefonunda acil durum numaralarını kaydedin.</li>
                                <li>WhatsApp gibi uygulamaları kullanarak veri tabanlı iletişim sağlayın.</li>
                                <li>Radyo ve diğer haber kaynaklarını düzenli olarak takip edin.</li>
                                <li>Toplanma alanına ulaşamıyorsanız bir mesaj bırakma yöntemi belirleyin.</li>
                                <li>Acil durum bilgilerini hızlıca paylaşabileceğiniz bir grup oluşturun.</li>
                            </ul>
                        </div>
                    `;
                    break; 
            }

            res.json({
                success: true,
                data: {
                    title,
                    content
                }
            });
        } catch (error) {
            console.error('Bölüm yüklenirken hata:', error);
            res.status(500).json({
                success: false,
                message: 'Bir hata oluştu'
            });
        }
    },
};

module.exports = infoController; 