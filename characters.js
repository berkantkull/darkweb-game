window.GAME_CHARACTERS = [
  {
    id: "journalist", name: "Araştırmacı Gazeteci", icon: "◉", abilityName: "Açık Kaynak",
    abilityText: "Dengeli başlangıç. Hikâyeyi yayımlayan finallerde uzmandır.",
    intro: "Kaynaklarını korumayı bildiğini duydum. Bu gece doğruluğunu kanıtla.",
    endings: {
      publish: "Dosya ertesi sabah manşete çıktı; kayıp insanların isimleri artık susturulamazdı.",
      ghost: "ghost_17 yeni kaynağın oldu ve ikiniz gölgelerdeki dosyaları yayımlamaya devam ettiniz.",
      betray: "Sahte kaynağa güvendin; haberin ve mesleki itibarın aynı gece çöktü.",
      erase: "Hayatının en büyük haberini kendi ellerinle sildin; boş sayfa yıllarca peşini bırakmadı."
    }
  },
  {
    id: "detective", name: "Bağımsız Dedektif", icon: "⌕", abilityName: "Soğukkanlı",
    abilityText: "Dengeli başlangıç. Kararlarında ek bir ceza veya avantaj yoktur.",
    intro: "İz sürmekte iyi olduğunu söylediler. Bu dosya yıllardır kapanmıyor.",
    endings: {
      publish: "NIGHTFALL yıllardır kapanmayan bütün dosyaları birbirine bağladı ve şehir yeniden soruşturma başlattı.",
      ghost: "ghost_17 ile görünmeyen bir dedektif bürosu kurdun; ilk ortak dosyanız NIGHTFALL oldu.",
      betray: "Teslim ettiğin kanıt değiştirildi ve bütün şüpheler senin üzerine çevrildi.",
      erase: "Dosyayı kapattın ama vaka zihninde sonsuza dek açık kaldı."
    }
  },
  {
    id: "developer", name: "Meraklı Yazılımcı", icon: "⌘", abilityName: "Temiz Derleme",
    abilityText: "Dengeli başlangıç. Kod görevlerini doğrudan çözücüyle tamamlar.",
    intro: "Kodların arasındaki ayrıntıyı görebileceğini umuyorum.",
    endings: {
      publish: "Dosyayı birçok aynaya dağıttın; tek bir düğme artık gerçeği silemezdi.",
      ghost: "ghost_17 ile güvenli bir arşiv kurdun ve kayıp kayıtları tek tek geri getirdin.",
      betray: "ghost_17 hesabını kilitledi; ekranda yalnızca yanıp sönen bir imleç kaldı.",
      erase: "Son kopyayı da temizledin ve terminal sessizliğe gömüldü."
    }
  },
  {
    id: "historian", name: "Tarihçi Berkant", icon: "⌛", abilityName: "Eski Şifreler",
    abilityText: "İlk şifrede ek ipucu alır ve yanlış cevap cezası azalır.",
    intro: "Eski şehir kayıtlarını senden iyi okuyabilecek kimse yok, Berkant.",
    endings: {
      publish: "Berkant kayıp isimleri şehir tarihine yeniden yazdı; silinen geçmiş geri döndü.",
      ghost: "Berkant ve ghost_17 yasaklı arşivin yeni koruyucuları oldu.",
      betray: "Sahte belgeler gerçek kayıtların yerini aldı; Berkant tarihin yeniden yazılışını izledi.",
      erase: "Berkant arşivde boş bir sayfa bıraktı; NIGHTFALL yalnızca bir efsaneye dönüştü."
    }
  },
  {
    id: "hotelier", name: "Otelci Akın", icon: "◇", abilityName: "Gece Vardiyası",
    abilityText: "Oyuna iki dakika ek süreyle başlar.",
    intro: "Kayıp kişinin son görüldüğü otelin kayıtları sende, Akın.",
    endings: {
      publish: "Akın eski konuk defterlerini açtı; kayıp insanların son geceleri sonunda aydınlandı.",
      ghost: "Akın otelin kullanılmayan odasını gizli tanıklar için güvenli bir yere çevirdi.",
      betray: "Misafir kayıtların ağa sızdı ve otelin kapısına o gece kilit vuruldu.",
      erase: "Akın defteri kapattı; 317 numaralı oda bir daha hiç açılmadı."
    }
  },
  {
    id: "hacker", name: "Heçkır Süleyman", icon: "#", abilityName: "Gölge Modu",
    abilityText: "Kazandığı bütün iz puanları yarıya iner.",
    intro: "Bu sistemin açıklarını yalnız sen fark edebilirsin, Süleyman.",
    endings: {
      publish: "Süleyman dosyayı yüzlerce gölge sunucuya dağıttı; gerçek ağın her köşesinde belirdi.",
      ghost: "Süleyman ile ghost_17 sistemi içeriden söküp kayıp kayıtları kurtardı.",
      betray: "Tuzak bağlantı Süleyman’ın dijital kimliğini bütün ağa kazıdı.",
      erase: "Süleyman bütün izleri sildi; NIGHTFALL sanki hiç var olmamıştı."
    }
  },
  {
    id: "wholesaler", name: "Toptancı Mustafa", icon: "▦", abilityName: "Geniş Çevre",
    abilityText: "Oyuna %65 güven seviyesiyle başlar.",
    intro: "Şehre giren gizli sevkiyatların izini sen biliyorsun, Mustafa.",
    endings: {
      publish: "Mustafa haberi bağlantılarıyla bütün şehre dağıttı; gerçek bir gecede her dükkâna ulaştı.",
      ghost: "Mustafa gizli sevkiyat ağını kayıp insanları koruyan bir hatta dönüştürdü.",
      betray: "Bağlantı listen ele geçirildi; güvendiğin herkes aynı anda sustu.",
      erase: "Mustafa bütün kopyaları topladı ve son paketi kendi elleriyle yaktı."
    }
  },
  {
    id: "bartender", name: "Barmen Ata", icon: "♢", abilityName: "Son Çağrı",
    abilityText: "İlk yakalanışında güvenliğe bir içki ısmarlar; iz %70’e düşer.",
    intro: "Bu ağda herkes konuşur. Doğru içkiyi doğru kişiye vermeyi biliyorsan tabii, Ata.",
    endings: {
      publish: "Ata dosyayı barın ekranında açtı; sabaha kadar herkes aynı gerçeği konuştu.",
      ghost: "Ata gece yarısı ghost_17 ile buluştu; yeni sırları dinlemek için bir sandalye hep boş kaldı.",
      betray: "Son içki ghost_17’dendi; Ata uyandığında dosya da kasa da boştu.",
      erase: "Ata dosyayı sildi ve bardağı tezgâha bıraktı: ‘Bazı sırlar içeride kalır.’"
    }
  },
  {
    id: "geographer", name: "Coğrafyacı Ömer", icon: "⌖", abilityName: "Kestirme Rota",
    abilityText: "Kayıp Kayıt görevindeki ilk yanlış rota seçimi cezasızdır.",
    intro: "Ağ düğümleri de şehirler gibidir, Ömer. Doğru rotayı bulan kaybolmaz.",
    endings: {
      publish: "Ömer bütün kayıp noktaları tek haritada birleştirdi; şehir gerçeğin rotasını gördü.",
      ghost: "Ömer ghost_17’ye görünmeyen yolları gösterdi ve ikisi kayıpların izini sürmeye devam etti.",
      betray: "Gönderdiğin konum tersine çevrildi; haritada hedef olarak işaretlenen kişi sen oldun.",
      erase: "Ömer son koordinatı da sildi; NIGHTFALL haritada bulunmayan bir yere dönüştü."
    }
  },
  {
    id: "activist", name: "Eylemci Alkım", icon: "✊", abilityName: "Dayanışma Ağı",
    abilityText: "Tamamladığı her görevden sonra iz seviyesi %5 azalır.",
    intro: "Tek başına iz bırakmak kolaydır, Alkım. Kalabalıkta ise herkes birbirinin gölgesidir.",
    endings: {
      publish: "Alkım dosyayı meydandaki kalabalığa ulaştırdı; NIGHTFALL binlerce kişinin ortak sesi oldu.",
      ghost: "Alkım ile ghost_17 gizli bir dayanışma ağı kurdu; kayıpların aileleri artık yalnız değildi.",
      betray: "Buluşma noktası tuzaktı; kalabalık dağıtıldı ve Alkım ağın yeni hedefi oldu.",
      erase: "Alkım dosyayı sildi ama meydandaki sessizliğin yükünü üzerinden hiç atamadı."
    }
  }
];
