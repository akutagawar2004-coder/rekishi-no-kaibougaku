import Link from "next/link";
import {
  getAllCategories,
  getSeriesByCategory,
  getSeriesById,
  getPublishedArticles,
} from "@/lib/content";
import SeriesCard from "@/components/SeriesCard";

export default function HomePage() {
  const categories = getAllCategories();
  const latestArticles = getPublishedArticles().slice(0, 4);

  return (
    <main>
      {/* Hero */}
      <section
        className="px-6 py-20 text-center"
        style={{ borderBottom: "1px solid var(--color-gold-light)" }}
      >
        <div className="mx-auto max-w-[720px]">
          <h1
            className="text-5xl italic leading-tight md:text-6xl"
            style={{
              fontFamily:
                "var(--font-eb-garamond), var(--font-noto-serif-jp), serif",
              color: "var(--color-ink)",
            }}
          >
            歴史の解剖学
          </h1>
          <div
            className="mx-auto my-6 h-px w-24"
            style={{ background: "var(--color-gold)" }}
          />
          <p
            className="text-lg"
            style={{
              fontFamily:
                "var(--font-lora), var(--font-noto-serif-jp), serif",
              color: "var(--color-ink-secondary)",
            }}
          >
            歴史は、解剖すると面白い。
          </p>
        </div>
      </section>

      {/* Series grouped by category */}
      <section className="mx-auto max-w-[720px] px-6 py-12">
        <div className="space-y-12">
          {categories.map((cat) => {
            const seriesList = getSeriesByCategory(cat.id);
            if (seriesList.length === 0) return null;
            return (
              <div key={cat.id}>
                <Link
                  href={`/${cat.id}`}
                  className="mb-4 flex items-center gap-3 group"
                >
                  <h2
                    className="text-xs font-semibold uppercase tracking-widest group-hover:underline"
                    style={{
                      fontFamily: "var(--font-source-sans-3)",
                      color: "var(--color-muted)",
                    }}
                  >
                    {cat.label}
                  </h2>
                  <div
                    className="flex-1 h-px"
                    style={{ background: "var(--color-gold-light)" }}
                  />
                </Link>
                <div className="space-y-4">
                  {seriesList.map((s) => (
                    <SeriesCard key={s.id} series={s} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Latest Articles */}
      {latestArticles.length > 0 && (
        <section
          className="mx-auto max-w-[720px] px-6 py-12"
          style={{ borderTop: "1px solid var(--color-gold-light)" }}
        >
          <h2
            className="mb-6 text-xs font-semibold uppercase tracking-widest"
            style={{
              fontFamily: "var(--font-source-sans-3)",
              color: "var(--color-muted)",
            }}
          >
            Latest
          </h2>
          <div className="space-y-4">
            {latestArticles.map((article) => {
              const series = getSeriesById(article.series);
              const href = series
                ? `/${series.category}/${article.series}/${article.slug}`
                : "#";
              return (
                <Link
                  key={article.slug}
                  href={href}
                  className="block rounded-[4px] border p-4 transition-opacity hover:opacity-80"
                  style={{
                    background: "var(--color-surface)",
                    borderColor: "var(--color-gold-light)",
                  }}
                >
                  <p
                    className="mb-1 text-xs uppercase tracking-widest"
                    style={{
                      fontFamily: "var(--font-source-sans-3)",
                      color: "var(--color-muted)",
                    }}
                  >
                    {article.kicker}
                  </p>
                  <p
                    className="font-bold leading-snug"
                    style={{
                      fontFamily: "var(--font-noto-serif-jp)",
                      color: "var(--color-ink)",
                    }}
                  >
                    {article.title}
                  </p>
                  <p
                    className="mt-1 text-sm"
                    style={{ color: "var(--color-ink-secondary)" }}
                  >
                    {article.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </main>
  );
}
