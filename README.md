# Bluff Labs

Werewolf Master ve Mafia Resistance için Türkçe tanıtım sitesi. HTML, CSS ve JavaScript ile çalışır; paket kurulumu veya derleme gerektirmez.

## Önizleme

ZIP'i açıp `index.html` dosyasını tarayıcıya sürükleyebilirsiniz; görseller ve rol açıklamaları yerel dosyalardan çalışır. Geliştirme sırasında bu klasörde `python -m http.server 4173 --directory dist` çalıştırıp `http://localhost:4173` adresini açabilirsiniz.

## İçerik

- Ana sayfa: `dist/index.html`
- Tasarım: `dist/site.css`
- Rol filtreleri, arama, açıklama pencereleri, oyun aşamaları ve görsel galerisi: `dist/site.js`
- 36 rolün uygulamadan alınan açıklamaları: `dist/roles.json`
- Türkçe ana sayfa: `dist/index.html`; İngilizce ana sayfa: `dist/en.html`. İngilizce rol açıklamaları uygulamanın `app_en.arb` kaynağından alınmıştır.
- Yeni Bluff Labs amblemi ve masa bannerı `source-assets` altında saklanır. Web kopyaları `dist/assets` altındadır.
- Alt bölümde Werewolf, Mafia Resistance ve Limitly korunur. Her uygulama için iki bağlantı bulunur: gizlilik ve kullanım koşulları. Kullanım koşullarında TR/EN seçimi vardır.
- Werewolf için 8 Ekim 2026 tarihinde Google Play'den kontrol edilen 10K+ indirme eşiği gösterilir. Mafia Resistance indirme sayısı ve ziyaretçiye yönelik kontrol notları gösterilmez.
- Werewolf: projedeki rol çizimleri, tipografi ve birlikte hazırlanmış altı market görseli.
- Mafia Resistance: Google Play'deki ilk üç market görselinin site için yerel ve sıkıştırılmış kopyaları.
- Hukuki sayfalar aynı adreslerde korunur. Ana hukuki dizin `dist/legal/index.html` adresindedir. Hukuki içerikler kaynak ZIP'ten alınmıştır; bu çalışmada hukuki doğruluk incelemesi yapılmamıştır.

## Güncelleme ve yükleme

`build_site.py`, Flutter kaynaklarından rol adlarını, açıklamaları ve çizimleri okuyup siteye aktarır. Pillow gerekir. Proje kökünde `python sites/bluff-labs/build_site.py` çalıştırın. CSS ve JS ayrı dosyalarda korunur.

`dist` içeriğini statik barındırma köküne yükleyin. ZIP paketinin kökünde `index.html` vardır. GitHub Pages, Netlify, Cloudflare Pages veya sıradan bir statik sunucu ile çalışır; sunucu tarafı veri tabanı yoktur.

## Kaynaklar

- https://play.google.com/store/apps/details?id=com.EnesSorucu.werewolf
- https://play.google.com/store/apps/details?id=com.enessorucu.MafiaResistance
- `lib/data/roles_data.dart`, `lib/l10n/app_tr.arb`, `assets/roles`, `assets/fonts`, `output/store-listing`
- `bluff-labs-legal-site.zip`

Oyun açıklamaları bu kaynaklara dayanır. Değerlendirme, yorum ve ücret bilgisi eklenmemiştir. Hukuki bağlantılar çevrimdışı kullanım için açık dosya adlarına dönüştürülmüştür. Gizlilik belgelerinin reklam paragrafı mevcut durumu belirten tek cümleye sadeleştirilmiştir: uygulama şu anda reklam göstermez.

Sites yayını için yapılan ilk kayıt isteği servis iç hatasıyla sonuçlandı. Site listesi boş döndü; yinelenen kayıt oluşturulmadı. Yerel çıktı ve ZIP bağımsız olarak kullanılabilir.
