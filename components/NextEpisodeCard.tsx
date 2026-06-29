import Link from "next/link";
import { Article } from "@/lib/content";

type Props = {
  article: Article;
  category: string;
  accentColor: string;
};

export default function NextEpisodeCard({ article, category, accentColor }: Props) {
  return (
    <Link
      href={`/${category}/${article.series}/${article.slug}`}
      className="block rounded-[4px] border p-5 transition-opacity hover:opacity-80"
      style={{
        background: "var(--color-surface)",
        borderColor: "var(--color-gold-light)",
      }}
    >
      <p
        className="mb-2 text-xs font-semibold uppercase tracking-widest"
        style={{
          fontFamily: "var(--font-source-sans-3)",
          color: accentColor,
        }}
      >
        Next Episode — 第{article.episode}話
      </p>
      <p
        className="text-lg font-bold leading-snug"
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
      <p
        className="mt-3 text-sm font-semibold"
        style={{
          fontFamily: "var(--font-source-sans-3)",
          color: accentColor,
        }}
      >
        続きを読む →
      </p>
    </Link>
  );
}
