"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PlusCircle,
  LogOut,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
  FileText,
} from "lucide-react";

interface Post {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  publishedAt: string | null;
  views: number;
  author: {
    name: string;
  };
  createdAt: string;
}

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/admin/posts");
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts);
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu yazıyı silmek istediğinizden emin misiniz?")) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/posts/${id}`, { method: "DELETE" });
      if (res.ok) {
        setPosts((prev) => prev.filter((post) => post.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete post:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-[var(--background-light)]">
      {/* Header */}
      <header className="border-b border-[var(--border-light)] bg-[var(--card)]">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Blog Yönetimi</h1>
            <p className="text-sm text-[var(--text-muted)]">
              Hoş geldiniz, {session?.user?.name || session?.user?.email}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin/posts/new">
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Yeni Yazı
              </Button>
            </Link>
            <Button
              variant="outline"
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Çıkış
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Tüm Yazılar
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-[var(--primary)]" />
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto mb-4 text-[var(--text-muted)]" />
                <p className="text-[var(--text-muted)] mb-4">
                  Henüz yazı bulunmuyor
                </p>
                <Link href="/admin/posts/new">
                  <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    İlk Yazıyı Oluştur
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[var(--border-light)]">
                      <th className="text-left py-3 px-4 font-medium">Başlık</th>
                      <th className="text-left py-3 px-4 font-medium">Yazar</th>
                      <th className="text-left py-3 px-4 font-medium">Durum</th>
                      <th className="text-left py-3 px-4 font-medium">Görüntülenme</th>
                      <th className="text-left py-3 px-4 font-medium">Tarih</th>
                      <th className="text-right py-3 px-4 font-medium">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {posts.map((post) => (
                      <tr
                        key={post.id}
                        className="border-b border-[var(--border-light)] hover:bg-[var(--muted)] transition-colors"
                      >
                        <td className="py-3 px-4">
                          <div>
                            <a
                              href={`/blog/${post.slug}${!post.published ? '?preview=true' : ''}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-medium hover:text-[var(--primary)] hover:underline transition-colors"
                            >
                              {post.title}
                            </a>
                            <p className="text-sm text-[var(--text-muted)]">
                              /blog/{post.slug}
                            </p>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-[var(--text-muted)]">
                          {post.author.name}
                        </td>
                        <td className="py-3 px-4">
                          {post.published ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                              <Eye className="h-3 w-3" />
                              Yayında
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                              <EyeOff className="h-3 w-3" />
                              Taslak
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-[var(--text-muted)]">
                          {post.views.toLocaleString("tr-TR")}
                        </td>
                        <td className="py-3 px-4 text-[var(--text-muted)]">
                          {formatDate(post.createdAt)}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-end gap-2">
                            <Link href={`/admin/posts/${post.id}/edit`}>
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(post.id)}
                              disabled={deletingId === post.id}
                              className="text-destructive hover:text-destructive"
                            >
                              {deletingId === post.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
