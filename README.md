# Ordinary Tokyo

英語圏の訪日予定者向けに、東京の日常を実測と日本語フレーズで説明する静的サイトです。Astro + TypeScript、Markdown記事、GitHub Actions、Azure Static Web Apps Standardを前提にしています。

## 開発

```sh
npm ci
npm run dev
npm run build
npm run preview
```

## Gitブランチ

- `main`: 公開用の安定ブランチ
- `dev`: ローカルでの通常作業・開発内容の統合ブランチ
- `feature`: 必要に応じて使う、独立した機能開発用ブランチ
- `release`: リリース準備・確認用ブランチ

通常は`dev`で作業します。独立した機能開発が必要な場合のみ`feature`を使い、公開前の確認は`release`で行って、公開可能な状態を`main`へ反映します。作業開始時は`git switch dev`でブランチを確認してください。

## 記事とカテゴリ

- 記事: `src/content/articles/*.md`
- 記事スキーマ: `src/content.config.ts`（Zodでビルド時検証）
- 記事作成テンプレート: `docs/article-authoring-template.md`
- stageとdomain: `src/data/site.ts`
- アフィリエイトリンクID: `src/data/affiliate-links.json`

domainは`src/data/site.ts`の`DOMAINS`に登録すると、その値がFront Matter検証とdomain一覧ページへ反映されます。後から追加・変更できます。記事のdomainを変更するときは、該当記事のFront Matterも同時に更新してください。

Front Matterの`draft: true`は本番ビルドから除外されます。開発サーバーと、`dev`へのpushおよびPRのプレビュービルドでは表示されます。プレビューURLにアクセスできる人は下書きも閲覧できます。

## 外部サービス・公開

設定手順は[デプロイと外部サービス設定](docs/deployment.md)を参照してください。認証値・アカウントIDはリポジトリに登録せず、GitHub/Azureの設定またはビルド環境から渡します。未設定の広告はプレースホルダを表示します。

サンプル記事の価格は表示確認用のダミーであり、実測価格ではありません。
