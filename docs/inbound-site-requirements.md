# インバウンド英語ブログ 要件定義（叩き台）

作成日：2026-11-26／状態：叩き台（未確定の項目は「要決定」と明記）
前提：プラットフォームはB案（静的サイト）を採用済み。ツールは別サブドメイン（Azure Web Apps等）に分離。

---

## 1. 目的と範囲

- 目的：日本（主に東京）の日常を英語で解説し、AdSenseとアフィリエイトで収益化する
- 対象読者：英語圏の訪日予定者（初回が入口、リピート・疑似生活層が成長層）
- 範囲：東京の日常＋全国チェーン。観光地の名所記事は作らない
- 差別化：実測（実際に買う・使う）と、言葉が通じない前提のフレーズ標準装備

## 2. 技術構成（案）

| 要素 | 候補 | 備考 |
|---|---|---|
| SSG | **Astro**（第一候補） | TypeScript対応、Content Collectionsで記事スキーマを型検証できる。出力が軽く高速 |
| 代替 | Next.js（静的書き出し）／Hugo | Hugoは最速だが型検証と拡張性でAstroに劣る |
| リポジトリ | GitHub（プライベート） | pushで自動ビルド・公開。記事の履歴管理も兼ねる |
| ホスティング | **Azure Static Web Apps**（第一候補） | 無料枠あり、カスタムドメインとHTTPS対応、GitHub連携で自動デプロイ。ユーザーが想定するAzure系ツール基盤とも運用が揃う |
| 代替 | Cloudflare Pages／Netlify | どちらも無料枠で十分。CDN性能はCloudflareが強い |
| CDN | ホスティング内蔵CDNで開始 | 独立したCloudflare前段は必要になったら追加 |
| 画像 | リポジトリ内管理＋ビルド時最適化（WebP変換・リサイズ） | 記事数が増えたら外部画像配信へ移行を検討 |
| ツール基盤 | tools.サブドメインに Azure Web Apps（別途） | 本体とは独立。作るかどうかはフェーズ後段で判断 |

### 月額コストの目安（本体）
- ドメイン：年1,500〜2,500円程度（.com）
- ホスティング：無料枠〜数百円
- 合計：**月換算で数百円以内**が目標（実測の商品購入費は別枠で月5,000〜10,000円を想定）

## 3. 記事データの要件（最重要）

記事はMarkdown本文＋Front Matter（YAML）で管理し、スキーマを型で検証する。

### Front Matter スキーマ（案）
```yaml
title: "How to Use a Japanese Convenience Store: A Local's Complete Guide"
slug: how-to-use-japanese-convenience-store
description: "（検索結果に出る120〜160字の説明）"
stage: first-trip        # first-trip / repeat / live-like-local
domain: konbini          # food / shopping / infrastructure / local-places
tags: [7-Eleven, FamilyMart, Lawson, checkout]
chain: [seven-eleven, familymart, lawson]
publishedAt: 2026-12-01
updatedAt: 2026-12-01
checkedAt: 2026-11-30    # 実測・確認日（記事に表示する）
heroImage: ./images/hero.jpg
draft: false

# 実測データ（表の元データ）
measured:
  - item: "FamiChiki (FamilyMart)"
    priceJpy: 210
    place: "FamilyMart (Tokyo)"
    note: "Hot snack at the counter; ask staff"

# 聞かれる決まり文句
phrasesAsked:
  - jp: "温めますか？"
    romaji: "Atatamemasu ka?"
    en: "Shall I heat it up?"
    answers:
      - jp: "はい、お願いします"
        romaji: "Hai, onegai shimasu"
        en: "Yes, please"
      - jp: "そのままで大丈夫です"
        romaji: "Sonomama de daijoubu desu"
        en: "It's fine as it is"

# 伝えるフレーズ（見せる用）
phrasesSay:
  - jp: "これをください"
    romaji: "Kore wo kudasai"
    en: "This one, please"
    situation: "Pointing at an item behind the counter"
```

### この設計で自動化できること
- 記事ページのフレーズブロック（聞き取り／伝える）の自動描画
- 見せる用カード画像の自動生成（同じデータからビルド時に生成）
- 実測データ表の自動描画と、価格改定時の差し替え（データ1か所の修正で反映）
- カテゴリ・タグ・チェーン別の一覧ページ自動生成

## 4. ページ要件

### MVP（公開時に必須）
- トップページ：コンセプト説明、ステージ別入口（First Trip／Second Trip+／Live Like a Local）、新着記事
- 記事ページ：Quick Answer、本文、実測表、フレーズブロック（聞き取り／伝える）、見せる用カード、Disclosure、確認日、関連記事、広告スロット（固定位置）
- カテゴリページ：ステージ別・領域別の一覧
- ピラーページ：チェーン別ハブ（コンビニ完全ガイド等）
- 必須ページ：About、Privacy Policy、Affiliate Disclosure、Contact（外部フォーム連携で可）
- 404ページ、サイトマップ、robots.txt、OGP、構造化データ（Article／FAQPage）
- ads.txt の設置

### 後付け（MVP後）
- サイト内検索
- フレーズカードの一覧・印刷用ページ（場面別カード集として独立コンテンツ化）
- Pinterest連携（自動ピン生成）
- ツールへの導線（サブドメインへのリンク）

## 5. 非機能要件

- 表示速度：モバイルでLCP 2.5秒以内、Core Web Vitals合格を目標
- モバイルファースト（読者の大半がスマホで旅行中に見る前提）
- アクセシビリティ：フレーズの日本語は大きな文字サイズで表示（見せる用途のため）。コントラスト確保
- SEO：英語スラッグ、メタ情報の全記事設定、画像alt必須
- 可用性：静的なので実質ホスティング依存。デプロイ失敗時は前バージョンが残る構成にする
- バックアップ：Gitリポジトリ自体が正本。画像の原本は別途保管（要決定：保管場所）

## 6. 運用フロー要件

1. Claudeが実測メモのテンプレを出す → ユーザーが生活動線で購入・撮影・メモ記入
2. ClaudeがMarkdown下書きを生成（フレーズデータ含む）
3. プレビュー環境（ブランチデプロイ）でユーザーがスマホ確認・事実チェック
4. OKでmainへマージ → 自動公開（数分）
5. 月次：価格・ラインナップの鮮度チェックリストをClaudeが出し、対象記事を更新

- 投稿ペース：ひな型完成後は週2〜3本
- 下書きの受け渡し形式（要決定）：写真とメモをどこに置くか（共有フォルダ等）

## 7. 計測・判定要件

- GA4、Search Console を公開初日から設置
- 月次KPI：PV（国別比率）、記事別PV、検索クエリと順位、AdSense RPM、アフィリエイトのクリックと成約
- 判定：開始6か月時点で、PVと収益が撤退ライン（フェーズ0で数値を確定）に届かなければ更新頻度を落とす

## 8. ドメイン候補（2026-11-26確認）

確認方法：.comレジストリのRDAPで確認。404＝未登録（取得可能）の確定分のみを「取得可」とした。一部候補は応答不安定のため未確認であり、取得時にレジストラで最終確認する。

### 取得可（RDAPで確認済み）
| ドメイン | 読み・意味 | 所感 |
|---|---|---|
| **ordinarytokyo.com** | Ordinary Tokyo＝「普通の東京」 | 企画の核（日本人の当たり前＝ordinary）と一致。覚えやすく、コンセプトをそのまま名前にできる。本命候補 |
| **kurashitokyo.com** | Kurashi（暮らし）Tokyo | 「暮らし」の含意が正確。英語圏には造語として響くが、説明とセットでブランド化できる |
| **nichijotokyo.com** | Nichijo（日常）Tokyo | 日常という言葉そのもの。kurashiより硬めの響き |
| **localtokyolife.com** | Local Tokyo Life | 意味が一発で伝わる説明型。SEO向きだがブランド感は弱め |
| **asatokyolocal.com** | As a Tokyo Local | 「地元民として」という視点が名前に入る。やや長い |

### 取得不可（登録済み）
everydayjapan.com、everydaytokyo.com、tokyoeveryday.com、konbinilife.com、thetokyolocal.com、kurashijapan.com、seikatsujapan.com、japandailylife.com 等、「everyday＋Japan/Tokyo」の直球はほぼ埋まっている。

### 決定時の注意
- 取得前にSNS（Pinterest、X、Instagram）の同名アカウントの空きも同時確認する
- 商標の簡易チェック（同名の既存メディア・店舗がないか）も取得前に行う
- サイト名（表示名）とドメインは一致させる

## 8-2. ドメイン決定と取得前チェック（2026-11-26）

- **決定：ordinarytokyo.com で進める**（ユーザー決定）。サイト表示名は「Ordinary Tokyo」
- 商標・既存メディアの簡易チェック：同名のメディア／店舗は検索で確認できず。近接名としてスキンケアブランド「The Ordinary」と、旅行商品名に「Ordinary Tokyo」を使うツアー会社が1件あるのみで、競合メディアとしての衝突は低い。ただし美容系の記事では The Ordinary と混同される表現を避ける
- SNSハンドル：X（@OrdinaryTokyo）とYouTube（@ordinarytokyo）は既存アカウントがある可能性が高く、TikTokは空いている可能性が高い。Instagram／Pinterestは自動確認では判定できず。**ハンドルは完全一致にこだわらず、ordinarytokyo.life／goordinarytokyo等の変形で統一する**方針とし、ドメイン取得と同時に各SNSで確保する
- 取得はユーザーがレジストラで行う（本人名義・支払いが必要なため）。レジストラは価格と管理のしやすさで選ぶ（Cloudflare Registrar等の原価系が候補）

## 9. 要決定リスト → 決定済み（2026-11-26、推奨案をユーザーが一括承認）

1. ドメイン：**ordinarytokyo.com**（サイト名 Ordinary Tokyo）
2. 技術構成：**Astro＋Azure Static Web Apps（Standard）** で確定
3. 画像原本と実測メモ：素材の受け渡しはチャット経由から開始する。原本の保管はユーザーの手元のフォルダを正本とし、Claudeのワークスペースにも複製を持つ。量が増えたらクラウドストレージへ移行する
4. Aboutのプロフィール：**顔出しなし・本名なし**。「東京在住の日本人、ITエンジニア、東京で普通に暮らしている」という属性のみを書く。信頼はプロフィールの詳しさではなく実測の密度で作る
5. 6か月判定の撤退ライン：開始6か月時点で「**月10,000PV未満、かつ月収益が現金分岐点（約11,000円）に届いていない**」場合は、週2〜3本の更新を止めて月数本の維持運用に落とす。どちらか一方でも超えていれば継続する
6. ツール基盤（サブドメイン）：**初期は用意しない**。記事とAdSense審査を先行させ、検索クエリで道具系の需要が見えた段階で追加する
