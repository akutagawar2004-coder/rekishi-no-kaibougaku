#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const isDryRun = process.argv.includes("--dry-run");
const contentDir = path.join(process.cwd(), "content");
const articlesDir = path.join(contentDir, "articles");
const pauseFile = path.join(contentDir, "schedule-paused.json");

// 1. 一時停止チェック
if (fs.existsSync(pauseFile)) {
  console.log("自動投稿は一時停止中です");
  process.exit(0);
}

// 2. 全記事を読み込む
const articleFiles = fs
  .readdirSync(articlesDir)
  .filter((f) => f.endsWith(".json"));

const articles = articleFiles.map((f) => {
  const filePath = path.join(articlesDir, f);
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  return { ...data, _filePath: filePath };
});

// 3. 未公開記事をepisode順に並べ、最若番を取得
const unpublished = articles
  .filter((a) => a.publishedAt === null)
  .sort((a, b) => a.episode - b.episode);

if (unpublished.length === 0) {
  console.log("投稿可能な記事がありません");
  process.exit(0);
}

const target = unpublished[0];
const next = unpublished[1] ?? null;

console.log(
  `対象記事: [${target.series}] 第${target.episode}話 - ${target.title}`
);

// dry-runはここで終了
if (isDryRun) {
  console.log("[dry-run] コミットはスキップします");
  if (next) {
    console.log(
      `次回予定: [${next.series}] 第${next.episode}話 - ${next.title}`
    );
  } else {
    console.log("次回予定: なし（これが最後の未公開記事）");
  }
  process.exit(0);
}

// 4. publishedAt を書き込む
const now = new Date().toISOString();
const updated = { ...target };
delete updated._filePath;
updated.publishedAt = now;
fs.writeFileSync(target._filePath, JSON.stringify(updated, null, 2) + "\n");

// 5. コミット・プッシュ
const commitMsg = `publish: ${target.series} ep${target.episode} - ${target.title}`;
execSync('git config user.name "github-actions[bot]"');
execSync(
  'git config user.email "github-actions[bot]@users.noreply.github.com"'
);
execSync(`git add "${target._filePath}"`);
execSync(`git commit -m "${commitMsg}"`);
execSync("git push");

// 6. 完了ログ
console.log("✓ 投稿完了");
console.log(`  実行日時: ${now}`);
console.log(`  記事タイトル: ${target.title}`);
if (next) {
  console.log(`  次回予定: ${next.title}`);
} else {
  console.log("  次回予定: なし");
}

// seriesComplete 検知 → GitHub Issue作成
if (target.seriesComplete) {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPOSITORY;
  if (!token || !repo) {
    console.log("GITHUB_TOKEN or GITHUB_REPOSITORY が未設定のためIssue作成をスキップ");
    process.exit(0);
  }

  const issueBody = {
    title: "【歴史の解剖学】シリーズ完結：次のシリーズを選んでください",
    body: [
      `## シリーズ完結通知`,
      ``,
      `- **シリーズ**: ${target.series}`,
      `- **最終話**: ${target.title}`,
      `- **完結日時**: ${now}`,
      ``,
      `次に追加するシリーズを選んで、\`content/series/\` にJSONを追加してください。`,
    ].join("\n"),
  };

  fetch(`https://api.github.com/repos/${repo}/issues`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    body: JSON.stringify(issueBody),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(`✓ Issue作成: ${data.html_url}`);
    })
    .catch((err) => {
      console.error("Issue作成に失敗しました:", err);
    });
}
