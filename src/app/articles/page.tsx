"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Article } from "@/data/articles";
import { useArticleStore } from "@/lib/article-store";
import {
  BookOpen,
  Clock,
  Calendar,
  ArrowRight,
  X,
  Share2,
  Quote,
  Check,
  Search,
  Sparkles,
  ExternalLink,
} from "lucide-react";

export default function ArticlesPage() {
  const {
    categories,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    filteredArticles,
    featuredArticle,
    activeArticle,
    setActiveArticle,
    resetFilters,
  } = useArticleStore();

  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const handleShare = (article?: Article) => {
    if (typeof window !== "undefined") {
      const shareUrl = article
        ? `${window.location.origin}/articles/${article.slug}`
        : window.location.href;
      navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const isShowingFeatured =
    selectedCategory === "All" && !searchQuery.trim() && featuredArticle;

  return (
    <div className="min-h-screen flex flex-col bg-canvas-primary text-text-primary">
      <Navbar />

      <main className="flex-1">
        {/* Editorial Journal Header Banner */}
        <section className="w-full bg-canvas-secondary border-b border-border-subtle py-12 sm:py-16">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2 text-xs uppercase font-semibold tracking-wider text-text-muted">
                <span className="w-6 h-[1px] bg-accent-warm" />
                <span>THE BEYOND JOURNAL</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-text-primary">
                Catatan Kopi, Cerita Rasa &amp; Ruang Temu
              </h1>
              <p className="text-sm sm:text-base text-text-muted leading-relaxed">
                Ulasan proses sangrai biji kopi lokal, panduan seduh manual, eksplorasi kuliner, dan cerita santai dari ruang temu Coffee And Beyond Pekalongan.
              </p>
            </div>

            {/* Search Input Bar */}
            <div className="pt-2 max-w-xl">
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-text-muted absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari artikel, topik kopi, atau panduan seduh..."
                  className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-canvas-primary border border-border-subtle rounded-md text-text-primary placeholder:text-text-muted/70 focus:outline-none focus:border-charcoal focus:ring-1 focus:ring-charcoal transition-all shadow-2xs"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 p-1 text-text-muted hover:text-text-primary rounded"
                    aria-label="Bersihkan pencarian"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Category Filter Navigation */}
        <section className="w-full bg-canvas-primary border-b border-border-subtle sticky top-16 z-30 backdrop-blur-xs bg-canvas-primary/95">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors border ${
                    selectedCategory === cat
                      ? "bg-charcoal text-white border-charcoal"
                      : "bg-canvas-secondary text-text-muted border-border-subtle hover:text-text-primary hover:border-[#D0D0CA]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Editorial Article Banner (When 'All' is selected and no search) */}
        {isShowingFeatured && (
          <section className="w-full border-b border-border-subtle py-10 sm:py-14 bg-canvas-primary">
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-canvas-secondary border border-border-subtle rounded-lg p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center hover:border-[#D0D0CA] transition-colors">
                <div className="lg:col-span-8 space-y-4">
                  <div className="flex items-center gap-2.5">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-text-primary bg-canvas-primary border border-border-subtle px-2 py-0.5 rounded-sm flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-accent-warm" />
                      Featured Cover Story
                    </span>
                    <span className="text-xs text-text-muted">
                      {featuredArticle.category}
                    </span>
                  </div>

                  <Link href={`/articles/${featuredArticle.slug}`} className="block group">
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary leading-tight group-hover:text-charcoal transition-colors">
                      {featuredArticle.title}
                    </h2>
                  </Link>

                  <p className="text-sm sm:text-base text-text-muted leading-relaxed max-w-2xl">
                    {featuredArticle.excerpt}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-text-muted pt-2 border-t border-border-subtle">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-canvas-primary border border-border-subtle flex items-center justify-center font-mono text-[10px] font-bold text-text-primary">
                        {featuredArticle.author.avatarInitials}
                      </div>
                      <span className="font-medium text-text-primary">
                        {featuredArticle.author.name}
                      </span>
                    </div>
                    <span className="text-border-subtle">•</span>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{featuredArticle.publishedAt}</span>
                    </div>
                    <span className="text-border-subtle">•</span>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{featuredArticle.readTime}</span>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-4 flex flex-col justify-between h-full space-y-6">
                  <div className="p-5 bg-canvas-primary border border-border-subtle rounded-md space-y-2">
                    <span className="text-[10px] uppercase font-semibold tracking-wider text-text-muted">
                      Key Takeaway
                    </span>
                    <p className="text-xs text-text-primary leading-relaxed italic">
                      &ldquo;{featuredArticle.keyTakeaway}&rdquo;
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row lg:flex-col gap-2">
                    <Link
                      href={`/articles/${featuredArticle.slug}`}
                      className="w-full flex items-center justify-center gap-2 px-5 py-3 text-xs font-semibold text-white bg-charcoal rounded-md hover:bg-[#3A3A37] transition-colors text-center"
                    >
                      <span>Read Full Story →</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Articles Grid */}
        <section className="w-full py-12 sm:py-16">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            {/* Header info when searching or filtering */}
            {(searchQuery.trim() || selectedCategory !== "All") && (
              <div className="flex items-center justify-between border-b border-border-subtle pb-4">
                <p className="text-xs sm:text-sm text-text-muted">
                  Menampilkan <span className="font-semibold text-text-primary">{filteredArticles.length}</span> artikel{" "}
                  {selectedCategory !== "All" && (
                    <>pada kategori <span className="font-medium text-text-primary">&ldquo;{selectedCategory}&rdquo;</span></>
                  )}
                  {searchQuery.trim() && (
                    <> untuk kata kunci <span className="font-medium text-text-primary">&ldquo;{searchQuery}&rdquo;</span></>
                  )}
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-xs text-accent-warm hover:underline font-medium"
                >
                  Reset Filter
                </button>
              </div>
            )}

            {filteredArticles.length === 0 ? (
              <div className="text-center py-16 bg-canvas-secondary border border-border-subtle rounded-lg p-8 space-y-4">
                <BookOpen className="w-10 h-10 mx-auto text-text-muted opacity-60" />
                <div className="space-y-1">
                  <h3 className="text-base font-semibold text-text-primary">
                    Tidak ada artikel yang ditemukan
                  </h3>
                  <p className="text-xs text-text-muted max-w-md mx-auto">
                    Coba ubah kata kunci pencarian atau pilih kategori lain untuk menemukan tulisan yang Anda cari.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="px-4 py-2 text-xs font-semibold bg-charcoal text-white rounded-md hover:bg-[#3A3A37] transition-colors inline-block"
                >
                  Lihat Semua Artikel
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {filteredArticles.map((article) => (
                  <article
                    key={article.id}
                    className="bg-canvas-primary border border-border-subtle rounded-lg p-6 flex flex-col justify-between hover:border-[#D0D0CA] transition-colors shadow-2xs group"
                  >
                    <div className="space-y-4">
                      {/* Visual 16:9 Thumbnail Header */}
                      <Link
                        href={`/articles/${article.slug}`}
                        className="aspect-video w-full rounded-md bg-canvas-secondary border border-border-subtle p-5 flex flex-col justify-between relative overflow-hidden group-hover:border-[#D0D0CA] transition-colors block"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase font-semibold tracking-wider text-text-muted bg-canvas-primary border border-border-subtle px-2 py-0.5 rounded-sm">
                            {article.category}
                          </span>
                          <span className="text-[11px] font-mono text-text-muted flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {article.readTime}
                          </span>
                        </div>

                        <div className="space-y-1">
                          <p className="font-mono text-[11px] text-text-muted">
                            Vol. {article.publishedAt.split(" ")[2] || "2026"}
                          </p>
                          <p className="text-xs font-medium text-text-primary line-clamp-1">
                            {article.tags.join(" • ")}
                          </p>
                        </div>
                      </Link>

                      {/* Metadata */}
                      <div className="flex items-center gap-2 text-[11px] text-text-muted">
                        <span>{article.publishedAt}</span>
                        <span>•</span>
                        <span>Oleh {article.author.name}</span>
                      </div>

                      {/* Article Title & Excerpt */}
                      <div className="space-y-2">
                        <Link href={`/articles/${article.slug}`}>
                          <h3 className="text-lg font-bold tracking-tight text-text-primary group-hover:text-charcoal transition-colors">
                            {article.title}
                          </h3>
                        </Link>
                        <p className="text-xs text-text-muted leading-relaxed line-clamp-3">
                          {article.excerpt}
                        </p>
                      </div>

                      {/* Key Takeaway snippet */}
                      <div className="p-3 bg-canvas-secondary/70 border border-border-subtle rounded-md">
                        <span className="text-[9px] uppercase font-semibold tracking-wider text-text-muted block mb-1">
                          Key Takeaway
                        </span>
                        <p className="text-[11px] text-text-primary italic line-clamp-2 leading-relaxed">
                          &ldquo;{article.keyTakeaway}&rdquo;
                        </p>
                      </div>
                    </div>

                    {/* Read Article Trigger */}
                    <div className="pt-5 mt-4 border-t border-border-subtle flex items-center justify-between gap-3">
                      <Link
                        href={`/articles/${article.slug}`}
                        className="flex-1 inline-flex items-center justify-between text-xs font-semibold text-text-primary hover:text-charcoal py-1 group/link"
                      >
                        <span className="inline-flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-accent-warm" />
                          <span>Read Full Story →</span>
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                      </Link>

                      <button
                        type="button"
                        onClick={() => setActiveArticle(article)}
                        title="Pratinjau cepat"
                        className="p-1.5 text-text-muted hover:text-text-primary hover:bg-canvas-secondary rounded-md border border-border-subtle transition-colors text-[11px]"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Newsletter & Submissions CTA */}
        <section className="w-full bg-canvas-secondary border-t border-border-subtle py-14">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-canvas-primary border border-border-subtle rounded-lg p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 max-w-xl text-center md:text-left">
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary">
                  The Beyond Gazette (Edisi Cetak Bulanan)
                </h3>
                <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                  Salinan fisik dari jurnal kami dicetak secara berkala dan tersedia gratis di rak baca ruang temu Coffee And Beyond Pekalongan.
                </p>
              </div>

              <Link
                href="/menu"
                className="px-5 py-2.5 text-xs font-semibold text-white bg-charcoal rounded-md hover:bg-[#3A3A37] transition-colors inline-flex items-center gap-1.5 shrink-0"
              >
                <span>Lihat Menu &amp; Berkunjung</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Interactive Quick Reader Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-charcoal/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-canvas-primary border border-border-subtle rounded-lg max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto">
            {/* Modal Header */}
            <div className="p-4 sm:p-6 border-b border-border-subtle flex items-center justify-between bg-canvas-secondary/70">
              <div className="flex items-center gap-3">
                <span className="text-[10px] uppercase font-semibold tracking-wider text-text-muted bg-canvas-primary border border-border-subtle px-2 py-0.5 rounded-sm">
                  {activeArticle.category}
                </span>
                <span className="text-xs text-text-muted flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {activeArticle.readTime}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleShare(activeArticle)}
                  className="p-1.5 text-text-muted hover:text-text-primary hover:bg-canvas-primary rounded-md border border-border-subtle transition-colors flex items-center gap-1 text-xs px-2.5"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-accent-warm" />
                      <span>Link Disalin</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Bagikan</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveArticle(null)}
                  className="p-1.5 text-text-muted hover:text-text-primary hover:bg-canvas-primary rounded-md border border-border-subtle transition-colors"
                  aria-label="Tutup jendela baca"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Scrollable Content */}
            <div className="p-6 sm:p-10 overflow-y-auto space-y-8 text-text-primary font-sans leading-relaxed">
              {/* Article Headings */}
              <div className="space-y-3 border-b border-border-subtle pb-6">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary leading-tight">
                  {activeArticle.title}
                </h1>
                <p className="text-base font-medium text-text-muted">
                  {activeArticle.subtitle}
                </p>

                {/* Author Info */}
                <div className="flex items-center gap-3 pt-3">
                  <div className="w-9 h-9 rounded-full bg-canvas-secondary border border-border-subtle flex items-center justify-center font-mono text-xs font-bold text-text-primary">
                    {activeArticle.author.avatarInitials}
                  </div>
                  <div className="text-xs">
                    <p className="font-semibold text-text-primary">
                      {activeArticle.author.name}
                    </p>
                    <p className="text-text-muted">
                      {activeArticle.author.role} • {activeArticle.publishedAt}
                    </p>
                  </div>
                </div>
              </div>

              {/* Lead Intro Paragraph */}
              <p className="text-base sm:text-lg text-text-primary font-normal leading-relaxed italic border-l-2 border-accent-warm pl-4">
                {activeArticle.content.intro}
              </p>

              {/* Key Takeaway Callout */}
              <div className="p-5 bg-canvas-secondary border border-border-subtle rounded-md space-y-1.5">
                <span className="text-[10px] uppercase font-semibold tracking-wider text-text-muted block">
                  Key Takeaway
                </span>
                <p className="text-xs sm:text-sm font-medium text-text-primary italic leading-relaxed">
                  &ldquo;{activeArticle.keyTakeaway}&rdquo;
                </p>
              </div>

              {/* Article Sections */}
              <div className="space-y-8">
                {activeArticle.content.sections.map((section, sIdx) => (
                  <div key={sIdx} className="space-y-4">
                    <h2 className="text-lg sm:text-xl font-bold tracking-tight text-text-primary">
                      {section.heading}
                    </h2>

                    <div className="space-y-3 text-sm text-[#444440] leading-relaxed">
                      {section.body.map((p, pIdx) => (
                        <p key={pIdx}>{p}</p>
                      ))}
                    </div>

                    {section.pullQuote && (
                      <div className="my-6 p-5 bg-canvas-secondary border border-border-subtle rounded-md space-y-2">
                        <Quote className="w-5 h-5 text-accent-warm opacity-60" />
                        <blockquote className="text-sm font-medium text-text-primary italic leading-relaxed">
                          &ldquo;{section.pullQuote}&rdquo;
                        </blockquote>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Conclusion */}
              <div className="pt-6 border-t border-border-subtle space-y-2 bg-canvas-secondary/40 p-5 rounded-md">
                <h3 className="text-xs uppercase font-semibold tracking-wider text-text-muted">
                  Catatan Penutup
                </h3>
                <p className="text-sm text-text-primary leading-relaxed">
                  {activeArticle.content.conclusion}
                </p>
              </div>

              {/* Tags & Action */}
              <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-border-subtle">
                <div className="flex flex-wrap items-center gap-1.5">
                  {activeArticle.tags.map((t) => (
                    <span
                      key={t}
                      className="text-[11px] px-2 py-0.5 rounded-sm bg-canvas-secondary border border-border-subtle text-text-muted"
                    >
                      #{t}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    href={`/articles/${activeArticle.slug}`}
                    className="px-4 py-2 text-xs font-semibold bg-charcoal text-white rounded-md hover:bg-[#3A3A37] transition-colors inline-flex items-center gap-1.5"
                  >
                    <span>Buka Halaman Lengkap</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
