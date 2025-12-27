"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Save,
  Loader2,
  Upload,
  Image as ImageIcon,
  Eye,
  EyeOff,
  X,
} from "lucide-react";
import { toast } from "sonner";

interface Author {
  id: string;
  name: string;
}

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  coverImage: string | null;
  ctaType: "SEVERANCE_CALC" | "UNEMPLOYMENT_CALC" | "BEDELLI_CALC" | "OVERTIME_CALC" | "RENT_CALC" | "RESIGNATION_LETTER" | "NONE";
  authorId: string;
  published: boolean;
}

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [ctaType, setCtaType] = useState<string>("NONE");
  const [authorId, setAuthorId] = useState("");
  const [published, setPublished] = useState(false);

  const [authors, setAuthors] = useState<Author[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Fetch post and authors on mount
  useEffect(() => {
    Promise.all([fetchPost(), fetchAuthors()]).finally(() =>
      setIsFetching(false)
    );
  }, []);

  const fetchPost = async () => {
    try {
      const res = await fetch(`/api/admin/posts/${postId}`);
      if (res.ok) {
        const data = await res.json();
        const post: Post = data.post;
        setTitle(post.title);
        setSlug(post.slug);
        setContent(post.content);
        setExcerpt(post.excerpt || "");
        setCoverImage(post.coverImage || "");
        setCtaType(post.ctaType);
        setAuthorId(post.authorId);
        setPublished(post.published);
      } else {
        toast.error("Yazı bulunamadı");
        router.push("/admin");
      }
    } catch (error) {
      console.error("Failed to fetch post:", error);
      toast.error("Yazı yüklenemedi");
    }
  };

  const fetchAuthors = async () => {
    try {
      const res = await fetch("/api/admin/authors");
      if (res.ok) {
        const data = await res.json();
        setAuthors(data.authors);
      }
    } catch (error) {
      console.error("Failed to fetch authors:", error);
    }
  };

  // Slugify helper
  const slugify = useCallback((text: string) => {
    const turkishMap: Record<string, string> = {
      ı: "i", İ: "i", ş: "s", Ş: "s", ğ: "g", Ğ: "g",
      ü: "u", Ü: "u", ö: "o", Ö: "o", ç: "c", Ç: "c",
    };

    let result = text.toLowerCase().trim();
    for (const [turkish, latin] of Object.entries(turkishMap)) {
      result = result.replace(new RegExp(turkish, "g"), latin);
    }

    return result
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");
  }, []);

  const handleSlugChange = (value: string) => {
    setSlug(slugify(value));
  };

  // Image upload handlers
  const handleImageUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Sadece resim dosyaları yüklenebilir");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setCoverImage(data.url);
        toast.success("Resim yüklendi");
      } else {
        toast.error("Resim yüklenemedi");
      }
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Resim yüklenemedi");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleImageUpload(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  // Save post
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !content || !authorId) {
      toast.error("Başlık, içerik ve yazar zorunludur");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`/api/admin/posts/${postId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug,
          content,
          excerpt,
          coverImage,
          ctaType,
          authorId,
          published,
        }),
      });

      if (res.ok) {
        toast.success("Yazı güncellendi");
        router.push("/admin");
      } else {
        const error = await res.json();
        toast.error(error.message || "Yazı güncellenemedi");
      }
    } catch (error) {
      console.error("Save failed:", error);
      toast.error("Bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background-light)]">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--primary)]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background-light)]">
      {/* Header */}
      <header className="border-b border-[var(--border-light)] bg-[var(--card)] sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold">Yazıyı Düzenle</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setPublished(!published)}
              className={published ? "text-green-600" : "text-yellow-600"}
            >
              {published ? (
                <>
                  <Eye className="mr-2 h-4 w-4" />
                  Yayında
                </>
              ) : (
                <>
                  <EyeOff className="mr-2 h-4 w-4" />
                  Taslak
                </>
              )}
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Kaydet
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Editor */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title & Slug */}
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Başlık</Label>
                    <Input
                      id="title"
                      placeholder="Yazı başlığı..."
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="text-lg font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">URL Slug</Label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-[var(--text-muted)]">/blog/</span>
                      <Input
                        id="slug"
                        placeholder="yazi-slug"
                        value={slug}
                        onChange={(e) => handleSlugChange(e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Markdown Editor */}
              <Card>
                <CardHeader>
                  <CardTitle>İçerik (Markdown)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <textarea
                        className="w-full h-[500px] p-4 font-mono text-sm rounded-lg border border-[var(--border-light)] bg-[var(--background)] resize-none focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                        placeholder="Markdown içeriğinizi buraya yazın..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                      />
                    </div>
                    <div className="border border-[var(--border-light)] rounded-lg p-4 h-[500px] overflow-y-auto bg-white dark:bg-[var(--card)]">
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        {content ? (
                          <ReactMarkdown>{content}</ReactMarkdown>
                        ) : (
                          <p className="text-[var(--text-muted)]">
                            Önizleme burada görünecek...
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Cover Image */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" />
                    Kapak Resmi
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {coverImage ? (
                    <div className="relative">
                      <img
                        src={coverImage}
                        alt="Cover"
                        className="w-full h-40 object-cover rounded-lg"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => setCoverImage("")}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div
                      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                        isDragging
                          ? "border-[var(--primary)] bg-[var(--accent)]"
                          : "border-[var(--border-light)]"
                      }`}
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                    >
                      {isUploading ? (
                        <Loader2 className="h-8 w-8 mx-auto animate-spin text-[var(--primary)]" />
                      ) : (
                        <>
                          <Upload className="h-8 w-8 mx-auto mb-2 text-[var(--text-muted)]" />
                          <p className="text-sm text-[var(--text-muted)]">
                            Sürükle & Bırak veya
                          </p>
                          <label className="cursor-pointer">
                            <span className="text-sm text-[var(--primary)] hover:underline">
                              dosya seç
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleImageUpload(file);
                              }}
                            />
                          </label>
                        </>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Excerpt */}
              <Card>
                <CardHeader>
                  <CardTitle>Özet</CardTitle>
                </CardHeader>
                <CardContent>
                  <textarea
                    className="w-full h-24 p-3 text-sm rounded-lg border border-[var(--border-light)] bg-[var(--background)] resize-none focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    placeholder="Yazının kısa özeti..."
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                  />
                </CardContent>
              </Card>

              {/* Author */}
              <Card>
                <CardHeader>
                  <CardTitle>Yazar</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select value={authorId} onValueChange={setAuthorId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Yazar seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {authors.map((author) => (
                        <SelectItem key={author.id} value={author.id}>
                          {author.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              {/* CTA Type */}
              <Card>
                <CardHeader>
                  <CardTitle>CTA Türü</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select value={ctaType} onValueChange={setCtaType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NONE">CTA Yok</SelectItem>
                      <SelectItem value="SEVERANCE_CALC">
                        Kıdem Tazminatı Hesaplama
                      </SelectItem>
                      <SelectItem value="UNEMPLOYMENT_CALC">
                        İşsizlik Maaşı Hesaplama
                      </SelectItem>
                      <SelectItem value="BEDELLI_CALC">
                        Bedelli Askerlik Hesaplama
                      </SelectItem>
                      <SelectItem value="OVERTIME_CALC">
                        Fazla Mesai Hesaplama
                      </SelectItem>
                      <SelectItem value="RENT_CALC">
                        Kira Artış Oranı Hesaplama
                      </SelectItem>
                      <SelectItem value="RESIGNATION_LETTER">
                        İstifa Dilekçesi Oluşturucu
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
