import Link from "next/link";
import { getAllSeries, getPublishedArticles } from "@/lib/content";
import SeriesCard from "@/components/SeriesCard";

export default function HomePage() {
  const allSeries = getAllSeries();
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
              fontFamily: "var(--font-eb-garamond), var(--font-noto-serif-jp), serif",
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
              fontFamily: "var(--font-lora), var(--font-noto-serif-jp), serif",
              color: "var(--color-ink-secondary)",
            }}
          >
            歴史は、解剖すると面白い。
          </p>
        </div>
      </section>

      {/* Series List */}
      <section className="mx-auto max-w-[720px] px-6 py-12">
        <h2
          className="mb-6 text-xs font-semibold uppercase tracking-widest"
          style={{
            fontFamily: "var(--font-source-sans-3)",
            color: "var(--color-muted)",
          }}
        >
          Series
        </h2>
        <div className="space-y-4">
          {allSeries.map((s) => (
            <SeriesCard key={s.id} series={s} />
          ))}
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
            {latestArticles.map((article) => (
              <Link
                key={article.slug}
                href={`/${article.series}/${article.slug}`}
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
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
