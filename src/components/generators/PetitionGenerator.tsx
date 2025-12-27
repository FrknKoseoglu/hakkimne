"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  FileText, 
  Printer,
  Copy,
  AlertTriangle,
  Calendar,
  Building,
  User,
  Pencil,
  RotateCcw
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

type TemplateType = 
  | "STANDART"
  | "SAGLIK"
  | "YENI_IS"
  | "AILEVI"
  | "MEMUR"
  | "IK_YOK"
  | "SOZLESMELI_OGRETMEN"
  | "EVLILIK"
  | "MOBBING"
  | "ATAMA"
  | "FAZLA_MESAI"
  | "HAKLI_NEDEN"
  | "ALACAK";

interface FormData {
  name: string;
  tcNo: string;
  companyName: string;
  position: string;
  authorityName: string;
  startDate: string;
  endDate: string;
  address: string;
  phone: string;
}

const TEMPLATE_OPTIONS = [
  { value: "STANDART", label: "Standart İstifa" },
  { value: "SAGLIK", label: "Sağlık Sebebiyle İstifa" },
  { value: "YENI_IS", label: "Yeni İş Fırsatı Nedeniyle" },
  { value: "AILEVI", label: "Ailevi Nedenlerle İstifa" },
  { value: "MEMUR", label: "Memurluktan İstifa" },
  { value: "IK_YOK", label: "İK Departmanı Olmayan İşyeri" },
  { value: "SOZLESMELI_OGRETMEN", label: "Sözleşmeli Öğretmen İstifası" },
  { value: "EVLILIK", label: "Evlilik Nedeniyle İstifa" },
  { value: "MOBBING", label: "Mobbing Nedeniyle İstifa" },
  { value: "ATAMA", label: "Atama Nedeniyle İstifa" },
  { value: "FAZLA_MESAI", label: "Fazla Mesai Nedeniyle İstifa" },
  { value: "HAKLI_NEDEN", label: "Haklı Nedenle İstifa (Kıdem Tazminatlı)" },
  { value: "ALACAK", label: "İstifa + Alacak Talebi" },
];

function formatDate(dateStr: string): string {
  if (!dateStr) return "../../....";
  const date = new Date(dateStr);
  return date.toLocaleDateString("tr-TR", { 
    day: "2-digit", 
    month: "2-digit", 
    year: "numeric" 
  });
}

function getTodayDate(): string {
  return new Date().toISOString().split("T")[0];
}

function generateLetter(templateType: TemplateType, data: FormData): string {
  const name = data.name || "[AD SOYAD]";
  const companyName = data.companyName || "[ŞİRKET ÜNVANI]";
  const position = data.position || "[GÖREV]";
  const authorityName = data.authorityName || "[YETKİLİ ADI]";
  const startDate = formatDate(data.startDate);
  const endDate = formatDate(data.endDate);
  const today = formatDate(getTodayDate());

  switch (templateType) {
    case "STANDART":
      return `
${companyName} / İnsan Kaynakları Müdürlüğü'ne,

İşbu dilekçe ile ${startDate} tarihi itibariyle başlamış olduğum ${position} görevinden ${endDate} itibariyle ayrılmak istediğimi, istifa ettiğimi bildirmekteyim.

Sizlerle çalıştığımız zaman boyunca ekibinizin bir parçası olduğum için teşekkür ederim. Sunmuş olduğunuz fırsatlar için minnettarım. İstifa sürecimde sorumlu olduğum tüm görevleri tamamlamaya ve devretmeye hazırım. İstifamın kabulü ile ilgili gereğinin yapılmasını arz ederim.

Saygılarımla, ${today}

${name}
İmza: _______________
      `;

    case "SAGLIK":
      return `
Sayın ${authorityName} / ${companyName}

${endDate} tarihi itibariyle sağlık sorunlarım nedeniyle ${companyName}'ndaki ${position} görevimden sağlık sorunlarım nedeniyle istifa ettiğimi bildirmekteyim.

İyi dileklerimle, ${today}

${name}
İmza: _______________
      `;

    case "YENI_IS":
      return `
Sayın ${authorityName} / ${companyName}

${endDate} tarihi itibariyle, kariyerimde yeni bir fırsat yakaladığım için şirketinizdeki görevimden istifa ettiğimi bildiririm. Anlayışınız için teşekkür ederim.

İstifa ve yeni işe geçiş sürecinde sorumluluklarımı tamamlamaya ve devretmeye hazırım.

Saygılarımla, ${today}

${name}
İmza: _______________
      `;

    case "AILEVI":
      return `
Sayın ${authorityName} / ${companyName}

Ailevi nedenlerden dolayı ${endDate} tarihi itibariyle işyerindeki görevimden istifa ettiğimi üzülerek bildirmekteyim. Anlayışınız için teşekkür ederim.

Görev sorumluluklarımı sorunsuz şekilde yerine getireceğim. Tekrar yollarımızın kesişmesi umuduyla.

Saygılarımla, ${today}

${name}
İmza: _______________
      `;

    case "MEMUR":
      return `
Kurum Yetkilisi ${authorityName},

657 sayılı Devlet Memurları Kanunu'nun ilgili maddeleri gereğince, ${endDate} itibariyle ${companyName} kurumu bünyesindeki görevimden istifa etmek istediğimi bildiririm.

İstifa sürecimin sorunsuz bir şekilde tamamlanabilmesi için sorumluluklarımı en kısa sürede devretmeye hazırım. Anlayışınız ve destekleriniz için teşekkür ederim.

Saygılarımla, ${today}

${name}
İmza: _______________
      `;

    case "IK_YOK":
      return `
Sayın ${authorityName},

İşbu dilekçe ile ${endDate} tarihi itibarıyla yürütmekte olduğum görevimden istifa ettiğimi bildirmekteyim. Çalıştığım süre boyunca edindiğim deneyimler ve fırsatlar için teşekkür ederim. Bu kararımı anladığınız ve desteklediğiniz için şimdiden teşekkür ederim.

Saygılarımla, ${today}

${name}
İmza: _______________
      `;

    case "SOZLESMELI_OGRETMEN":
      return `
Sayın ${authorityName},

${endDate} tarihi itibarıyla, ${companyName}'nda yürütmekte olduğum sözleşmeli öğretmenlik görevimden istifa etmek istediğimi bildiririm. Kişisel nedenlerle bu kararı aldım.

Görev yaptığım süre boyunca, öğrencilerle ve meslektaşlarımla çalıştığım için çok memnunum. Tarafıma sağladığınız destek ve eğitime katkıda bulunma fırsatı bulduğum için teşekkür ederim.

İstifa sürecimin sorunsuz geçmesi için sorumluluklarımı tamamlamaya ve devretmeye hazırım. Öğrencilerimizin eğitim sürecinin aksamaması için gereken her türlü sorumluluğu alacağım.

Anlayışınız ve desteğiniz için teşekkür ederim. İlerde yollarımızın tekrar kesişmesi umuduyla.

Saygılarımla, ${today}

${name}
İmza: _______________
      `;

    case "EVLILIK":
      return `
Sayın ${authorityName} / ${companyName}

Şirketinizde ${position} görevinde çalışmaktayım. Evlilik nedeniyle, 4857 sayılı İş Kanunu'nun 24. maddesi gereğince istifa etmek zorunda olduğumu bildiririm.

Evlilik nedeniyle iş akdimi feshetme hakkımı kullanarak, ${endDate} tarihinden itibaren işimden ayrılmak istediğimi bildirerek işten ayrılma sürecimi başlatmanızı rica ederim.

Anlayışınız ve desteğiniz için teşekkür ederim. İlerde yollarımızın tekrar kesişmesi umuduyla.

Saygılarımla, ${today}

${name}
İmza: _______________
      `;

    case "MOBBING":
      return `
Sayın ${authorityName} / ${companyName}

Şirketinizde çalışmakta olduğum ${position} görevimden yaşadığım mobbing (psikolojik baskı) nedeniyle istifa etmek zorunda kaldığımı üzülerek bildirmekteyim.

Çalışma sürecim boyunca karşılaştığım mobbing olayları, iş yerinde huzurlu ve verimli bir şekilde çalışmamı engellemektedir. Bu olaylar hem fiziksel hem de psikolojik sağlığımı etkilemiştir. Bu hususta yaşadığım sıkıntıları defalarca yetkililere iletmeme rağmen, herhangi bir çözüm sağlanmamıştır.

Bu nedenle, ${endDate} tarihinden itibaren, şirketinizdeki görevimden istifa ettiğimi bildirir, teşekkür ederim.

Saygılarımla, ${today}

${name}
İmza: _______________
      `;

    case "ATAMA":
      return `
Sayın ${authorityName},

${companyName} bünyesinde ${position} görevinde çalışmaktayım. Ancak atamam gerçekleştiği için mevcut görevimden ayrılmak istediğimi bildirmekteyim.

${endDate} tarihi itibariyle görevimden istifa etmek istediğimi bildirir, gerekli işlemlerin başlatılmasını arz ederim. Anlayışınız ve desteğiniz için teşekkür ederim.

Saygılarımla, ${today}

${name}
İmza: _______________
      `;

    case "FAZLA_MESAI":
      return `
Sayın ${authorityName} / ${companyName}

Şirketiniz bünyesinde çalışmakta olduğum ${position} görevimden fazla mesai saatlerimin hayatımı olumsuz etkilemesi nedeniyle ayrılmak istediğimi bildirmekteyim. Fazla mesai saatleri, hem fiziksel hem de zihinsel sağlığımı olumsuz yönde etkilemektedir. Bu nedenle de iş performansım düşmüştür. Mesai saatlerinin belirli olduğu sağlıklı bir çalışma düzeni aramaktayım.

Görevimi ${endDate} tarihine kadar sürdüreceğim. İş ve sorumluluklarımı eksiksiz olarak devretmeye hazırım. Anlayış ve destek için şimdiden teşekkür ederim.

Saygılarımla, ${today}

${name}
İmza: _______________
      `;

    case "HAKLI_NEDEN":
      return `
Sayın ${authorityName} / ${companyName}

${companyName} bünyesinde ${position} görevinde çalışmaktayım. Yaşanan bazı olumsuzluklar ve iş şartlarının (iş sağlığı ve güvenliği, ücret, mobbing, fazla mesai gibi nedenler) uygun olmaması nedeniyle işyerindeki çalışma koşullarım ve hayatım olumsuz etkilenmektedir. 4857 sayılı İş Kanunu'nun 24. maddesi gereğince, haklı nedenle iş sözleşmemi feshetme hakkımı kullanarak istifa ediyorum.

Yaşadığım sorunlar ve haklı nedenler şunlardır:
• Ödenmeyen maaşlar
• Fazla mesai yaptırılması ve karşılığının ödenmemesi
• İşyerindeki mobbing ve kötü muamele

Yukarıda belirttiğim nedenlerle, iş akdimi derhal feshediyor ve yasal haklarım olan kıdem tazminatı, ihbar tazminatı ve diğer alacaklarımın tarafıma ödenmesini talep ediyorum.

Gereğini arz ederim.

Saygılarımla, ${today}

${name}
İmza: _______________
      `;

    case "ALACAK":
      return `
${companyName} / Muhasebe Departmanı Müdürlüğü'ne,

${startDate} tarihinden itibaren şirketinizde ${position} görevinde çalışmaktayım. Kişisel sebeplerden dolayı ${endDate} tarihinden itibaren işten ayrılmak istiyorum.

İş yerinden ayrılışım ile birlikte tarafıma ödenmesi gereken tüm sosyal hak ve güvencelerimin ödenmesi için gereğini arz ederim.

Saygılarımla, ${today}

${name}
İmza: _______________
      `;

    default:
      return "";
  }
}

export function PetitionGenerator() {
  const [templateType, setTemplateType] = useState<TemplateType>("STANDART");
  const [formData, setFormData] = useState<FormData>({
    name: "",
    tcNo: "",
    companyName: "",
    position: "",
    authorityName: "",
    startDate: "",
    endDate: getTodayDate(),
    address: "",
    phone: "",
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [customText, setCustomText] = useState("");
  const previewRef = useRef<HTMLDivElement>(null);

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Reset custom text when form changes (unless in edit mode)
    if (!isEditMode) {
      setCustomText("");
    }
  };

  const generatedLetter = generateLetter(templateType, formData);
  // Use custom text if in edit mode and has content, otherwise use generated
  const letterContent = isEditMode && customText ? customText : generatedLetter;

  const handleEnableEdit = () => {
    setCustomText(generatedLetter);
    setIsEditMode(true);
  };

  const handleResetToTemplate = () => {
    setCustomText("");
    setIsEditMode(false);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(letterContent.trim());
      toast.success("Dilekçe panoya kopyalandı!");
    } catch {
      toast.error("Kopyalama başarısız");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Check if template needs authority name
  const needsAuthorityName = !["STANDART", "ALACAK"].includes(templateType);
  // Check if template needs position
  const needsPosition = ["STANDART", "SAGLIK", "EVLILIK", "MOBBING", "ATAMA", "FAZLA_MESAI", "HAKLI_NEDEN", "ALACAK"].includes(templateType);

  return (
    <div className="space-y-6">
      {/* Legal Disclaimer */}
      <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 print:hidden">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-sm text-amber-800 dark:text-amber-200">
          Bu araç sadece taslak oluşturma amaçlıdır ve hukuki tavsiye niteliği taşımaz. 
          İmzalayıp teslim etmeden önce bir <strong>iş hukuku uzmanına</strong> danışmanız önerilir.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Form */}
        <Card className="border-[var(--border-light)] shadow-lg print:hidden">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl text-[var(--text-main)]">
              <FileText className="w-6 h-6 text-[var(--primary)]" />
              Dilekçe Bilgileri
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Template Type */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-[var(--text-main)]">
                Dilekçe Türü
              </Label>
              <Select 
                value={templateType} 
                onValueChange={(v) => setTemplateType(v as TemplateType)}
              >
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TEMPLATE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Company Name */}
            <div className="space-y-2">
              <Label htmlFor="companyName" className="text-sm font-medium text-[var(--text-main)] flex items-center gap-1.5">
                <Building className="w-4 h-4" />
                Şirket / Kurum Adı
              </Label>
              <Input
                id="companyName"
                placeholder="ABC Teknoloji A.Ş."
                value={formData.companyName}
                onChange={(e) => handleChange("companyName", e.target.value)}
                className="h-10"
              />
            </div>

            {/* Authority Name (conditional) */}
            {needsAuthorityName && (
              <div className="space-y-2">
                <Label htmlFor="authorityName" className="text-sm font-medium text-[var(--text-main)]">
                  Yetkili Adı <span className="text-[var(--text-muted)]">(Opsiyonel)</span>
                </Label>
                <Input
                  id="authorityName"
                  placeholder="Ahmet Bey / Personel Müdürü"
                  value={formData.authorityName}
                  onChange={(e) => handleChange("authorityName", e.target.value)}
                  className="h-10"
                />
              </div>
            )}

            {/* Position (conditional) */}
            {needsPosition && (
              <div className="space-y-2">
                <Label htmlFor="position" className="text-sm font-medium text-[var(--text-main)]">
                  Göreviniz
                </Label>
                <Input
                  id="position"
                  placeholder="Yazılım Uzmanı"
                  value={formData.position}
                  onChange={(e) => handleChange("position", e.target.value)}
                  className="h-10"
                />
              </div>
            )}

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-[var(--text-main)] flex items-center gap-1.5">
                <User className="w-4 h-4" />
                Ad Soyad
              </Label>
              <Input
                id="name"
                placeholder="Ahmet Yılmaz"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="h-10"
              />
            </div>

            {/* Dates Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate" className="text-sm font-medium text-[var(--text-main)] flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  İşe Başlama
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleChange("startDate", e.target.value)}
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate" className="text-sm font-medium text-[var(--text-main)] flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  Ayrılış Tarihi
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleChange("endDate", e.target.value)}
                  className="h-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Column - Preview */}
        <div className="space-y-4">
          {/* Action Buttons */}
          <div className="flex gap-2 print:hidden">
            {!isEditMode ? (
              <Button
                onClick={handleEnableEdit}
                variant="outline"
                className="h-11 cursor-pointer"
              >
                <Pencil className="w-4 h-4 mr-2" />
                Düzenle
              </Button>
            ) : (
              <Button
                onClick={handleResetToTemplate}
                variant="outline"
                className="h-11 cursor-pointer text-amber-600 border-amber-300 hover:bg-amber-50"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Şablona Dön
              </Button>
            )}
            <Button
              onClick={handleCopy}
              variant="outline"
              className="flex-1 h-11 cursor-pointer"
            >
              <Copy className="w-4 h-4 mr-2" />
              Kopyala
            </Button>
            <Button
              onClick={handlePrint}
              className="flex-1 h-11 bg-[var(--primary)] hover:bg-blue-700 text-white cursor-pointer"
            >
              <Printer className="w-4 h-4 mr-2" />
              Yazdır / PDF
            </Button>
          </div>

          {/* Edit Mode Info */}
          {isEditMode && (
            <div className="text-xs text-amber-600 bg-amber-50 dark:bg-amber-950/30 p-2 rounded print:hidden">
              📝 Düzenleme modu aktif. Metni istediğiniz gibi değiştirebilirsiniz.
            </div>
          )}

          {/* A4 Preview / Edit Area */}
          <div 
            ref={previewRef}
            className="bg-white border border-gray-300 shadow-lg rounded-lg p-8 min-h-[500px] print:min-h-0 print:border-0 print:shadow-none print:p-0"
            id="petition-preview"
          >
            {isEditMode ? (
              <Textarea
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                className="w-full min-h-[450px] font-serif text-sm text-gray-800 leading-relaxed border-0 resize-none focus-visible:ring-0 print:hidden"
                placeholder="Dilekçe metnini buraya yazın..."
              />
            ) : (
              <pre className="whitespace-pre-wrap font-serif text-sm text-gray-800 leading-relaxed print:text-[12pt] print:font-['Times_New_Roman',serif]">
                {letterContent}
              </pre>
            )}
            {/* Print version always shows letterContent */}
            <pre className="hidden print:block whitespace-pre-wrap font-serif text-sm text-gray-800 leading-relaxed print:text-[12pt] print:font-['Times_New_Roman',serif]">
              {letterContent}
            </pre>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #petition-preview, #petition-preview * {
            visibility: visible;
          }
          #petition-preview {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 2cm;
            background: white;
          }
          nav, footer, .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
