import fs from "fs";
import path from "path";

export type Series = {
  id: string;
  label: string;
  englishLabel: string;
  description: string;
  accentColor: string;
  accentColorLight: string;
  status: "active" | "coming_soon";
  order: number;
};

export type BodyBlock =
  | { type: "paragraph"; text: string }
  | { type: "callout"; title: string; text: string }
  | { type: "scene_break" };

export type Fact = { num: string; label: string };

export type Article = {
  series: string;
  episode: number;
  slug: string;
  title: string;
  kicker: string;
  description: string;
  readingTime: number;
  era: string;
  location: string;
  tags: string[];
  facts: Fact[];
  body: BodyBlock[];
  publishedAt: string | null;
  seriesComplete: boolean;
};

const contentDir = path.join(process.cwd(), "content");

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf-8")) as T;
}

export function getAllSeries(): Series[] {
  const dir = path.join(contentDir, "series");
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));
  return files
    .map((f) => readJson<Series>(path.join(dir, f)))
    .sort((a, b) => a.order - b.order);
}

export function getSeriesById(id: string): Series | null {
  const filePath = path.join(contentDir, "series", `${id}.json`);
  if (!fs.existsSync(filePath)) return null;
  return readJson<Series>(filePath);
}

function getAllArticles(): Article[] {
  const dir = path.join(contentDir, "articles");
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));
  return files.map((f) => readJson<Article>(path.join(dir, f)));
}

export function getPublishedArticles(seriesId?: string): Article[] {
  return getAllArticles()
    .filter((a) => a.publishedAt !== null)
    .filter((a) => (seriesId ? a.series === seriesId : true))
    .sort(
      (a, b) =>
        new Date(b.publishedAt!).getTime() - new Date(a.publishedAt!).getTime()
    );
}

export function getArticleBySlug(
  series: string,
  slug: string
): Article | null {
  const all = getAllArticles();
  const article = all.find((a) => a.series === series && a.slug === slug);
  if (!article || article.publishedAt === null) return null;
  return article;
}

export function getNextArticle(
  series: string,
  episode: number
): Article | null {
  const published = getPublishedArticles(series).sort(
    (a, b) => a.episode - b.episode
  );
  return published.find((a) => a.episode > episode) ?? null;
}
