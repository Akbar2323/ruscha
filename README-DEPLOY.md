# RUSCHA — GitHub Pages'ga yuklash

## Muhim ikkita fayl (o'chirmang!)
- `CNAME` — ichida `privetrussian.uz` yozilgan. Bu fayl domenni saytga bog'lab turadi.
  Agar o'chirilsa, domen uzilib qoladi.
- `.nojekyll` — GitHub'ning Jekyll tizimini o'chiradi. Busiz ba'zi fayllar
  (`_` bilan boshlanadigan) e'tiborsiz qoldiriladi.

## Qadamlar

1. github.com ga kiring -> saytingiz repozitoriysini oching
   (ichida eski `index.html` turgan repo)
2. `Add file` -> `Upload files` tugmasini bosing
3. Kompyuterdagi `site` papkasini OCHING va ichidagi hamma narsani
   (fayllar + `assets`, `fonts`, `vendor` papkalari) brauzerga sudrab tashlang
4. Pastdagi izohga masalan `bundle yechildi` deb yozing
5. `Commit changes` bosing
6. 1-2 daqiqa kuting, so'ng privetrussian.uz ni oching

## Eski fayllarni tozalash
Yangi `index.html` eskisining ustiga yoziladi — alohida o'chirish shart emas.
Agar repoda eski keraksiz fayllar qolsa, keyinroq bittalab o'chirsangiz bo'ladi.
LEKIN `CNAME` faylini hech qachon o'chirmang.

## Yangilaganda
`sw.js` ichidagi `VERSION = 'ruscha-v1'` ni `ruscha-v2` ga o'zgartiring,
aks holda foydalanuvchilarda eski nusxa keshda qolib ketadi.
