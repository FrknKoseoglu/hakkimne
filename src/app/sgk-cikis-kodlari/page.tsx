"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { sgkCodes } from "@/lib/sgk-codes";
import { Search, CheckCircle, XCircle, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CURRENT_YEAR } from "@/lib/constants";

export default function SgkCikisKodlariPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCodes = useMemo(() => {
    if (!searchQuery.trim()) return sgkCodes;
    const query = searchQuery.toLowerCase();
    return sgkCodes.filter(
      (code) =>
        code.code.includes(query) ||
        code.title.toLowerCase().includes(query) ||
        code.description.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-[var(--background-light)]">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[var(--primary)] to-blue-700 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3">
            SGK İşten Çıkış Kodları
          </h1>
          <p className="text-base md:text-lg opacity-90 max-w-2xl mx-auto">
            {CURRENT_YEAR} güncel SGK çıkış kodları listesi. Her kodun tazminat ve işsizlik maaşı haklarını öğrenin.
          </p>
        </div>
      </section>

      {/* Search & Table */}
      <section className="py-8">
        <div className="max-w-[960px] mx-auto px-4">
          {/* Search Input */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] w-5 h-5" />
            <Input
              type="text"
              placeholder="Kod numarası veya açıklama ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-base rounded-lg border-[var(--border-light)] bg-[var(--background-light)]"
            />
          </div>

          {/* Results Count */}
          <p className="text-sm text-[var(--text-muted)] mb-4">
            {filteredCodes.length} kod bulundu
          </p>

          {/* Table */}
          <div className="bg-[var(--card)] rounded-xl border border-[var(--border-light)] overflow-hidden">
            {/* Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-3 bg-[var(--muted)] text-sm font-medium text-[var(--text-muted)] border-b border-[var(--border-light)]">
              <div className="col-span-1">Kod</div>
              <div className="col-span-5">Açıklama</div>
              <div className="col-span-2 text-center">Kıdem</div>
              <div className="col-span-2 text-center">İhbar</div>
              <div className="col-span-2 text-center">İşsizlik</div>
            </div>

            {/* Rows */}
            <div className="divide-y divide-[var(--border-light)]">
              {filteredCodes.map((code) => (
                <Link
                  key={code.code}
                  href={`/sgk-cikis-kodlari/${code.slug}`}
                  className="block hover:bg-[var(--muted)] transition-colors"
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-4 py-4 items-center">
                    {/* Code */}
                    <div className="md:col-span-1">
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold text-sm">
                        {code.code}
                      </span>
                    </div>

                    {/* Title */}
                    <div className="md:col-span-5">
                      <p className="font-medium text-[var(--text-main)] text-sm leading-tight">
                        {code.title}
                      </p>
                    </div>

                    {/* Status Icons - Mobile */}
                    <div className="flex gap-4 md:hidden mt-2">
                      <div className="flex items-center gap-1 text-xs">
                        {code.severancePay ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                        <span>Kıdem</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        {code.noticePay ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                        <span>İhbar</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        {code.unemploymentPay ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                        <span>İşsizlik</span>
                      </div>
                    </div>

                    {/* Status Icons - Desktop */}
                    <div className="hidden md:flex md:col-span-2 justify-center">
                      {code.severancePay ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                    <div className="hidden md:flex md:col-span-2 justify-center">
                      {code.noticePay ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                    <div className="hidden md:flex md:col-span-2 justify-center">
                      {code.unemploymentPay ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {filteredCodes.length === 0 && (
              <div className="px-4 py-12 text-center text-[var(--text-muted)]">
                <p>Aramanıza uygun kod bulunamadı.</p>
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="mt-6 flex flex-wrap gap-6 text-sm text-[var(--text-muted)]">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Hak kazanılır</span>
            </div>
            <div className="flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-500" />
              <span>Hak kazanılmaz</span>
            </div>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-12 px-4 bg-[var(--muted)]">
        <div className="max-w-[960px] mx-auto">
          <h2 className="text-2xl font-bold mb-4 text-[var(--text-main)]">
            SGK İşten Çıkış Kodu Nedir?
          </h2>
          <div className="prose prose-slate max-w-none text-[var(--text-muted)]">
            <p>
              SGK işten çıkış kodu, işçinin işten ayrılma nedenini belirten ve SGK sistemine bildirilen bir koddur. 
              Bu kod, işçinin kıdem tazminatı, ihbar tazminatı ve işsizlik maaşı alma haklarını doğrudan etkiler.
            </p>
            <p className="mt-4">
              İşvereninizin hangi kodla çıkış yaptığını e-Devlet üzerinden &quot;SGK Hizmet Dökümü&quot; sayfasından kontrol edebilirsiniz. 
              Yanlış kod bildirimi durumunda İş Mahkemesi&apos;nde dava açabilirsiniz.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-[var(--text-muted)] border-t border-[var(--border-light)] bg-[var(--card)]/50">
        <div className="mx-auto max-w-[960px] px-4">
          <p className="mb-2">© {CURRENT_YEAR} Hakkım Ne? - Tüm hakları saklıdır.</p>
          <p className="text-xs">
            Bu bilgiler genel bilgilendirme amaçlıdır. Kesin sonuçlar için bir iş hukuku uzmanına danışın.
          </p>
        </div>
      </footer>
    </div>
  );
}
