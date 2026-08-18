import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ARTICLES_DATA, Article } from "@/data/articles";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Calendar,
  Quote,
  Sparkles,
  BookOpen,
  Share2,
} from "lucide-react";
import { ArticleShareButton } from "./ArticleShareButton";

interface ArticleDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return ARTICLES_DATA.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({
  params,
}: ArticleDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = ARTICLES_DATA.find((a) => a.slug === slug);

  if (!article) {
    return {
      title: "Artikel Tidak Ditemukan - Coffee And Beyond",
    };
  }

  return {
    title: `${article.title} | The Beyond Journal`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      publishedTime: article.publishedAt,
      authors: [article.author.name],
    },
  };
}

export default async function ArticleDetailPage({
  params,
}: ArticleDetailPageProps) {
  const { slug } = await params;
  const articleIndex = ARTICLES_DATA.findIndex((a) => a.slug === slug);

  if (articleIndex === -1) {
    notFound();
  }

  const article = ARTICLES_DATA[articleIndex];
  const relatedArticles = ARTICLES_DATA.filter((a) => a.slug !== slug).slice(0, 2);
  const prevArticle = articleIndex > 0 ? ARTICLES_DATA[articleIndex - 1] : null;
  const nextArticle =
    articleIndex < ARTICLES_DATA.length - 1
      ? ARTICLES_DATA[articleIndex + 1]
      : null;

  return (
    <div className="min-h-screen flex flex-col bg-canvas-primary text-text-primary">
      <Navbar />

      <main className="flex-1">
        {/* Article Breadcrumb & Back Action Bar */}
        <section className="w-full bg-canvas-secondary border-b border-border-subtle py-4">
          <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <Link
              href="/articles"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-text-primary transition-colors py-1 group"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
              <span>← Back to Articles</span>
            </Link>

            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-semibold tracking-wider text-text-muted bg-canvas-primary border border-border-subtle px-2 py-0.5 rounded-sm">
                {article.category}
              </span>
              <ArticleShareButton title={article.title} />
            </div>
          </div>
        </section>

        {/* Article Hero & Header */}
        <article className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
          <header className="space-y-5 border-b border-border-subtle pb-8">
            <div className="flex flex-wrap items-center gap-3 text-xs text-text-muted">
              <div className="flex items-center gap-1.5 font-medium text-text-primary">
                <Calendar className="w-3.5 h-3.5 text-accent-warm" />
                <span>{article.publishedAt}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{article.readTime}</span>
              </div>
              {article.featured && (
                <>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-accent-warm">
                    <Sparkles className="w-3 h-3" />
                    Cover Story
                  </span>
                </>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-[42px] font-bold tracking-tight text-text-primary leading-[1.2]">
              {article.title}
            </h1>

            <p className="text-base sm:text-lg text-text-muted leading-relaxed font-normal">
              {article.subtitle}
            </p>

            {/* Author Profile */}
            <div className="flex items-center gap-3 pt-4">
              <div className="w-10 h-10 rounded-full bg-canvas-secondary border border-border-subtle flex items-center justify-center font-mono text-xs font-bold text-text-primary shadow-2xs">
                {article.author.avatarInitials}
              </div>
              <div className="text-xs">
                <p className="font-semibold text-text-primary">
                  {article.author.name}
                </p>
                <p className="text-text-muted">
                  {article.author.role} • The Beyond Journal
                </p>
              </div>
            </div>
          </header>

          {/* Key Takeaway Callout Card */}
          <section className="bg-canvas-secondary border-l-4 border-l-accent-warm border border-border-subtle rounded-r-lg p-5 sm:p-6 space-y-2 shadow-2xs">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
              <Sparkles className="w-3.5 h-3.5 text-accent-warm" />
              <span>Key Takeaway</span>
            </div>
            <p className="text-sm sm:text-base font-medium text-text-primary italic leading-relaxed">
              &ldquo;{article.keyTakeaway}&rdquo;
            </p>
          </section>

          {/* Article Body Content */}
          <div className="space-y-8 text-text-primary text-sm sm:text-base leading-[1.8] font-sans">
            {/* Lead Intro */}
            <p className="text-base sm:text-lg text-text-primary font-normal leading-relaxed italic bg-canvas-secondary/40 p-5 rounded-lg border border-border-subtle">
              {article.content.intro}
            </p>

            {/* Content Sections */}
            <div className="space-y-10 pt-4">
              {article.content.sections.map((section, idx) => (
                <section key={idx} className="space-y-4">
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary pt-2">
                    {section.heading}
                  </h2>

                  <div className="space-y-4 text-[#3A3A36] leading-relaxed">
                    {section.body.map((paragraph, pIdx) => (
                      <p key={pIdx}>{paragraph}</p>
                    ))}
                  </div>

                  {section.pullQuote && (
                    <div className="my-6 p-6 bg-canvas-secondary border border-border-subtle rounded-lg space-y-2.5">
                      <Quote className="w-6 h-6 text-accent-warm opacity-70" />
                      <blockquote className="text-base sm:text-lg font-medium text-text-primary italic leading-relaxed">
                        &ldquo;{section.pullQuote}&rdquo;
                      </blockquote>
                    </div>
                  )}
                </section>
              ))}
            </div>

            {/* Closing Reflection / Conclusion */}
            <div className="mt-10 p-6 bg-canvas-secondary border border-border-subtle rounded-lg space-y-2">
              <h3 className="text-xs uppercase font-semibold tracking-wider text-text-muted">
                Catatan Penutup
              </h3>
              <p className="text-sm sm:text-base text-text-primary leading-relaxed">
                {article.content.conclusion}
              </p>
            </div>

            {/* Tags & Footnote */}
            <div className="pt-6 border-t border-border-subtle flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-1.5">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2.5 py-1 rounded-sm bg-canvas-secondary border border-border-subtle text-text-muted font-mono"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <Link
                href="/menu"
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 bg-charcoal text-white rounded-md hover:bg-[#3A3A37] transition-colors"
              >
                <span>Cicipi Racikan Kami</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Previous / Next Article Navigation */}
          <nav aria-label="Navigasi Artikel" className="pt-10 border-t border-border-subtle grid grid-cols-1 sm:grid-cols-2 gap-4">
            {prevArticle ? (
              <Link
                href={`/articles/${prevArticle.slug}`}
                className="p-4 bg-canvas-secondary border border-border-subtle rounded-lg hover:border-[#D0D0CA] transition-colors flex flex-col justify-between group space-y-2"
              >
                <span className="text-[10px] uppercase font-semibold tracking-wider text-text-muted flex items-center gap-1">
                  <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                  Artikel Sebelumnya
                </span>
                <span className="text-xs sm:text-sm font-bold text-text-primary group-hover:text-charcoal line-clamp-2">
                  {prevArticle.title}
                </span>
              </Link>
            ) : (
              <div className="hidden sm:block" />
            )}

            {nextArticle && (
              <Link
                href={`/articles/${nextArticle.slug}`}
                className="p-4 bg-canvas-secondary border border-border-subtle rounded-lg hover:border-[#D0D0CA] transition-colors flex flex-col justify-between group space-y-2 text-right sm:text-right"
              >
                <span className="text-[10px] uppercase font-semibold tracking-wider text-text-muted flex items-center justify-end gap-1">
                  Artikel Berikutnya
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </span>
                <span className="text-xs sm:text-sm font-bold text-text-primary group-hover:text-charcoal line-clamp-2">
                  {nextArticle.title}
                </span>
              </Link>
            )}
          </nav>

          {/* Related Articles Section */}
          <section className="pt-10 border-t border-border-subtle space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-text-primary">
                Baca Cerita Lainnya
              </h3>
              <Link
                href="/articles"
                className="text-xs font-semibold text-text-muted hover:text-text-primary"
              >
                Lihat Semua Artikel →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedArticles.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/articles/${rel.slug}`}
                  className="p-5 bg-canvas-primary border border-border-subtle rounded-lg hover:border-[#D0D0CA] transition-colors space-y-2 block group shadow-2xs"
                >
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-text-muted">
                    <span>{rel.category}</span>
                    <span>{rel.readTime}</span>
                  </div>
                  <h4 className="text-sm font-bold text-text-primary group-hover:text-charcoal line-clamp-2">
                    {rel.title}
                  </h4>
                  <p className="text-xs text-text-muted line-clamp-2">
                    {rel.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        </article>
      </main>

      <Footer />
    </div>
  );
}
