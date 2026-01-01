"use client";

import { useState, useMemo } from "react";
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
  Car,
  Calculator,
  Zap,
  CreditCard,
  Calendar,
  AlertCircle,
  CheckCircle,
  Banknote,
  Info,
  Clock,
  RotateCcw,
} from "lucide-react";
import {
  MTV_YEAR,
  getAgeLabel,
  getAgeIndex,
  getMatrahOptions,
  getEngineCategoryKey,
  CAR_PRE_2018_TARIFF,
  MOTORCYCLE_TARIFF,
  MINIBUS_TARIFF,
  PANELVAN_TARIFF,
  BUS_TARIFF,
  TRUCK_TARIFF,
  MTV_INSTALLMENTS,
  BANK_CAMPAIGNS,
  PAYMENT_CHANNELS,
  MTV_INFO,
} from "@/lib/mtv-data";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

type VehicleType = "otomobil" | "motosiklet" | "minibus" | "panelvan" | "otobus" | "kamyonet";

export function MtvCalculator() {
  const [vehicleType, setVehicleType] = useState<VehicleType>("otomobil");
  const [isElectric, setIsElectric] = useState(false);
  const [regDate, setRegDate] = useState<"pre2018" | "post2018">("post2018");
  const [engineCc, setEngineCc] = useState<string>("");
  const [matrahIndex, setMatrahIndex] = useState<string>("0");
  const [modelYear, setModelYear] = useState<string>(MTV_YEAR.toString());
  const [seats, setSeats] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  
  const [result, setResult] = useState<{
    yearlyTotal: number;
    installmentAmount: number;
    vehicleAge: number;
  } | null>(null);

  const modelYears = useMemo(() => {
    const years: number[] = [];
    for (let year = MTV_YEAR; year >= MTV_YEAR - 30; year--) {
      years.push(year);
    }
    return years;
  }, []);

  const vehicleAge = useMemo(() => {
    const year = parseInt(modelYear);
    return isNaN(year) ? 0 : MTV_YEAR - year + 1;
  }, [modelYear]);

  const matrahOptions = useMemo(() => {
    const cc = parseInt(engineCc) || 0;
    return getMatrahOptions(cc);
  }, [engineCc]);

  const handleCalculate = () => {
    let yearlyTotal = 0;
    const ageIdx = getAgeIndex(vehicleAge);

    if (vehicleType === "otomobil") {
      const cc = parseInt(engineCc) || 0;
      if (cc === 0) return;

      if (regDate === "post2018") {
        const mIdx = Math.min(parseInt(matrahIndex) || 0, matrahOptions.length - 1);
        yearlyTotal = matrahOptions[mIdx].rates[ageIdx];
      } else {
        const key = getEngineCategoryKey(cc);
        const tariff = CAR_PRE_2018_TARIFF[key as keyof typeof CAR_PRE_2018_TARIFF];
        yearlyTotal = tariff[ageIdx];
      }

      if (isElectric) {
        yearlyTotal = Math.floor(yearlyTotal * 0.25);
      }
    } else if (vehicleType === "motosiklet") {
      const cc = parseInt(engineCc) || 0;
      if (cc === 0) return;

      let key = "0-100";
      if (cc > 100 && cc <= 250) key = "101-250";
      else if (cc > 250 && cc <= 650) key = "251-650";
      else if (cc > 650 && cc <= 1200) key = "651-1200";
      else if (cc > 1200) key = "1201+";

      const tariff = MOTORCYCLE_TARIFF[key as keyof typeof MOTORCYCLE_TARIFF];
      const motoAgeIdx = vehicleAge <= 6 ? 0 : vehicleAge <= 15 ? 1 : 2;
      yearlyTotal = tariff[motoAgeIdx];
    } else if (vehicleType === "minibus") {
      const motoAgeIdx = vehicleAge <= 6 ? 0 : vehicleAge <= 15 ? 1 : 2;
      yearlyTotal = MINIBUS_TARIFF[motoAgeIdx];
    } else if (vehicleType === "panelvan") {
      const cc = parseInt(engineCc) || 0;
      if (cc === 0) return;

      const key = cc <= 1900 ? "0-1900" : "1901+";
      const tariff = PANELVAN_TARIFF[key];
      const motoAgeIdx = vehicleAge <= 6 ? 0 : vehicleAge <= 15 ? 1 : 2;
      yearlyTotal = tariff[motoAgeIdx];
    } else if (vehicleType === "otobus") {
      const s = parseInt(seats) || 0;
      if (s === 0) return;

      let key = "0-25";
      if (s > 25 && s <= 35) key = "26-35";
      else if (s > 35 && s <= 45) key = "36-45";
      else if (s > 45) key = "46+";

      const tariff = BUS_TARIFF[key as keyof typeof BUS_TARIFF];
      const motoAgeIdx = vehicleAge <= 6 ? 0 : vehicleAge <= 15 ? 1 : 2;
      yearlyTotal = tariff[motoAgeIdx];
    } else if (vehicleType === "kamyonet") {
      const w = parseInt(weight) || 0;
      if (w === 0) return;

      let key = "0-1500";
      if (w > 1500 && w <= 3500) key = "1501-3500";
      else if (w > 3500 && w <= 5000) key = "3501-5000";
      else if (w > 5000 && w <= 10000) key = "5001-10000";
      else if (w > 10000 && w <= 20000) key = "10001-20000";
      else if (w > 20000) key = "20001+";

      const tariff = TRUCK_TARIFF[key as keyof typeof TRUCK_TARIFF];
      const motoAgeIdx = vehicleAge <= 6 ? 0 : vehicleAge <= 15 ? 1 : 2;
      yearlyTotal = tariff[motoAgeIdx];
    }

    setResult({
      yearlyTotal,
      installmentAmount: yearlyTotal / 2,
      vehicleAge,
    });
  };

  const resetForm = () => {
    setEngineCc("");
    setMatrahIndex("0");
    setSeats("");
    setWeight("");
    setResult(null);
  };

  return (
    <div className="space-y-6">
      <Card className="border-[var(--border-light)] shadow-lg overflow-hidden">
        <CardHeader className="pb-6 border-b border-[var(--border-light)]">
          <CardTitle className="flex items-center gap-3 text-2xl text-[var(--text-main)]">
            <Calculator className="w-8 h-8 text-[var(--primary)]" />
            MTV Hesaplama Aracı 2026
          </CardTitle>
          <p className="text-sm text-[var(--text-muted)] font-normal">
            Lütfen aracınıza ait bilgileri ruhsatınızdaki gibi doldurunuz.
          </p>
        </CardHeader>
        <CardContent className="space-y-8 pt-8 px-6 md:px-10">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Araç Tipi */}
            <div className="space-y-2">
              <Label className="text-sm font-bold text-[var(--text-main)] flex items-center gap-2">
                <Car className="w-4 h-4 text-[var(--primary)]" />
                ARAÇ TİPİ
              </Label>
              <Select value={vehicleType} onValueChange={(v) => { setVehicleType(v as VehicleType); setResult(null); }}>
                <SelectTrigger className="h-11 bg-[var(--muted)]/30 border-2 border-transparent focus:border-[var(--primary)] transition-all">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="otomobil">Otomobil, Arazi Taşıtı</SelectItem>
                  <SelectItem value="motosiklet">Motosiklet</SelectItem>
                  <SelectItem value="minibus">Minibüs</SelectItem>
                  <SelectItem value="panelvan">Panelvan, Motorlu Karavan</SelectItem>
                  <SelectItem value="otobus">Otobüs</SelectItem>
                  <SelectItem value="kamyonet">Kamyonet, Kamyon, Çekici</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Model Yılı */}
            <div className="space-y-3">
              <Label className="text-sm font-bold text-[var(--text-main)] flex items-center gap-2">
                <Clock className="w-4 h-4 text-[var(--primary)]" />
                MODEL YILI
              </Label>
              <Select value={modelYear} onValueChange={(v) => { setModelYear(v); setResult(null); }}>
                <SelectTrigger className="h-11 bg-[var(--muted)]/30 border-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {modelYears.map((year) => {
                    const cutoffYear = MTV_YEAR - 16;
                    if (year <= cutoffYear && year === cutoffYear) {
                      return (
                        <SelectItem key={year} value={year.toString()}>
                          {year} Model ve Öncesi
                        </SelectItem>
                      );
                    } else if (year < cutoffYear) {
                      return null; // Don't show years before cutoff individually
                    }
                    return (
                      <SelectItem key={year} value={year.toString()}>
                        {year} Model
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Conditional: Elektrikli & Tescil Date (Otomobil only) */}
          {vehicleType === "otomobil" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <Label className="text-sm font-bold text-[var(--text-main)] flex items-center gap-2">
                  <Zap className="w-4 h-4 text-green-500" />
                  MOTOR ÖZELLİĞİ
                </Label>
                <div className="flex gap-4">
                  <Button 
                    variant={isElectric ? "default" : "outline"} 
                    className={`flex-1 h-11 gap-2 border-2 ${isElectric ? 'bg-green-600 hover:bg-green-700' : ''}`}
                    onClick={() => { setIsElectric(true); setResult(null); }}
                  >
                    <Zap className="w-4 h-4" /> Elektrikli
                  </Button>
                  <Button 
                    variant={!isElectric ? "default" : "outline"} 
                    className={`flex-1 h-11 gap-2 border-2 ${!isElectric ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                    onClick={() => { setIsElectric(false); setResult(null); }}
                  >
                    <Car className="w-4 h-4" /> Benzinli/Dizel
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-bold text-[var(--text-main)] flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[var(--primary)]" />
                  İLK TESCİL TARİHİ
                </Label>
                <div className="flex gap-4">
                  <Button 
                    variant={regDate === "pre2018" ? "default" : "outline"}
                    className="flex-1 h-11 text-xs border-2"
                    onClick={() => { setRegDate("pre2018"); setResult(null); }}
                  >
                    2017 ve Öncesi
                  </Button>
                  <Button 
                    variant={regDate === "post2018" ? "default" : "outline"}
                    className="flex-1 h-11 text-xs border-2"
                    onClick={() => { setRegDate("post2018"); setResult(null); }}
                  >
                    2018 Sonrası
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Inputs based on vehicle type */}
          <div className="pt-4 border-t border-[var(--border-light)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Otomobil: Motor Hacmi + Matrah (conditional) */}
              {vehicleType === "otomobil" && (
                <>
                  <div className="space-y-3">
                    <Label className="text-sm font-bold text-[var(--text-main)]">
                      MOTOR HACMİ (cc)
                    </Label>
                    <Select value={engineCc} onValueChange={(v) => { setEngineCc(v); setResult(null); }}>
                      <SelectTrigger className="h-14 bg-[var(--muted)]/30 border-2">
                        <SelectValue placeholder="Motor hacmi aralığını seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1000">1300 cm³ ve aşağısı</SelectItem>
                        <SelectItem value="1450">1301 - 1600 cm³</SelectItem>
                        <SelectItem value="1700">1601 - 1800 cm³</SelectItem>
                        <SelectItem value="1900">1801 - 2000 cm³</SelectItem>
                        <SelectItem value="2250">2001 - 2500 cm³</SelectItem>
                        <SelectItem value="2750">2501 - 3000 cm³</SelectItem>
                        <SelectItem value="3250">3001 - 3500 cm³</SelectItem>
                        <SelectItem value="3750">3501 - 4000 cm³</SelectItem>
                        <SelectItem value="4500">4001 cm³ ve üstü</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Matrah - Only for post-2018 */}
                  {regDate === "post2018" && parseInt(engineCc) > 0 && (
                    <div className="space-y-3">
                      <Label className="text-sm font-bold text-[var(--text-main)]">
                        TAŞIT DEĞERİ (MATRAH)
                      </Label>
                      <Select value={matrahIndex} onValueChange={(v) => { setMatrahIndex(v); setResult(null); }}>
                        <SelectTrigger className="h-14 bg-[var(--muted)]/30 border-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {matrahOptions.map((opt, idx) => (
                            <SelectItem key={idx} value={idx.toString()}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-[10px] text-[var(--text-muted)] italic">
                        * Aracın ilk satın alındığı fiyat aralığını seçin
                      </p>
                    </div>
                  )}
                </>
              )}

              {/* Motosiklet: cc */}
              {vehicleType === "motosiklet" && (
                <div className="space-y-3">
                  <Label className="text-sm font-bold text-[var(--text-main)]">MOTOR HACMİ (cc)</Label>
                  <Select value={engineCc} onValueChange={(v) => { setEngineCc(v); setResult(null); }}>
                    <SelectTrigger className="h-14 bg-[var(--muted)]/30 border-2">
                      <SelectValue placeholder="Motor hacmi aralığını seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="50">0 - 100 cm³</SelectItem>
                      <SelectItem value="175">101 - 250 cm³</SelectItem>
                      <SelectItem value="450">251 - 650 cm³</SelectItem>
                      <SelectItem value="900">651 - 1200 cm³</SelectItem>
                      <SelectItem value="1300">1201 cm³ ve üstü</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Panelvan: cc */}
              {vehicleType === "panelvan" && (
                <div className="space-y-3">
                  <Label className="text-sm font-bold text-[var(--text-main)]">MOTOR HACMİ (cc)</Label>
                  <Select value={engineCc} onValueChange={(v) => { setEngineCc(v); setResult(null); }}>
                    <SelectTrigger className="h-14 bg-[var(--muted)]/30 border-2">
                      <SelectValue placeholder="Motor hacmi aralığını seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1500">1900 cm³ ve aşağısı</SelectItem>
                      <SelectItem value="2200">1901 cm³ ve üstü</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Otobüs: Seats */}
              {vehicleType === "otobus" && (
                <div className="space-y-3">
                  <Label className="text-sm font-bold text-[var(--text-main)]">OTURMA YERİ (KİŞİ)</Label>
                  <Select value={seats} onValueChange={(v) => { setSeats(v); setResult(null); }}>
                    <SelectTrigger className="h-14 bg-[var(--muted)]/30 border-2">
                      <SelectValue placeholder="Oturma yeri aralığını seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="20">25 kişiye kadar</SelectItem>
                      <SelectItem value="30">26 - 35 kişi</SelectItem>
                      <SelectItem value="40">36 - 45 kişi</SelectItem>
                      <SelectItem value="50">46 kişi ve üstü</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Kamyonet: Weight */}
              {vehicleType === "kamyonet" && (
                <div className="space-y-3">
                  <Label className="text-sm font-bold text-[var(--text-main)]">AZAMİ TOPLAM AĞIRLIK (kg)</Label>
                  <Select value={weight} onValueChange={(v) => { setWeight(v); setResult(null); }}>
                    <SelectTrigger className="h-14 bg-[var(--muted)]/30 border-2">
                      <SelectValue placeholder="Ağırlık aralığını seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1200">1.500 kg'a kadar</SelectItem>
                      <SelectItem value="2500">1.501 - 3.500 kg</SelectItem>
                      <SelectItem value="4250">3.501 - 5.000 kg</SelectItem>
                      <SelectItem value="7500">5.001 - 10.000 kg</SelectItem>
                      <SelectItem value="15000">10.001 - 20.000 kg</SelectItem>
                      <SelectItem value="25000">20.001 kg ve üstü</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={resetForm}
              type="button"
              className="h-11 px-6 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl shadow-lg shadow-red-500/30 flex items-center justify-center gap-2 text-lg transition-transform active:scale-[0.98] cursor-pointer"
            >
              <RotateCcw className="w-5 h-5" />
              Sıfırla
            </Button>
            <Button
              onClick={handleCalculate}
              className="flex-1 h-11 bg-[#2463eb] hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 text-lg transition-transform active:scale-[0.98] cursor-pointer"
            >
              <Calculator className="w-5 h-5" />
              HESAPLA
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <div className="bg-[var(--card)] rounded-xl shadow-sm border border-[var(--border-light)] overflow-hidden">
          {/* Summary Header */}
          <div className="px-6 py-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-purple-950/30 border-b border-[var(--border-light)]">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <p className="text-sm font-medium text-[var(--text-muted)] mb-1">{MTV_YEAR} YILI</p>
                <h3 className="text-3xl md:text-4xl font-black text-[var(--text-main)]">
                  {formatCurrency(result.yearlyTotal)}
                </h3>
                <p className="text-sm text-[var(--text-muted)] mt-1">Yıllık MTV Tutarı</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <div className="px-4 py-2 rounded-full bg-white dark:bg-gray-800 border border-[var(--border-light)] shadow-sm text-xs font-bold text-gray-600 dark:text-gray-300 flex items-center gap-2">
                  <Car className="w-3 h-3" /> {vehicleType.charAt(0).toUpperCase() + vehicleType.slice(1)}
                </div>
                <div className="px-4 py-2 rounded-full bg-white dark:bg-gray-800 border border-[var(--border-light)] shadow-sm text-xs font-bold text-gray-600 dark:text-gray-300 flex items-center gap-2">
                  <Clock className="w-3 h-3" /> {getAgeLabel(result.vehicleAge)}
                </div>
                {isElectric && vehicleType === "otomobil" && (
                  <div className="px-4 py-2 rounded-full bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 text-xs font-bold text-green-700 dark:text-green-400 flex items-center gap-2">
                    <Zap className="w-3 h-3" /> Elektrikli
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Installments */}
          <div className="p-6">
            <h3 className="text-lg font-semibold text-[var(--text-main)] mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[var(--primary)]" />
              Taksit Bilgileri
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/30 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 rounded-lg bg-blue-600 text-white">
                    <Banknote className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider">{MTV_INSTALLMENTS.first.period}</p>
                    <p className="text-xs text-blue-600 dark:text-blue-400">{MTV_INSTALLMENTS.first.months}</p>
                  </div>
                </div>
                <p className="text-3xl font-black text-blue-900 dark:text-blue-100 mb-2">
                  {formatCurrency(result.installmentAmount)}
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300 font-medium">
                  Son ödeme: <span className="font-bold">{MTV_INSTALLMENTS.first.deadline}</span>
                </p>
              </div>

              <div className="p-5 rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950/50 dark:to-indigo-900/30 border border-indigo-200 dark:border-indigo-800">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 rounded-lg bg-indigo-600 text-white">
                    <Banknote className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider">{MTV_INSTALLMENTS.second.period}</p>
                    <p className="text-xs text-indigo-600 dark:text-indigo-400">{MTV_INSTALLMENTS.second.months}</p>
                  </div>
                </div>
                <p className="text-3xl font-black text-indigo-900 dark:text-indigo-100 mb-2">
                  {formatCurrency(result.installmentAmount)}
                </p>
                <p className="text-xs text-indigo-700 dark:text-indigo-300 font-medium">
                  Son ödeme: <span className="font-bold">{MTV_INSTALLMENTS.second.deadline}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bank Campaigns */}
      <h3 className="text-lg font-bold text-[var(--text-main)] px-2">Banka Taksit Kampanyaları</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {BANK_CAMPAIGNS.map((bank, i) => (
          <div key={i} className="bg-white dark:bg-gray-900 p-6 rounded-2xl border-2 border-transparent hover:border-blue-500 transition-all shadow-md group">
            <div className="flex flex-col h-full justify-between">
              <div>
                <p className="font-black text-gray-900 dark:text-white group-hover:text-blue-600 mb-1">{bank.bank}</p>
                <p className="text-xs text-gray-500 mb-4">{bank.card}</p>
              </div>
              <div className="space-y-3">
                <div className="py-2 px-4 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-center font-black text-lg">
                  {bank.installments} Taksit
                </div>
                <p className="text-[10px] text-gray-400 text-center font-medium">{bank.period}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Payment Channels */}
      <h3 className="text-lg font-bold text-[var(--text-main)] px-2">Ödeme Kanalları</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {PAYMENT_CHANNELS.map((ch, i) => (
          ch.url ? (
            <a 
              key={i} 
              href={ch.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="group relative flex flex-col items-center justify-center p-6 rounded-2xl bg-blue-600 hover:bg-blue-700 transition-all shadow-lg active:scale-95 border-b-4 border-blue-800 hover:border-blue-900"
            >
              <CheckCircle className="w-8 h-8 text-white/50 group-hover:text-white/80 mb-3 transition-colors" />
              <span className="text-white font-bold text-sm text-center tracking-tight">{ch.name}</span>
            </a>
          ) : (
            <div key={i} className="flex flex-col items-center justify-center p-6 rounded-2xl bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-700 grayscale opacity-70">
              <CheckCircle className="w-8 h-8 text-gray-400 mb-3" />
              <span className="text-gray-500 dark:text-gray-400 font-bold text-sm text-center leading-tight">{ch.name}</span>
            </div>
          )
        ))}
      </div>

      {/* Info */}
      <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
        <CardHeader>
          <CardTitle className="text-amber-800 dark:text-amber-200 flex items-center gap-2">
            <Info className="w-5 h-5" /> Önemli Bilgiler
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {MTV_INFO.importantNotes.map((note, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-amber-900 dark:text-amber-300">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{note}</span>
            </div>
          ))}
          <p className="text-xs text-amber-700 mt-4 italic font-medium">
            * 2018 ve sonrası otomobillerde MTV, motor hacmi ve taşıt değerine (matrah) göre hesaplanır.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
