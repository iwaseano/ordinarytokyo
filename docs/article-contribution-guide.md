# 記事追加ガイド（共同執筆者向け）

Ordinary Tokyoの記事を追加する手順です。記事本文とサイト表示は英語で書き、Front Matterの項目・型は既存スキーマに合わせてください。スキーマは[記事スキーマ](../src/content.config.ts)、分類とチェーンIDは[サイト設定](../src/data/site.ts)で確認できます。

## 1. 作業ブランチを作る

リポジトリへの書き込み権限がある場合はcloneし、`dev`から記事用ブランチを作成します。権限がない場合は、リポジトリの設定で許可されていればforkし、完成後に`dev`宛てのPull Requestを作成してください。

```sh
git clone https://github.com/iwaseano/ordinarytokyo.git
cd ordinarytokyo
git switch dev
git pull --ff-only origin dev
git switch -c feature/article-<slug>
```

`<slug>`は記事のURL用識別子に置き換えます。英小文字・数字・ハイフンを使い、例は`feature/article-konbini-checkout`です。

## 2. 記事と画像を追加する

- 記事を`src/content/articles/<slug>.md`に作成します。ファイル名とFront Matterの`slug`は一致させます。
- ヒーロー画像は`src/assets/articles/<slug>/images/`に置き、`heroImage`には`./images/<filename>`を指定します。
- 本文画像も同じ画像フォルダーに置きます。Markdownからは`../../assets/articles/<slug>/images/<filename>`で参照します。
- 写真は自分で撮影したもの、または利用権を確認したものに限ります。実際に訪問・確認していない情報を実体験として書かないでください。

## 3. Front Matterを記入する

以下は項目の形を示す雛形です。日付・価格・場所・フレーズを実際の内容に置き換え、サンプル記事のダミー測定値を流用しないでください。`description`は120〜160文字です。未公開の記事は`draft: true`にします。

```yaml
---
title: "Article title"
slug: article-slug
description: "A practical guide to everyday Tokyo, with verified prices, useful Japanese phrases, and clear steps for navigating a local experience with confidence."
stage: first-trip
domain: infrastructure
tags: [topic, chain]
chain: [seven-eleven]
publishedAt: "YYYY-MM-DD"
updatedAt: "YYYY-MM-DD"
checkedAt: "YYYY-MM-DD"
heroImage: "./images/hero.webp"
heroAlt: "Accurate description of the image"
draft: true
measured:
  - item: "Item or service checked"
    priceJpy: 250
    place: "Chain and location"
    note: "What was measured and any limitations"
phrasesAsked:
  - jp: "質問される文句"
    romaji: "Romaji"
    en: "English meaning"
    answers:
      - jp: "回答"
        romaji: "Romaji"
        en: "English meaning"
phrasesSay:
  - jp: "伝える文句"
    romaji: "Romaji"
    en: "English meaning"
    situation: "When to say or show this"
affiliateLinks: []
faq: []
---
```

`YYYY-MM-DD`、価格、文言は例示です。公開前に実データへ置き換えてください。`measured`、`phrasesAsked`、`phrasesSay`はそれぞれ1件以上必要です。`phrasesAsked`には1つ以上の回答を含めます。Front Matterはstrict検証されるため、独自のキーを追加するとビルドに失敗します。

- `stage`は`first-trip`、`repeat`、`live-like-local`から選びます。
- `domain`は`food`、`shopping`、`infrastructure`、`local-places`から選びます。新しいdomainが必要なら、記事を追加する前に担当者へ相談してください。
- `chain`は[サイト設定](../src/data/site.ts)にあるIDを使います。新しいチェーンの追加も担当者と調整してください。
- `affiliateLinks`にはURLを直接書かず、[リンクID一覧](../src/data/affiliate-links.json)に登録済みのIDだけを指定します。提携リンクがなければ`[]`のままにします。

## 4. 記事内容を確認する

- 実測を記事の中心にし、実際に訪れたチェーンや大型店など生活動線上の場所に絞る。価格・場所・確認日を記録し、未確認事項や例外を明記する。
- フレーズだけの記事にせず、店での手順や判断を説明する。`phrasesAsked`（聞かれる文句と返答）と`phrasesSay`（伝える文句）の両方を場面の流れに沿って含める。
- First Trip向けの基本情報を十分に説明し、制度や変わりやすい情報には確認日（`checkedAt`）を記載する。
- 店舗・商品・料金・フレーズが現在も正しいか、記事本文と画像の説明文（`heroAlt`）を確認する。

## 5. ローカルで確認してPull Requestを作る

Node.jsは`package.json`記載のバージョン要件を満たすものを使います。依存関係をインストールし、型・Front Matterの検証と本番ビルドを実行してください。

```sh
npm ci
npm run check
npm run build
```

ビルド時にFront Matter違反があればエラーになります。プレビューで記事ページ、実測表、両フレーズブロック、カード画像、スマートフォン幅の表示を確認してください。カードは`phrasesSay`から自動生成されます。

```sh
git add src/content/articles/<slug>.md src/assets/articles/<slug>/
git commit -m "Add article: <slug>"
git push -u origin feature/article-<slug>
```

Pull Requestの宛先は`dev`です。本文に実測の根拠、確認日、未確認事項、`draft`の公開予定を記載し、CIとAzure Static Web Appsの`dev`プレビューが利用可能な場合はURLでも表示を確認してください。
