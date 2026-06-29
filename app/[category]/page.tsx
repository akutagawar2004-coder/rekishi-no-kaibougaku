import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getAllCategories, getSeriesByCategory } from "@/lib/content";
import SeriesCard from "@/components/SeriesCard";

type Props = { params: Promise<{ category: string }> };

export async function generateStaticParams() {
  return getAllCategories().map((c) => ({ category: c.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: categoryId } = await params;
  const categories = getAllCategories();
  const cat = categories.find((c) => c.id === categoryId);
  if (!cat) return {};
  return { title: cat.label, description: `${cat.label}のシリーズ一覧` };
}

export default async function CategoryPage({ params }: Props) {
  const { category: categoryId } = await params;
  const categories = getAllCategories();
  const cat = categories.find((c) => c.id === categoryId);
  if (!cat) notFound();

  const seriesList = getSeriesByCategory(categoryId);

  return (
    <main>
      {/* Header */}
      <section
        className="px-6 py-12"
        style={{ borderBottom: "1px solid var(--color-gold-light)" }}
      >
        <div className="mx-auto max-w-[720px]">
          {/* Breadcrumb */}
          <nav className="mb-4 flex items-center gap-2 text-xs" style={{ color: "var(--color-muted)", fontFamily: "var(--font-source-sans-3)" }}>
            <Link href="/" className="hover:underline">トップ</Link>
            <span>/</span>
            <span>{cat.label}</span>
          </nav>
          <h1
            className="text-4xl font-bold"
            style={{
              fontFamily: "var(--font-noto-serif-jp)",
              color: "var(--color-ink)",
            }}
          >
            {cat.label}
          </h1>
          <div className="mt-4 h-px w-16" style={{ background: "var(--color-gold)" }} />
        </div>
      </section>

      {/* Series List */}
      <div className="mx-auto max-w-[720px] px-6 py-10">
        {seriesList.length === 0 ? (
          <p className="text-center text-base" style={{ color: "var(--color-muted)" }}>
            このカテゴリにはまだシリーズがありません。
          </p>
        ) : (
          <div className="space-y-4">
            {seriesList.map((s) => (
              <SeriesCard key={s.id} series={s} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
