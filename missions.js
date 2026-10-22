window.GAME_MISSIONS = [
  {
    id: 1,
    title: "Gölgede Üç Adım",
    short: "Türk alfabesi şifresi",
    description: "İlk erişim anahtarını Türk alfabesinde üç adım geriye giderek çöz.",
    story: "<strong>ghost_17:</strong> NIGHTFALL girişinde tek bir not bırakılmış: ‘Anahtar gölgede üç adım geri yürür.’"
  },
  {
    id: 2,
    title: "Kırık Sinyal",
    short: "Binary ve Hex zinciri",
    description: "Binary sinyali çöz; çıkan sonuç ikinci çözücüyü açacak.",
    story: "<strong>ghost_17:</strong> Sinyal iki katmanlı. İlk cevap, ikinci katmanın kod türünü söylüyor."
  },
  {
    id: 3,
    title: "Kayıp Kayıt",
    short: "Doğru bağlantı kaydı",
    description: "Saat ve düğüm bilgisini eşleştirerek gerçek bağlantıyı bul.",
    story: "<strong>ghost_17:</strong> Aradığımız bağlantı tam <b>02:17</b>’de gerçekleşti. Çıkış düğümünün sonu <b>.44</b> idi."
  },
  {
    id: 4,
    title: "Kopuk Hat",
    short: "Üç kablo seviyesi",
    description: "Üç hattı sırayla onar. Kırmızı devrelerden uzak dur.",
    story: "<strong>SİSTEM:</strong> Arşiv bağlantısı fiziksel olarak kesilmiş. Üç devreyi yeniden bağlamadan kapı açılmayacak."
  },
  {
    id: 5,
    title: "Soğuk Arşiv",
    short: "Gerçek dosyayı seç",
    description: "Son güvenlik katmanında gerçek NIGHTFALL dosyasını sahtelerden ayır.",
    story: "<strong>ghost_17:</strong> Arşiv açıldı. Görev adıyla aynı veri dosyasını seç; çalıştırılabilir dosyalardan uzak dur."
  }
];

window.CABLE_LEVELS = [
  {
    start: [0, 2], end: [5, 3],
    blocks: ["1,1", "2,1", "3,1", "3,2", "1,4", "2,4", "4,4"]
  },
  {
    start: [0, 0], end: [5, 5],
    blocks: ["1,0", "1,1", "2,1", "3,1", "4,2", "4,3", "2,3", "2,4", "0,4", "4,5"]
  },
  {
    start: [5, 0], end: [0, 5],
    blocks: ["4,0", "4,1", "3,1", "2,2", "2,3", "4,3", "4,4", "1,3", "0,3", "1,5", "2,5"]
  }
];
