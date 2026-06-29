import Link from "next/link";
import { Series } from "@/lib/content";

type Props = { series: Series };

export default function SeriesCard({ series }: Props) {
  const isComingSoon = series.status === "coming_soon";

  return (
    <Link
      href={isComingSoon ? "#" : `/${series.category}/${series.id}`}
      className={`block rounded-[4px] border p-5 transition-opacity ${
        isComingSoon ? "cursor-default opacity-70" : "hover:opacity-90"
      }`}
      style={{
        background: "var(--color-surface)",
        borderColor: "var(--color-gold-light)",
        borderLeftWidth: "4px",
        borderLeftColor: series.accentColor,
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p
            className="mb-1 text-xs font-semibold uppercase tracking-widest"
            style={{
              fontFamily: "var(--font-source-sans-3)",
              color: series.accentColor,
            }}
          >
            {series.englishLabel}
          </p>
          <h2
            className="text-xl font-bold"
            style={{
              fontFamily: "var(--font-noto-serif-jp)",
              color: "var(--color-ink)",
            }}
          >
            {series.label}
          </h2>
          <p
            className="mt-2 text-sm leading-relaxed"
            style={{ color: "var(--color-ink-secondary)" }}
          >
            {series.description}
          </p>
        </div>
        {isComingSoon && (
          <span
            className="shrink-0 rounded-[4px] px-2 py-0.5 text-xs font-semibold"
            style={{
              fontFamily: "var(--font-source-sans-3)",
              background: "var(--color-gold-light)",
              color: "var(--color-ink-secondary)",
            }}
          >
            近日公開
          </span>
        )}
      </div>
    </Link>
  );
}
