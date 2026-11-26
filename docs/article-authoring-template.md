# 記事作成テンプレートと編集チェック

記事本文は英語で書き、Front Matterのキーと値は既存スキーマに従う。追加フィールドは`src/content.config.ts`と基本設計書を先に更新・承認してから使う。

```yaml
title: "Article title"
slug: article-title
description: "A 120–160 character summary that also works as the quick answer."
stage: first-trip
domain: infrastructure
tags: [topic, chain]
chain: [chain-id]
publishedAt: "2026-11-26"
updatedAt: "2026-11-26"
checkedAt: "2026-11-26"
heroImage: "./images/hero.jpg"
heroAlt: "Describe what is actually visible in the image"
draft: true
measured:
  - item: "Product or service"
    priceJpy: 250
    place: "Chain and city"
    note: "What was checked, including any limitations"
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
faq:
  - question: "Frequently asked question"
    answer: "Concise answer"
```

画像は`src/assets/articles/{slug}/images/`に置く。`heroImage`はその記事フォルダの`images/`からの相対パスにし、実物の写真でない場合は実測写真と誤認されない説明にする。記事ページのQuick Answerにはdescriptionを使う。本文の先頭では現地での手順と実測の背景を説明し、フレーズだけの記事にはしない。

## 公開前チェック

- 実測を記事の主役にし、価格・店・確認日を実際の記録と照合した。未確認情報は未確認と明記した。
- フレーズは実際の場面の流れに埋め込み、聞かれる文句と答え、見せる文句の両方を入れた。
- First Tripの入口として分かりやすいか確認し、関連する基本ガイドへの導線を用意した。
- 実測対象は生活動線上で訪問できるチェーン店・大型店を中心にした。行っていない場所の体験を装っていない。
- 制度や変更されやすい情報はcheckedAtを更新し、本文で確認範囲を明示した。
- 個人の小規模店を扱う場合、混雑や地域への影響を含めて紹介の必要性を慎重に確認した。
- 価格・商品・店舗情報・画像alt・英語の表示をプレビューで確認した。
