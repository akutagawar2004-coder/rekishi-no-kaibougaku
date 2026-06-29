import { Fact } from "@/lib/content";

type Props = { facts: Fact[] };

export default function FactsGrid({ facts }: Props) {
  return (
    <div
      className="rounded-[4px] border"
      style={{
        background: "var(--color-surface)",
        borderColor: "var(--color-gold-light)",
      }}
    >
      <div className="grid grid-cols-3 divide-x" style={{ borderColor: "var(--color-gold-light)" }}>
        {facts.map((fact, i) => (
          <div key={i} className="p-4 text-center">
            <p
              className="text-2xl font-bold"
              style={{
                fontFamily: "var(--font-eb-garamond)",
                color: "var(--color-ink)",
              }}
            >
              {fact.num}
            </p>
            <p
              className="mt-1 text-xs leading-snug"
              style={{
                fontFamily: "var(--font-source-sans-3), var(--font-noto-serif-jp)",
                color: "var(--color-muted)",
              }}
            >
              {fact.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
