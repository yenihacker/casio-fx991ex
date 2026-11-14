# CASIO fx-991EX ClassWiz Simülatörü

Tarayıcıda çalışan, gerçek fx-991EX ClassWiz'e birebir benzeyen bilimsel hesap makinesi simülatörü.

- 12 uygulama modu (Hesaplama, Karmaşık sayı, Base-N, Matris, Vektör, İstatistik, Dağılım, Tablo, Fonksiyon tablosu, Denklem, Eşitsizlik, Doğrulama)
- Doğal (2B) gösterim: kesir, kök, integral, türev, toplam
- SOLVE, CALC, 40 bilimsel sabit, 40 birim dönüşümü
- Bilgisayar klavyesi kısayolları (Enter, Esc, Backspace, ok tuşları…)

## Çalıştırma

Derleme adımı yok: `index.html` dosyasını tarayıcıda açmak yeterli.
Statik site olarak Vercel'de yayınlanır (framework: Other, build komutu yok).

## Dosyalar

| Dosya | İçerik |
| --- | --- |
| `index.html` | Hesap makinesinin gövdesi ve tuş takımı |
| `style.css` | Görünüm |
| `engine.js` | Hesap motoru (ifade çevirici, integral, denklem çözücü, dağılımlar…) |
| `ui.js` | Tuş işleyicileri, LCD çizimi, menüler |
