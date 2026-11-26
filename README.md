# 📊 DAB Çalışma — Data Analytics for Business

İTÜ *Data Analytics for Business* (Dr. Mehmet Yasin Ulukuş) dersinin ilk 4 konusu için **etkileşimli çalışma sitesi**.
Türkçe anlatım, formüller, animasyonlu demolar, Python kodları ve mini quizler bir arada.

| # | Sayfa | İçerik |
|---|-------|--------|
| 1 | `1-overview.html` | Y = f(X) + ε, prediction/inference, supervised/unsupervised, train vs test MSE, bias–variance |
| 2 | `2-linear-regression.html` | Least squares, gradient descent, SE & t-test, RSE/R², çoklu regresyon, dummy, polinom |
| 3 | `3-naive-bayes-knn.html` | Koşullu olasılık, Bayes kuralı, optimal Bayes classifier, Naive Bayes, KNN |
| 4 | `4-logistic-regression.html` | Sigmoid, odds/logit, MLE, confusion matrix, eşik, ROC/AUC, multi-class |
| ⚡ | `cheatsheet.html` | Tüm formüller + sklearn kalıpları tek sayfada (yazdırılabilir) |

`notebooks/` klasöründe her konu için **çalıştırılmış** Jupyter notebook'ları var. Veriler kodun içinde üretiliyor, CSV gerekmez.
Colab'da açmak için: Colab → *File → Open notebook → GitHub* → bu reponun adresi.

## Yerelde açmak
Build adımı yok, saf HTML/CSS/JS. Klasörde:
```bash
python -m http.server 8000
# tarayıcıda http://localhost:8000
```

## GitHub'a yükleyip Vercel'de yayınlamak
1. GitHub'da yeni bir repo aç (ör. `dab-calisma`), **boş** bırak (README eklemeden).
2. Bu klasörde:
   ```bash
   git remote add origin https://github.com/<kullanici-adin>/dab-calisma.git
   git branch -M main
   git push -u origin main
   ```
   (Git kullanmak istemezsen GitHub'da *Add file → Upload files* ile klasörün içeriğini sürükle-bırak yapabilirsin.)
3. [vercel.com](https://vercel.com) → *Add New → Project* → GitHub reposunu seç → **Framework Preset: Other**, Build Command boş → *Deploy*.
4. Arkadaşlarını GitHub reposuna *Settings → Collaborators* üzerinden ekle. Herkesin `main`'e yaptığı push'u Vercel otomatik yayınlar.

## Katkı
- Yeni konu: `1-overview.html`'i kopyala, `assets/app.js` içindeki `PAGES` listesine ekle.
- Quiz sorusu eklemek: sayfadaki `<div class="quiz"><script type="application/json">[...]` dizisine `{"q":..., "o":[...], "a":doğruIndex, "e":açıklama}` ekle.
- Formüller KaTeX ile yazılıyor: satır içi `\( ... \)`, blok `$$ ... $$`.

> Ders slaytlarından hazırlanmış öğrenci çalışma notudur; resmi ders materyali değildir.
