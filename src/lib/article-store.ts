"use client";

import { useState, useMemo, useCallback } from "react";
import { ARTICLES_DATA, Article, ArticleCategory } from "@/data/articles";

export const ARTICLE_CATEGORIES: Array<"All" | ArticleCategory> = [
  "All",
  "Coffee Craft",
  "Space & Lifestyle",
  "Brewing Guide",
  "Culinary Story",
];

export function getAllArticles(): Article[] {
  return ARTICLES_DATA;
}

export function getFeaturedArticle(): Article {
  return ARTICLES_DATA.find((a) => a.featured) || ARTICLES_DATA[0];
}

export function getArticleBySlug(slug: string): Article | undefined {
  if (!slug) return undefined;
  const normalized = slug.trim().toLowerCase();
  return ARTICLES_DATA.find((a) => a.slug.toLowerCase() === normalized);
}

export function getArticlesByCategory(category: string): Article[] {
  if (!category || category === "All") {
    return ARTICLES_DATA;
  }
  return ARTICLES_DATA.filter((a) => a.category === category);
}

export function searchArticles(query: string, category: string = "All"): Article[] {
  const normalizedQuery = query.trim().toLowerCase();
  let baseList = category === "All" ? ARTICLES_DATA : getArticlesByCategory(category);

  if (!normalizedQuery) {
    return baseList;
  }

  return baseList.filter((article) => {
    const matchTitle = article.title.toLowerCase().includes(normalizedQuery);
    const matchSubtitle = article.subtitle.toLowerCase().includes(normalizedQuery);
    const matchExcerpt = article.excerpt.toLowerCase().includes(normalizedQuery);
    const matchAuthor = article.author.name.toLowerCase().includes(normalizedQuery);
    const matchCategory = article.category.toLowerCase().includes(normalizedQuery);
    const matchTags = article.tags.some((tag) =>
      tag.toLowerCase().includes(normalizedQuery)
    );
    const matchKeyTakeaway = article.keyTakeaway.toLowerCase().includes(normalizedQuery);

    return (
      matchTitle ||
      matchSubtitle ||
      matchExcerpt ||
      matchAuthor ||
      matchCategory ||
      matchTags ||
      matchKeyTakeaway
    );
  });
}

export function useArticleStore() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);

  const featuredArticle = useMemo(() => getFeaturedArticle(), []);

  const filteredArticles = useMemo(() => {
    return searchArticles(searchQuery, selectedCategory);
  }, [searchQuery, selectedCategory]);

  const resetFilters = useCallback(() => {
    setSelectedCategory("All");
    setSearchQuery("");
  }, []);

  return {
    articles: ARTICLES_DATA,
    categories: ARTICLE_CATEGORIES,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    filteredArticles,
    featuredArticle,
    activeArticle,
    setActiveArticle,
    resetFilters,
  };
}
