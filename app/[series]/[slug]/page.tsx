import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getPublishedArticles,
  getArticleBySlug,
  getSeriesById,
  getNextArticle,
} from "@/lib/content";
import ArticleBody from "@/components/ArticleBody";
import FactsGrid from "@/components/FactsGrid";
import NextEpisodeCard from "@/components/NextEpisodeCard";

type Props = { params: Promise<{ series: string; slug: string }> };

export async function generateStaticParams() {
  return getPublishedArticles().map((a) => ({
    series: a.series,
    slug: a.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { series, slug } = await params;
  const article = getArticleBySlug(series, slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      images: [{ url: `/api/og?title=${encodeURIComponent(article.title)}&series=${encodeURIComponent(series)}` }],
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { series: seriesId, slug } = await params;
  const article = getArticleBySlug(seriesId, slug);
  if (!article) notFound();

  const seriesData = getSeriesById(seriesId);
  if (!seriesData) notFound();

  const nextArticle = getNextArticle(seriesId, article.episode);
  const accentColor = seriesData.accentColor;

  return (
    <main>
      {/* Series Bar */}
      <div
        className="px-6 py-3"
        style={{ background: accentColor }}
      >
        <div className="mx-auto max-w-[720px]">
          <p
            className="text-xs font-semibold uppercase tracking-widest"
            style={{
              fontFamily: "var(--font-source-sans-3)",
              color: seriesData.accentColorLight,
            }}
          >
            {seriesData.label} — 第{article.episode}話
          </p>
        </div>
      </div>

      <article className="mx-auto max-w-[720px] px-6 py-10">
        {/* Kicker */}
        <p
          className="mb-3 text-xs font-semibold uppercase tracking-widest"
          style={{
            fontFamily: "var(--font-source-sans-3)",
            color: accentColor,
          }}
        >
          {article.kicker}
        </p>

        {/* Title */}
        <h1
          className="text-3xl font-bold leading-tight md:text-4xl"
          style={{
            fontFamily: "var(--font-eb-garamond), var(--font-noto-serif-jp), serif",
            color: "var(--color-ink)",
          }}
        >
          {article.title}
        </h1>

        {/* Description */}
        <p
          className="mt-4 text-base leading-relaxed"
          style={{ color: "var(--color-ink-secondary)" }}
        >
          {article.description}
        </p>

        {/* Meta */}
        <div
          className="mt-5 flex flex-wrap gap-4 text-sm"
          style={{
            fontFamily: "var(--font-source-sans-3)",
            color: "var(--color-muted)",
          }}
        >
          <span>📖 {article.readingTime}分で読める</span>
          <span>🕰 {article.era}</span>
          <span>📍 {article.location}</span>
        </div>

        {/* Tags */}
        <div className="mt-4 flex flex-wrap gap-2">
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-[4px] px-2 py-0.5 text-xs"
              style={{
                fontFamily: "var(--font-source-sans-3)",
                background: "var(--color-surface)",
                color: "var(--color-ink-secondary)",
                border: "1px solid var(--color-gold-light)",
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Divider */}
        <div
          className="my-8 h-px"
          style={{ background: "var(--color-gold)" }}
        />

        {/* Body */}
        <ArticleBody blocks={article.body} accentColor={accentColor} />

        {/* Facts */}
        {article.facts.length > 0 && (
          <div className="mt-10">
            <p
              className="mb-3 text-xs font-semibold uppercase tracking-widest"
              style={{
                fontFamily: "var(--font-source-sans-3)",
                color: "var(--color-muted)",
              }}
            >
              Key Facts
            </p>
            <FactsGrid facts={article.facts} />
          </div>
        )}

        {/* Next Episode */}
        {nextArticle && (
          <div className="mt-10">
            <div
              className="mb-4 h-px"
              style={{ background: "var(--color-gold-light)" }}
            />
            <NextEpisodeCard article={nextArticle} accentColor={accentColor} />
          </div>
        )}
      </article>
    </main>
  );
}
