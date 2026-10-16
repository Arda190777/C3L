# Module 10 - Sprint 1 teslim notu

Repo: https://github.com/Arda190777/C3L

Branch: `feature/attendance-sprint-1`

Surum adayi: `module10-sprint1-v0.1.0-rc.2`

## Hazir olanlar

- JavaScript ile yoklama kaydi, kayit duzeltme, mazeret turleri ve filtreli gecmis.
- Bun native SQLite ile yerel kalici veri; ek paket yok.
- GitHub issue #1-#6, #8-#9 ve Sprint 1 milestone'u. #7 takim ici PR.
- #4 Arda190777'ye, #9 jaspreetgakhal1'e atandi. Gera/Nasir'in hesaplari bekleniyor.
- 25 modul testi ve 81 tum-repo testi basarili. 12 modulun tamami yukleniyor.
- Doldurulmus Design Sprint Input ve Release Note PDF'leri `submissions/` icinde.
- Doxygen ile uretilmis HTML tasarim ZIP'i, SRS taslagi ve gercek test ciktilari.

## Teslimden once ekip olarak tamamlanacaklar

1. Gera #1/#3'teki kodu, Nasir #2'deki gecmis/filtreleri incelesin. Kendi GitHub hesaplariyla
   gorev atamasi yapilabilmesi icin kullanici adlarini ekleyin.
2. Nasir, #8 kapsaminda testleri dogrulasin; ortak SRS belgesinde `srs-update.md` satirlarini mevcut resmi requirement ID'leriyle eslestirsin
   ve Sprint Iteration 1 olarak isaretleyin. Ortak SRS baglantisi verilmedigi icin bu adim yapilmadi.
3. Jaspreet, #9 kapsaminda kisa kullanim adimlarini ve ekrandan demo akisini kontrol etsin;
   PR'i gercekten incelesin. Onaydan sonra fork'un main branch'ine merge commit ile alin.
4. Arda, #4 kapsaminda iki PDF, repo/branch/tag ve teslim dosyalarini son kez kontrol etsin.
   Demo akisini birlikte deneyin. Gercek katkilarinizi aciklayabilin.
5. Gercek review/demo/retrospektif kanitlarini ekleyin; PDF'lerdeki bekleyen durumlari tamamlandikca
   guncelleyin. Okula yukleme bu calismada yapilmadi.
6. Son kod degisirse testleri yeniden calistirip yeni bir tag ve guncel release note hazirlayin.

Bu surum yerel bir prototip. Gercek ogrenci verisi kullanmayin: kullanici rolu ve ders kaydi
entegrasyonu #5'te bekliyor. Katilim puani, rapor ve istatistikler #6'da sonraki sprint kapsaminda.

Son teslim: 20 Ekim 2026, 23:59 America/Toronto.

## Bu bilgisayarda calistirma

Repo klasorunde Bun PATH'e ekli degilse:

```powershell
& '..\.tools\bun\bun-windows-x64\bun.exe' run dev
```

Sonra `http://localhost:3000/10-attendance` adresini acin. Bun normal kuruluysa `bun run dev` yeterli.

## Kodun kisa aciklamasi

- `index.js`: modulu ortak uygulamaya tanitir.
- `router.js`: adresleri ve istek/yanit akislarini tanimlar.
- `attendance.js`: tarih, ID, durum ve not kurallarini kontrol eder.
- `store.js`: SQLite'a kaydeder; ayni ders/ogrenci/tarih varsa gunceller.
- `pages.js`: formu ve gecmis tablosunu HTML olarak olusturur.

Gecmis sorgusu hazirlanmis SQL parametreleri kullanir. HTML'e yazilan degerler escape edilir.
Testler bellekte veya gecici dosyada calisir; demo veritabanina test kaydi yazmaz.
