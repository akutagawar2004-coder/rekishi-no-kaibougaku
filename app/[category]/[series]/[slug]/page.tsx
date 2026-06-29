import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import {
  getAllCategories,
  getPublishedArticles,
  getArticleBySlug,
  getSeriesById,
  getNextArticle,
} from "@/lib/content";
import ArticleBody from "@/components/ArticleBody";
import FactsGrid from "@/components/FactsGrid";
import NextEpisodeCard from "@/components/NextEpisodeCard";

type Props = { params: Promise<{ category: string; series: string; slug: string }> };

export async function generateStaticParams() {
  return getPublishedArticles().map((a) => {
    const series = getSeriesById(a.series);
    return { category: series?.category ?? "", series: a.series, slug: a.slug };
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { series, slug, category } = await params;
  const article = getArticleBySlug(series, slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      images: [
        {
          url: `/api/og?title=${encodeURIComponent(article.title)}&series=${encodeURIComponent(series)}`,
        },
      ],
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { category: categoryId, series: seriesId, slug } = await params;
  const article = getArticleBySlug(seriesId, slug);
  if (!article) notFound();

  const seriesData = getSeriesById(seriesId);
  if (!seriesData || seriesData.category !== categoryId) notFound();

  const categories = getAllCategories();
  const cat = categories.find((c) => c.id === categoryId);

  const nextArticle = getNextArticle(seriesId, article.episode);
  const accentColor = seriesData.accentColor;

  return (
    <main>
      {/* Series Bar */}
      <div className="px-6 py-3" style={{ background: accentColor }}>
        <div className="mx-auto max-w-[720px]">
          <p
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ fontFamily: "var(--font-source-sans-3)", color: seriesData.accentColorLight }}
          >
            {seriesData.label} — 第{article.episode}話
          </p>
        </div>
      </div>

      <article className="mx-auto max-w-[720px] px-6 py-10">
        {/* Breadcrumb */}
        <nav
          className="mb-6 flex items-center gap-2 text-xs"
          style={{ color: "var(--color-muted)", fontFamily: "var(--font-source-sans-3)" }}
        >
          <Link href="/" className="hover:underline">トップ</Link>
          <span>/</span>
          {cat && <Link href={`/${categoryId}`} className="hover:underline">{cat.label}</Link>}
          {cat && <span>/</span>}
          <Link href={`/${categoryId}/${seriesId}`} className="hover:underline">{seriesData.label}</Link>
          <span>/</span>
          <span>第{article.episode}話</span>
        </nav>

        {/* Kicker */}
        <p
          className="mb-3 text-xs font-semibold uppercase tracking-widest"
          style={{ fontFamily: "var(--font-source-sans-3)", color: accentColor }}
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
        <p className="mt-4 text-base leading-relaxed" style={{ color: "var(--color-ink-secondary)" }}>
          {article.description}
        </p>

        {/* Meta */}
        <div
          className="mt-5 flex flex-wrap gap-4 text-sm"
          style={{ fontFamily: "var(--font-source-sans-3)", color: "var(--color-muted)" }}
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
        <div className="my-8 h-px" style={{ background: "var(--color-gold)" }} />

        {/* Hero Image */}
        {article.imageUrl && (
          <figure className="mb-8">
            <div className="overflow-hidden rounded-[4px]">
              <Image
                src={article.imageUrl}
                alt={article.imageAlt ?? article.title}
                width={720}
                height={480}
                className="w-full object-cover"
              />
            </div>
            {article.imageAlt && (
              <figcaption
                className="mt-2 text-center"
                style={{
                  fontFamily: "var(--font-source-sans-3)",
                  fontSize: "12px",
                  color: "var(--color-muted)",
                }}
              >
                {article.imageAlt}
              </figcaption>
            )}
          </figure>
        )}

        {/* Body */}
        <ArticleBody blocks={article.body} accentColor={accentColor} />

        {/* Facts */}
        {article.facts.length > 0 && (
          <div className="mt-10">
            <p
              className="mb-3 text-xs font-semibold uppercase tracking-widest"
              style={{ fontFamily: "var(--font-source-sans-3)", color: "var(--color-muted)" }}
            >
              Key Facts
            </p>
            <FactsGrid facts={article.facts} />
          </div>
        )}

        {/* Next Episode */}
        {nextArticle && (
          <div className="mt-10">
            <div className="mb-4 h-px" style={{ background: "var(--color-gold-light)" }} />
            <NextEpisodeCard
              article={nextArticle}
              category={categoryId}
              accentColor={accentColor}
            />
          </div>
        )}
      </article>
    </main>
  );
}
