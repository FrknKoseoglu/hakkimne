export interface SgkCode {
  code: string;
  title: string;
  slug: string;
  description: string;
  severancePay: boolean;    // Kıdem Tazminatı
  noticePay: boolean;       // İhbar Tazminatı
  unemploymentPay: boolean; // İşsizlik Maaşı
  whoTerminated: 'Employer' | 'Employee' | 'Mutual' | 'Other';
}

export const sgkCodes: SgkCode[] = [
  {
    code: "01",
    title: "Deneme süreli iş sözleşmesinin işverence feshi",
    slug: "kod-01-deneme-suresi-isveren-feshi",
    description: "Deneme süresi içinde işveren tarafından yapılan fesih. Tazminat hakkı doğmaz.",
    severancePay: false,
    noticePay: false,
    unemploymentPay: false,
    whoTerminated: "Employer"
  },
  {
    code: "02",
    title: "Deneme süreli iş sözleşmesinin işçi tarafından feshi",
    slug: "kod-02-deneme-suresi-isci-feshi",
    description: "Deneme süresi içerisinde veya sonunda sözleşme işçi tarafından sona erdirilmişse bu kod seçilecektir. Tazminat hakkı doğmaz.",
    severancePay: false,
    noticePay: false,
    unemploymentPay: false,
    whoTerminated: "Employee"
  },
  {
    code: "03",
    title: "Belirsiz süreli iş sözleşmesinin işçi tarafından feshi (İstifa)",
    slug: "kod-03-istifa",
    description: "İşçinin istifası. Kıdem ve işsizlik alamaz. İhbar süresine uymazsa işverene tazminat öder (*).",
    severancePay: false,
    noticePay: false, // (*) İşveren kazanır
    unemploymentPay: false,
    whoTerminated: "Employee"
  },
  {
    code: "04",
    title: "Belirsiz süreli iş sözleşmesinin işveren tarafından haklı sebep bildirilmeden feshi",
    slug: "kod-04-hakli-sebep-olmadan-fesih",
    description: "İşverenin sebepsiz çıkartması. İşçi tüm tazminatlarını ve işsizlik maaşını alır (**).",
    severancePay: true,
    noticePay: true,    // (**) İşçi kazanır
    unemploymentPay: true,
    whoTerminated: "Employer"
  },
  {
    code: "05",
    title: "Belirli süreli iş sözleşmesinin sona ermesi",
    slug: "kod-05-belirli-sureli-sozlesme-bitimi",
    description: "Sözleşme süresinin dolması. Yargıtay kararlarına ve yenilenme durumuna göre Kıdem Tazminatı hakkı doğabilir (+).",
    severancePay: true, // (+) Kaynakla eşitlendi
    noticePay: false,
    unemploymentPay: true,
    whoTerminated: "Other"
  },
  {
    code: "08",
    title: "Emeklilik (yaşlılık) veya toptan ödeme nedeniyle",
    slug: "kod-08-emeklilik",
    description: "Emeklilik nedeniyle ayrılma. Kıdem tazminatı ödenir.",
    severancePay: true,
    noticePay: false,
    unemploymentPay: false,
    whoTerminated: "Employee"
  },
  {
    code: "09",
    title: "Malulen emeklilik nedeniyle",
    slug: "kod-09-malulen-emeklilik",
    description: "Malulen emeklilik nedeniyle işçi, işten ayrılıyorsa bu kod seçilir. Kıdem tazminatı ödenir.",
    severancePay: true,
    noticePay: false,
    unemploymentPay: false,
    whoTerminated: "Employee"
  },
  {
    code: "10",
    title: "Ölüm",
    slug: "kod-10-olum",
    description: "İşçinin vefatı. Kıdem tazminatı yasal mirasçılara ödenir.",
    severancePay: true,
    noticePay: false,
    unemploymentPay: false,
    whoTerminated: "Other"
  },
  {
    code: "11",
    title: "İş kazası sonucu ölüm",
    slug: "kod-11-is-kazasi-olum",
    description: "İş kazası sonucu vefat. Kıdem tazminatı mirasçılara ödenir.",
    severancePay: true,
    noticePay: false,
    unemploymentPay: false,
    whoTerminated: "Other"
  },
  {
    code: "12",
    title: "Askerlik",
    slug: "kod-12-askerlik",
    description: "Askerlik nedeniyle ayrılma. Kıdem alınır. İşsizlik maaşı askerlik dönüşü alınabilir (***).",
    severancePay: true,
    noticePay: false,
    unemploymentPay: true, // (***) Askerlik sonrası
    whoTerminated: "Employee"
  },
  {
    code: "13",
    title: "Kadın işçinin evlenmesi",
    slug: "kod-13-kadin-isci-evlilik",
    description: "Kadın işçi evlendiği tarihten itibaren 1 yıl içinde ayrılırsa Kıdem tazminatı alır.",
    severancePay: true,
    noticePay: false,
    unemploymentPay: false,
    whoTerminated: "Employee"
  },
  {
    code: "14",
    title: "Emeklilik için yaş dışında diğer şartların tamamlanması",
    slug: "kod-14-yas-haric-emeklilik",
    description: "15 yıl 3600 gün vb. şartları tamamlayıp ayrılma. Kıdem tazminatı alınır.",
    severancePay: true,
    noticePay: false,
    unemploymentPay: false,
    whoTerminated: "Employee"
  },
  {
    code: "15",
    title: "Toplu işçi çıkarma",
    slug: "kod-15-toplu-isci-cikarma",
    description: "Toplu işten çıkarma. Tüm haklar ödenir (**).",
    severancePay: true,
    noticePay: true,    // (**) İşçi kazanır
    unemploymentPay: true,
    whoTerminated: "Employer"
  },
  {
    code: "16",
    title: "Sözleşme sona ermeden sigortalının aynı işverene ait diğer işyerine nakli",
    slug: "kod-16-isyeri-nakli",
    description: "Nakil işlemi. Haklar devredilir, o an ödeme yapılmaz.",
    severancePay: false,
    noticePay: false,
    unemploymentPay: false,
    whoTerminated: "Mutual"
  },
  {
    code: "17",
    title: "İşyerinin kapanması",
    slug: "kod-17-isyerinin-kapanmasi",
    description: "İşyerinin kapanması. Tüm haklar ödenir (**).",
    severancePay: true,
    noticePay: true,    // (**) İşçi kazanır
    unemploymentPay: true,
    whoTerminated: "Employer"
  },
  {
    code: "18",
    title: "İşin sona ermesi",
    slug: "kod-18-isin-sona-ermesi",
    description: "İşin bitmesi. Tüm haklar ödenir (**).",
    severancePay: true,
    noticePay: true,    // (**) İşçi kazanır
    unemploymentPay: true,
    whoTerminated: "Employer"
  },
  {
    code: "19",
    title: "Mevsim bitimi",
    slug: "kod-19-mevsim-bitimi",
    description: "Mevsimlik işlerde askıya alma. Çıkış sayılmaz, tazminat doğmaz.",
    severancePay: false,
    noticePay: false,
    unemploymentPay: false,
    whoTerminated: "Other"
  },
  {
    code: "20",
    title: "Kampanya bitimi",
    slug: "kod-20-kampanya-bitimi",
    description: "Kampanya bitimi ile askıya alma. Tazminat doğmaz.",
    severancePay: false,
    noticePay: false,
    unemploymentPay: false,
    whoTerminated: "Other"
  },
  {
    code: "21",
    title: "Statü değişikliği",
    slug: "kod-21-statu-degisikligi",
    description: "Örn: 4/a'dan 4/b'ye geçiş. Haklar devredilir.",
    severancePay: false,
    noticePay: false,
    unemploymentPay: false,
    whoTerminated: "Mutual"
  },
  {
    code: "22",
    title: "Diğer Nedenler",
    slug: "kod-22-diger-nedenler",
    description: "Diğer sebepler. Hak durumu belirsizdir, genelde ödenmez.",
    severancePay: false,
    noticePay: false,
    unemploymentPay: false,
    whoTerminated: "Other"
  },
  {
    code: "23",
    title: "İşçi Tarafından Zorunlu Nedenle Fesih",
    slug: "kod-23-isci-zorunlu-nedenle-fesih",
    description: "Zorlayıcı sebeplerle (hastalık, iş durması) işçinin feshi. Kıdem alır, işsizlik alır.",
    severancePay: true,
    noticePay: false,
    unemploymentPay: true,
    whoTerminated: "Employee"
  },
  {
    code: "24",
    title: "İşçi Tarafından Sağlık Nedeniyle Fesih",
    slug: "kod-24-isci-saglik-nedeniyle-fesih",
    description: "Sağlık nedeniyle işçinin feshi. Kıdem alır, işsizlik alır.",
    severancePay: true,
    noticePay: false,
    unemploymentPay: true,
    whoTerminated: "Employee"
  },
  {
    code: "25",
    title: "İşçi Tarafından İşverenin Ahlak ve İyi Niyet Kurallarına Aykırı Davranışı Nedeni İle Fesih",
    slug: "kod-25-isci-hakli-fesih-ahlak",
    description: "Mobbing, maaş ödememe vb. haklı fesih. Kıdem alır, işsizlik alır.",
    severancePay: true,
    noticePay: false,
    unemploymentPay: true,
    whoTerminated: "Employee"
  },
  {
    code: "26",
    title: "Disiplin Kurulu Kararı İle Fesih",
    slug: "kod-26-disiplin-kurulu",
    description: "Disiplin kurulu kararıyla atılma. Tazminat ödenmez.",
    severancePay: false,
    noticePay: false,
    unemploymentPay: false,
    whoTerminated: "Employer"
  },
  {
    code: "27",
    title: "İşveren Tarafından Zorunlu Nedenlerle ve Tutukluluk Nedeniyle Fesih",
    slug: "kod-27-isveren-zorunlu-neden-tutukluluk",
    description: "İşçinin tutuklanması vb. Kıdem ve işsizlik ödenir.",
    severancePay: true,
    noticePay: false,
    unemploymentPay: true,
    whoTerminated: "Employer"
  },
  {
    code: "28",
    title: "İşveren Tarafından Sağlık Nedeni İle Fesih",
    slug: "kod-28-isveren-saglik-nedeniyle-fesih",
    description: "İşçinin sağlığı nedeniyle işverenin feshi. Kıdem ve işsizlik ödenir.",
    severancePay: true,
    noticePay: true, // Tabloda genelde boş ama kanunen ihbar vardır. Kaynaklarda bazen (+) bazen boş.
    unemploymentPay: true,
    whoTerminated: "Employer"
  },
  {
    code: "29",
    title: "İşveren tarafından işçinin ahlak ve iyi niyet kurallarına aykırı davranışı nedeni ile fesih (KALDIRILDI)",
    slug: "kod-29-isveren-hakli-fesih-kaldirildi",
    description: "Bu kod KALDIRILMIŞTIR. Yerine 42-50 arası kodlar kullanılır. Tazminat ve İşsizlik Maaşı YOKTUR.",
    severancePay: false,
    noticePay: false,
    unemploymentPay: false,
    whoTerminated: "Employer"
  },
  {
    code: "30",
    title: "Vize Süresinin Bitimi",
    slug: "kod-30-vize-bitimi",
    description: "Vize bitimi. Askı halidir.",
    severancePay: false,
    noticePay: false,
    unemploymentPay: false,
    whoTerminated: "Other"
  },
  {
    code: "31",
    title: "Kendi İstek ve Kusuru Dışında Fesih",
    slug: "kod-31-kendi-istek-disi",
    description: "Borçlar Kanunu vb. kapsamında istek dışı fesih. Tüm haklar ödenir.",
    severancePay: true,
    noticePay: true,
    unemploymentPay: true,
    whoTerminated: "Employer"
  },
  {
    code: "32",
    title: "4046 Sayılı Kanuna Göre Özelleştirme Nedeni İle Fesih",
    slug: "kod-32-ozellestirme",
    description: "Özelleştirme sonucu çıkış. Haklar ödenir.",
    severancePay: true,
    noticePay: true,
    unemploymentPay: true,
    whoTerminated: "Employer"
  },
  {
    code: "33",
    title: "Gazeteci Tarafından Sözleşmenin Feshi",
    slug: "kod-33-gazeteci-feshi",
    description: "Gazetecinin feshi. Kıdem ve işsizlik alır.",
    severancePay: true,
    noticePay: false,
    unemploymentPay: true,
    whoTerminated: "Employee"
  },
  {
    code: "34",
    title: "İşyerinin Devri, Niteliğinin Değişmesi Nedeniyle Fesih",
    slug: "kod-34-isyeri-devri",
    description: "İşyeri devri veya nitelik değişimi. Tüm haklar ödenir.",
    severancePay: true,
    noticePay: true,
    unemploymentPay: true,
    whoTerminated: "Employer"
  },
  {
    code: "35",
    title: "6495 SK Nedeniyle Devlet Memurluğuna Geçiş",
    slug: "kod-35-memurluga-gecis",
    description: "Memurluğa geçiş. Kıdem ödenir.",
    severancePay: true,
    noticePay: false,
    unemploymentPay: false,
    whoTerminated: "Other"
  },
  {
    code: "36",
    title: "KHK İle İşyerinin Kapatılması",
    slug: "kod-36-khk-ile-kapatilma",
    description: "OHAL/KHK ile kapatılma. Tazminat ödenmez.",
    severancePay: false,
    noticePay: false,
    unemploymentPay: false,
    whoTerminated: "Other"
  },
  {
    code: "37",
    title: "KHK İle Kamu Görevinden Çıkarma",
    slug: "kod-37-khk-kamu-gorevinden-cikarma",
    description: "FETÖ/PYD nedeni ile kamu görevinden çıkarma. Tazminat yok.",
    severancePay: false,
    noticePay: false,
    unemploymentPay: false,
    whoTerminated: "Other"
  },
  {
    code: "38",
    title: "Doğum Nedeniyle İşten Ayrılma",
    slug: "kod-38-dogum-nedeniyle-ayrilma",
    description: "Doğum nedeniyle ayrılma. İstifa sayılır, tazminat ödenmez.",
    severancePay: false,
    noticePay: false,
    unemploymentPay: false,
    whoTerminated: "Employee"
  },
  {
    code: "39",
    title: "696 KHK İle Kamu İşçiliğine Geçiş",
    slug: "kod-39-kamu-isciligine-gecis",
    description: "Kamuya işçi olarak geçiş.",
    severancePay: false,
    noticePay: false,
    unemploymentPay: false,
    whoTerminated: "Other"
  },
  {
    code: "40",
    title: "696 KHK İle Kamu İşçiliğine Geçilmemesi Sebebiyle Çıkış",
    slug: "kod-40-kamu-isciligine-gecememe",
    description: "Kadroya alınmama durumu. Haklar ödenir.",
    severancePay: true,
    noticePay: true,
    unemploymentPay: true,
    whoTerminated: "Employer"
  },
  {
    code: "41",
    title: "Re’sen İşten Ayrılış Bildirgesi Düzenlenenler",
    slug: "kod-41-resen-cikis",
    description: "SGK tarafından otomatik yapılan çıkışlar.",
    severancePay: false,
    noticePay: false,
    unemploymentPay: false,
    whoTerminated: "Other"
  },
  // KOD 42-50: HAKLI FESİH (TAZMİNAT YOK)
  {
    code: "42",
    title: "İş Sözleşmesi Yapılırken Gerçeğe Aykırı Bilgi Vererek Yanıltma",
    slug: "kod-42-gercege-aykiri-bilgi",
    description: "Yalan beyan ile işe girme.",
    severancePay: false,
    noticePay: false,
    unemploymentPay: false,
    whoTerminated: "Employer"
  },
  {
    code: "43",
    title: "İşverene Şeref ve Namusuna Dokunacak Sözler Sarfetmek",
    slug: "kod-43-seref-namus-sozler",
    description: "İşverene hakaret veya asılsız ihbar.",
    severancePay: false,
    noticePay: false,
    unemploymentPay: false,
    whoTerminated: "Employer"
  },
  {
    code: "44",
    title: "Başka Bir İşçiye Cinsel Tacizde Bulunmak",
    slug: "kod-44-cinsel-taciz",
    description: "İşyerinde taciz suçu.",
    severancePay: false,
    noticePay: false,
    unemploymentPay: false,
    whoTerminated: "Employer"
  },
  {
    code: "45",
    title: "İşyerine Sarhoş veya Uyuşturucu Madde Alarak Gelmek",
    slug: "kod-45-sarhosluk-uyusturucu",
    description: "İşyerinde madde kullanımı.",
    severancePay: false,
    noticePay: false,
    unemploymentPay: false,
    whoTerminated: "Employer"
  },
  {
    code: "46",
    title: "Güveni Kötüye Kullanmak, Hırsızlık Yapmak",
    slug: "kod-46-hirsizlik-guveni-kotuye-kullanma",
    description: "Hırsızlık, işverenin güvenini sarsma.",
    severancePay: false,
    noticePay: false,
    unemploymentPay: false,
    whoTerminated: "Employer"
  },
  {
    code: "47",
    title: "İşyerinde Suç İşlemek",
    slug: "kod-47-suc-islemek",
    description: "7 günden fazla hapis cezası gerektiren suç işleme.",
    severancePay: false,
    noticePay: false,
    unemploymentPay: false,
    whoTerminated: "Employer"
  },
  {
    code: "48",
    title: "İşverenden İzinsiz Devamsızlık Yapmak",
    slug: "kod-48-devamsizlik",
    description: "Mazeretsiz devamsızlık.",
    severancePay: false,
    noticePay: false,
    unemploymentPay: false,
    whoTerminated: "Employer"
  },
  {
    code: "49",
    title: "Görevleri Yapmamakta Israr Etmek",
    slug: "kod-49-gorevi-yapmamak",
    description: "Hatırlatılmasına rağmen görevi yapmamak.",
    severancePay: false,
    noticePay: false,
    unemploymentPay: false,
    whoTerminated: "Employer"
  },
  {
    code: "50",
    title: "İş Güvenliğini Tehlikeye Düşürmek veya Mala Zarar Vermek",
    slug: "kod-50-is-guvenligi-zarar",
    description: "İş güvenliği ihlali veya mala zarar verme.",
    severancePay: false,
    noticePay: false,
    unemploymentPay: false,
    whoTerminated: "Employer"
  }
];