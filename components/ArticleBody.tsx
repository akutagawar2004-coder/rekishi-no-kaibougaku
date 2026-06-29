import { BodyBlock } from "@/lib/content";

type Props = {
  blocks: BodyBlock[];
  accentColor: string;
};

export default function ArticleBody({ blocks, accentColor }: Props) {
  return (
    <div className="space-y-6">
      {blocks.map((block, i) => {
        if (block.type === "paragraph") {
          return (
            <p
              key={i}
              style={{
                fontFamily: "var(--font-lora), var(--font-noto-serif-jp), serif",
                fontSize: "16px",
                lineHeight: "1.9",
                color: "var(--color-ink)",
              }}
            >
              {block.text}
            </p>
          );
        }

        if (block.type === "callout") {
          return (
            <div
              key={i}
              className="rounded-[4px] p-4"
              style={{
                background: "var(--color-surface)",
                borderLeft: `3px solid ${accentColor}`,
              }}
            >
              <p
                className="mb-1 text-sm font-bold"
                style={{
                  fontFamily: "var(--font-noto-serif-jp)",
                  color: accentColor,
                }}
              >
                {block.title}
              </p>
              <p
                className="text-sm leading-relaxed"
                style={{
                  fontFamily: "var(--font-lora), var(--font-noto-serif-jp), serif",
                  color: "var(--color-ink-secondary)",
                }}
              >
                {block.text}
              </p>
            </div>
          );
        }

        if (block.type === "scene_break") {
          return (
            <div
              key={i}
              className="py-4 text-center tracking-widest"
              style={{ color: "var(--color-muted)" }}
            >
              · · ·
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}
