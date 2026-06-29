#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const readline = require("readline");
const { execSync } = require("child_process");

const isDryRun = process.argv.includes("--dry-run");
const inputPath = path.join(__dirname, "input.json");
const contentDir = path.join(process.cwd(), "content");

// ---- ユーティリティ ----

function ask(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase());
    });
  });
}

function episodePad(n) {
  return String(n).padStart(2, "0");
}

function buildArticlePath(seriesId, episode) {
  return path.join(contentDir, "articles", `${seriesId}-${episodePad(episode)}.json`);
}

function buildSeriesPath(seriesId) {
  return path.join(contentDir, "series", `${seriesId}.json`);
}

// ---- メイン ----

async function main() {
  // 1. input.json を読み込む
  if (!fs.existsSync(inputPath)) {
    console.error("❌ scripts/input.json が見つかりません。");
    console.error("   Coworkの出力をコピーして scripts/input.json に保存してください。");
    process.exit(1);
  }

  let input;
  try {
    input = JSON.parse(fs.readFileSync(inputPath, "utf-8"));
  } catch (e) {
    console.error("❌ input.json のJSON形式が不正です:", e.message);
    process.exit(1);
  }

  if (!input.series || !input.articles) {
    console.error("❌ input.json に series または articles が含まれていません。");
    process.exit(1);
  }

  const { series, articles } = input;
  const seriesId = series.id;

  console.log(`\n📂 シリーズ: ${series.label} (${seriesId})`);
  console.log(`   記事数: ${articles.length}件\n`);

  if (isDryRun) {
    console.log("【dry-run モード — 実際の保存・プッシュは行いません】\n");
  }

  // 2. シリーズファイルの保存
  const seriesFilePath = buildSeriesPath(seriesId);
  const seriesExists = fs.existsSync(seriesFilePath);

  if (!isDryRun && seriesExists) {
    const answer = await ask(`⚠  ${path.relative(process.cwd(), seriesFilePath)} が既に存在します。上書きしますか？ (y/n): `);
    if (answer !== "y") {
      console.log("中止しました。");
      process.exit(0);
    }
  }

  const seriesData = { ...series };
  if (isDryRun) {
    console.log(`  [dry-run] シリーズ設定を保存: ${path.relative(process.cwd(), seriesFilePath)}`);
  } else {
    fs.writeFileSync(seriesFilePath, JSON.stringify(seriesData, null, 2) + "\n");
    console.log(`✅ シリーズ設定: ${path.relative(process.cwd(), seriesFilePath)}`);
  }

  // 3. 記事ファイルの保存
  const articlePaths = [];

  for (const article of articles) {
    const episode = article.episode;
    const articleFilePath = buildArticlePath(seriesId, episode);
    articlePaths.push(articleFilePath);

    // slug がなければ自動生成
    const slug = article.slug || `${seriesId}-ep${episodePad(episode)}`;

    const articleData = {
      series: seriesId,
      episode,
      slug,
      title: article.title ?? "",
      kicker: article.kicker ?? "",
      description: article.description ?? "",
      readingTime: article.readingTime ?? 5,
      era: article.era ?? "",
      location: article.location ?? "",
      tags: article.tags ?? [],
      facts: article.facts ?? [],
      body: article.body ?? [],
      publishedAt: article.publishedAt ?? null,
      seriesComplete: article.seriesComplete ?? false,
    };

    if (isDryRun) {
      console.log(`  [dry-run] 記事 第${episode}話を保存: ${path.relative(process.cwd(), articleFilePath)}`);
    } else {
      fs.writeFileSync(articleFilePath, JSON.stringify(articleData, null, 2) + "\n");
      console.log(`✅ 記事 第${episode}話: ${path.relative(process.cwd(), articleFilePath)}`);
    }
  }

  // 4. 集計ログ
  const total = 1 + articles.length;
  if (isDryRun) {
    console.log(`\n  [dry-run] 合計 ${total}件のファイルを保存する予定です`);
    console.log("  [dry-run] git push をスキップします");
    process.exit(0);
  }

  console.log(`\n📦 全${total}件のファイルを保存しました\n`);

  // 5. GitHubにプッシュ
  try {
    execSync("git add content/");
    execSync(`git commit -m "feat: add new series - ${series.label}"`);
    execSync("git push");
  } catch (e) {
    console.error("❌ git push に失敗しました:");
    console.error(e.message);
    process.exit(1);
  }

  // 6. 完了
  console.log("🚀 GitHubへのプッシュが完了しました");
  console.log("🌐 Vercelが自動デプロイを開始します");
}

main();
