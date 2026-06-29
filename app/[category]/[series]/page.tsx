import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  getAllCategories,
  getAllSeries,
  getSeriesById,
  getPublishedArticles,
} from "@/lib/content";

type Props = { params: Promise<{ category: string; series: string }> };

export async function generateStaticParams() {
  return getAllSeries().map((s) => ({ category: s.category, series: s.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { series: seriesId } = await params;
  const series = getSeriesById(seriesId);
  if (!series) return {};
  return { title: series.label, description: series.description };
}

export default async function SeriesPage({ params }: Props) {
  const { category: categoryId, series: seriesId } = await params;
  const series = getSeriesById(seriesId);
  if (!series || series.category !== categoryId) notFound();

  const categories = getAllCategories();
  const cat = categories.find((c) => c.id === categoryId);

  const articles = getPublishedArticles(series.id).sort(
    (a, b) => a.episode - b.episode
  );

  return (
    <main>
      {/* Series Header */}
      <section className="px-6 py-12" style={{ background: series.accentColor }}>
        <div className="mx-auto max-w-[720px]">
          {/* Breadcrumb */}
          <nav
            className="mb-4 flex items-center gap-2 text-xs opacity-70"
            style={{ color: series.accentColorLight, fontFamily: "var(--font-source-sans-3)" }}
          >
            <Link href="/" className="hover:underline">トップ</Link>
            <span>/</span>
            {cat && <Link href={`/${categoryId}`} className="hover:underline">{cat.label}</Link>}
            {cat && <span>/</span>}
            <span>{series.label}</span>
          </nav>
          <p
            className="mb-2 text-xs font-semibold uppercase tracking-widest opacity-70"
            style={{ fontFamily: "var(--font-source-sans-3)", color: series.accentColorLight }}
          >
            {series.englishLabel}
          </p>
          <h1
            className="text-4xl font-bold"
            style={{ fontFamily: "var(--font-noto-serif-jp)", color: series.accentColorLight }}
          >
            {series.label}
          </h1>
          <p className="mt-3 text-base opacity-80" style={{ color: series.accentColorLight }}>
            {series.description}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-[720px] px-6 py-10">
        {series.status === "coming_soon" ? (
          <p className="text-center text-base" style={{ color: "var(--color-muted)" }}>
            このシリーズは近日公開予定です。
          </p>
        ) : articles.length === 0 ? (
          <p className="text-center text-base" style={{ color: "var(--color-muted)" }}>
            公開済みの記事はまだありません。
          </p>
        ) : (
          <div className="space-y-4">
            {articles.map((article) => (
              <Link
                key={article.slug}
                href={`/${categoryId}/${series.id}/${article.slug}`}
                className="block rounded-[4px] border p-5 transition-opacity hover:opacity-80"
                style={{
                  background: "var(--color-surface)",
                  borderColor: "var(--color-gold-light)",
                  borderLeftWidth: "3px",
                  borderLeftColor: series.accentColor,
                }}
              >
                <p
                  className="mb-1 text-xs font-semibold uppercase tracking-widest"
                  style={{ fontFamily: "var(--font-source-sans-3)", color: series.accentColor }}
                >
                  第{article.episode}話 — {article.era}
                </p>
                <p
                  className="text-lg font-bold leading-snug"
                  style={{ fontFamily: "var(--font-noto-serif-jp)", color: "var(--color-ink)" }}
                >
                  {article.title}
                </p>
                <p className="mt-1 text-sm" style={{ color: "var(--color-ink-secondary)" }}>
                  {article.description}
                </p>
                <p className="mt-2 text-xs" style={{ color: "var(--color-muted)" }}>
                  {article.readingTime}分で読める
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
