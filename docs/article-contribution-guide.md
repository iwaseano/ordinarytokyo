# 記事追加ガイド（共同執筆者向け）

Ordinary Tokyoの記事を追加する手順です。記事本文とサイト表示は英語で書き、Front Matterの項目・型は既存スキーマに合わせてください。スキーマは[記事スキーマ](../src/content.config.ts)、分類とチェーンIDは[サイト設定](../src/data/site.ts)で確認できます。

## 1. 作業ブランチを作る

リポジトリへの書き込み権限がある場合はcloneし、`dev`から記事用ブランチを作成します。権限がない場合は、リポジトリの設定で許可されていればforkし、完成後に`dev`宛てのPull Requestを作成してください。

```sh
git clone https://github.com/iwaseano/ordinarytokyo.git
cd ordinarytokyo
git switch dev
git pull --ff-only origin dev
git switch -c feature-article-<slug>
```

`<slug>`は記事のURL用識別子に置き換えます。英小文字・数字・ハイフンを使います。既存の`feature`ブランチと名前が衝突しないよう、ブランチ名は`feature-article-<slug>`形式にします。例は`feature-article-konbini-checkout`です。

## 2. 記事と画像を追加する

- 記事を`src/content/articles/<slug>.md`に作成します。ファイル名とFront Matterの`slug`は一致させます。
- ヒーロー画像は任意です。画像がない場合や`heroImage`の参照先が見つからない場合は、共通の`public/og-default.svg`を表示します。独自画像を指定する場合は実ファイルを`src/assets/articles/<slug>/images/`に置き、`heroImage`に`./images/<filename>`、`heroAlt`に画像の説明を記入します。独自画像の参照先が見つからない場合は、共通画像に切り替えてビルドログに警告を出します。
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

`heroImage`と`heroAlt`は画像を使う場合の項目です。画像が不要なら両方を省略できます。独自画像のパスが見つからない場合も共通画像が使われます。

### 必須項目

次の項目はFront Matterから省略できません。

- 記事の基本情報: `title`、`slug`、`description`（120〜160文字）、`stage`、`domain`、`tags`、`chain`
- 日付: `publishedAt`、`updatedAt`、`checkedAt`
- 記事データ: 1件以上の`measured`、1件以上の`phrasesAsked`、1件以上の`phrasesSay`
- 各`measured`項目: `item`、`priceJpy`、`place`、`note`
- 各`phrasesAsked`項目: `jp`、`romaji`、`en`、1件以上の`answers`。各回答にも`jp`、`romaji`、`en`が必要です。
- 各`phrasesSay`項目: `jp`、`romaji`、`en`、`situation`

`draft`は省略可能で、省略時は`false`です。`affiliateLinks`と`faq`も省略可能で、省略時は空配列になります。省略する場合も含め、テンプレートを使って項目を確認してください。

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
git push -u origin feature-article-<slug>
```

Pull Requestの宛先は`dev`です。本文に実測の根拠、確認日、未確認事項、`draft`の公開予定を記載し、CIとAzure Static Web Appsの`dev`プレビューが利用可能な場合はURLでも表示を確認してください。


## 6. Pull Requestをdevにマージする

1. GitHubで記事用ブランチからPull Requestを開き、baseが`dev`、compareが`feature-article-<slug>`であることを確認します。
2. 必要なレビューとChecksが完了し、内容とプレビューを確認できたら、権限のある担当者が **Merge pull request** を選び、マージを確定します。ブランチ保護ルールやプロジェクトのレビュー方針に従ってください。
3. Pull Requestが **Merged** になり、記事が`dev`に反映されたことを確認します。`draft: true`の記事は、マージ後も本番ビルドには含まれません。

## 7. 記事用ブランチを削除する

マージ済みで、ブランチに残すべき未反映の作業がないことを確認してから削除します。

1. GitHubのマージ済みPull Request画面で **Delete branch** を選び、リモートの記事用ブランチを削除します。forkからのPull Requestでは、記事用ブランチを置いたfork側で削除します。
2. ローカルに未コミットの変更がないことを確認し、`dev`に戻って最新の状態を取得してから、ローカルの記事用ブランチを削除します。

   ```sh
   git status
   git switch dev
   git pull --ff-only origin dev
   git branch -d feature-article-<slug>
   ```

`git branch -d`が未マージを理由に削除を拒否した場合は、Pull Requestのマージ状態と未反映の変更を確認してください。Squash mergeなどでは、変更内容が`dev`に反映されていてもコミット履歴上は未マージと判定されることがあります。**PRがマージ済みで、ブランチに残すべき未反映のコミットがないことを確認できた場合に限り**、`git branch -D feature-article-<slug>`でローカルブランチを削除できます。削除後もGitHubのPull Requestと`dev`の履歴は残ります。
