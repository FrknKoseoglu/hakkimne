"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MessageCircle, Send, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const MESSAGE_TYPES = [
  { value: "COMPLAINT", label: "Şikayet" },
  { value: "SUGGESTION", label: "Öneri" },
  { value: "OTHER", label: "Diğer" },
];

const FEATURE_TYPES = [
  { value: "SEVERANCE_CALC", label: "Kıdem ve İhbar Tazminatı" },
  { value: "UNEMPLOYMENT_CALC", label: "İşsizlik Maaşı" },
  { value: "BEDELLI_CALC", label: "Bedelli Askerlik" },
  { value: "OVERTIME_CALC", label: "Fazla Mesai" },
  { value: "SGK_CODES", label: "SGK Çıkış Kodları" },
  { value: "BLOG", label: "Blog" },
  { value: "OTHER", label: "Diğer" },
];

const formSchema = z.object({
  name: z
    .string()
    .min(2, "İsim en az 2 karakter olmalı")
    .max(100, "İsim çok uzun"),
  email: z.string().email("Geçerli bir e-posta girin"),
  messageType: z.string().min(1, "Tür seçin"),
  feature: z.string().min(1, "İlgili özellik seçin"),
  message: z
    .string()
    .min(10, "Mesaj en az 10 karakter olmalı")
    .max(2000, "Mesaj çok uzun"),
});

export function ContactForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [isFormReady, setIsFormReady] = useState(false);
  const [formLoadTime, setFormLoadTime] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    messageType: "",
    feature: "",
    message: "",
    website: "", // Honeypot
  });

  // Enable form after 2 seconds (spam protection)
  useEffect(() => {
    if (isOpen) {
      setFormLoadTime(Date.now());
      setIsFormReady(false);
      setIsSuccess(false);
      const timer = setTimeout(() => {
        setIsFormReady(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
    const result = formSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0].toString()] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          formLoadTime,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          toast.error("Çok fazla istek. Lütfen biraz bekleyin.");
        } else {
          toast.error(data.error || "Bir hata oluştu");
        }
        return;
      }

      setIsSuccess(true);
      setFormData({
        name: "",
        email: "",
        messageType: "",
        feature: "",
        message: "",
        website: "",
      });
      toast.success("Mesajınız başarıyla gönderildi!");
    } catch (error) {
      toast.error("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-[var(--primary)] hover:bg-blue-700 text-white font-medium rounded-full shadow-lg shadow-blue-500/30 transition-all hover:scale-105 cursor-pointer"
          aria-label="İletişim"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="hidden sm:inline">İletişim</span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-[var(--primary)]" />
            Bize Ulaşın
          </DialogTitle>
          <DialogDescription>
            Şikayet, öneri veya sorularınızı bize iletebilirsiniz.
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--text-main)] mb-2">
              Teşekkürler!
            </h3>
            <p className="text-sm text-[var(--text-muted)]">
              Mesajınız başarıyla iletildi. En kısa sürede değerlendireceğiz.
            </p>
            <Button
              onClick={() => setIsOpen(false)}
              className="mt-6 cursor-pointer"
            >
              Kapat
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            {/* Honeypot - hidden from users */}
            <input
              type="text"
              name="website"
              value={formData.website}
              onChange={(e) => handleChange("website", e.target.value)}
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
            />

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Ad Soyad *</Label>
              <Input
                id="name"
                placeholder="Adınız Soyadınız"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">E-posta *</Label>
              <Input
                id="email"
                type="email"
                placeholder="ornek@email.com"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Message Type & Feature Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Message Type */}
              <div className="space-y-2">
                <Label>Tür *</Label>
                <Select
                  value={formData.messageType}
                  onValueChange={(value) => handleChange("messageType", value)}
                >
                  <SelectTrigger className={errors.messageType ? "border-red-500" : ""}>
                    <SelectValue placeholder="Seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {MESSAGE_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.messageType && (
                  <p className="text-xs text-red-500">{errors.messageType}</p>
                )}
              </div>

              {/* Feature */}
              <div className="space-y-2">
                <Label>İlgili Özellik *</Label>
                <Select
                  value={formData.feature}
                  onValueChange={(value) => handleChange("feature", value)}
                >
                  <SelectTrigger className={errors.feature ? "border-red-500" : ""}>
                    <SelectValue placeholder="Seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {FEATURE_TYPES.map((feature) => (
                      <SelectItem key={feature.value} value={feature.value}>
                        {feature.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.feature && (
                  <p className="text-xs text-red-500">{errors.feature}</p>
                )}
              </div>
            </div>

            {/* Message */}
            <div className="space-y-2">
              <Label htmlFor="message">Mesaj *</Label>
              <Textarea
                id="message"
                placeholder="Mesajınızı buraya yazın..."
                rows={4}
                value={formData.message}
                onChange={(e) => handleChange("message", e.target.value)}
                className={errors.message ? "border-red-500" : ""}
              />
              {errors.message && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.message}
                </p>
              )}
              <p className="text-xs text-[var(--text-muted)] text-right">
                {formData.message.length}/2000
              </p>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={!isFormReady || isSubmitting}
              className="w-full h-12 cursor-pointer"
            >
              {!isFormReady ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Hazırlanıyor...
                </>
              ) : isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Gönderiliyor...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Gönder
                </>
              )}
            </Button>

            <p className="text-xs text-center text-[var(--text-muted)]">
              Gönderdiğiniz bilgiler gizli tutulacaktır.
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
