export const SGK_EXIT_CODES = [
  { code: "01", title: "Deneme süreli iş sözleşmesinin işverence feshi", severance: false, notice: false, unemployment: false },
  { code: "02", title: "Deneme süreli iş sözleşmesinin işçi tarafından feshi", severance: false, notice: false, unemployment: false },
  { code: "03", title: "Belirsiz süreli iş sözleşmesinin işçi tarafından feshi (İstifa)", severance: false, notice: false, unemployment: false },
  { code: "04", title: "Belirsiz süreli iş sözleşmesinin işveren tarafından haklı sebep bildirilmeden feshi", severance: true, notice: true, unemployment: true },
  { code: "05", title: "Belirli süreli iş sözleşmesinin sona ermesi", severance: false, notice: false, unemployment: true },
  { code: "08", title: "Emeklilik (yaşlılık) veya toptan ödeme", severance: true, notice: false, unemployment: false },
  { code: "09", title: "Malulen emeklilik nedeniyle ayrılma", severance: true, notice: false, unemployment: false },
  { code: "10", title: "Ölüm", severance: true, notice: false, unemployment: false },
  { code: "11", title: "İş kazası sonucu ölüm", severance: true, notice: false, unemployment: false },
  { code: "12", title: "Askerlik", severance: true, notice: false, unemployment: true },
  { code: "13", title: "Kadın işçinin evlenmesi", severance: true, notice: false, unemployment: false },
  { code: "15", title: "Toplu işçi çıkarma", severance: true, notice: true, unemployment: true },
  { code: "17", title: "İşyerinin kapanması", severance: true, notice: true, unemployment: true },
  { code: "18", title: "İşin sona ermesi", severance: true, notice: true, unemployment: true },
  { code: "22", title: "Diğer nedenler", severance: false, notice: false, unemployment: false }, // Genelde verilmez ama duruma göre değişebilir
  { code: "23", title: "İşçi tarafından zorunlu nedenle fesih", severance: true, notice: false, unemployment: true },
  { code: "24", title: "İşçi tarafından sağlık nedeniyle fesih", severance: true, notice: false, unemployment: true },
  { code: "25", title: "İşçi tarafından işverenin ahlak ve iyi niyet kurallarına aykırı davranışı nedeniyle fesih", severance: true, notice: false, unemployment: true },
  { code: "26", title: "Disiplin Kurulu kararı ile fesih", severance: false, notice: false, unemployment: false }, // Genelde verilmez
  { code: "27", title: "İşveren tarafından iyi niyet ve ahlak kurallarına aykırılık (Kod 29 yerine geçen kodlardan)", severance: false, notice: false, unemployment: false },
  { code: "29", title: "İşveren tarafından işçinin ahlak ve iyi niyet kurallarına aykırı davranışı (Eski Kod 29)", severance: false, notice: false, unemployment: false },
  { code: "36", title: "KHK ile kamu görevinden çıkarma", severance: false, notice: false, unemployment: false },
];
