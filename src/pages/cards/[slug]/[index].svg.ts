import { getCollection } from 'astro:content';

function escapeXml(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

export async function getStaticPaths() {
	const articles = await getCollection('articles', ({ data }) =>
		import.meta.env.DEV ||
		import.meta.env.PUBLIC_SHOW_DRAFTS === 'true' ||
		!data.draft,
	);
	return articles.flatMap((article) =>
		article.data.phrasesSay.map((phrase, index) => ({
			params: { slug: article.data.slug, index: String(index + 1) },
			props: { phrase, title: article.data.title },
		})),
	);
}

export async function GET({ props }: { props: { phrase: { jp: string; romaji: string; en: string }; title: string } }) {
	const { phrase, title } = props;
	const japaneseFontSize = Math.min(82, Math.floor(1050 / [...phrase.jp].length));
	const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-labelledby="card-title card-description">
  <title id="card-title">${escapeXml(phrase.jp)} — ${escapeXml(phrase.en)}</title>
  <desc id="card-description">${escapeXml(title)} Japanese phrase card from Ordinary Tokyo</desc>
  <rect width="1200" height="630" rx="32" fill="#FAFAF7"/>
  <rect x="28" y="28" width="1144" height="574" rx="24" fill="none" stroke="#1F3A5F" stroke-width="8"/>
  <circle cx="92" cy="90" r="32" fill="#1F3A5F"/>
  <text x="92" y="102" text-anchor="middle" fill="#fff" font-family="Arial, sans-serif" font-size="32" font-weight="700">O</text>
  <text x="144" y="101" fill="#1F3A5F" font-family="Arial, sans-serif" font-size="30" font-weight="700">Ordinary Tokyo</text>
  <text x="600" y="300" text-anchor="middle" fill="#22252A" font-family="'Noto Sans JP', 'Yu Gothic', sans-serif" font-size="${japaneseFontSize}" font-weight="700">${escapeXml(phrase.jp)}</text>
  <text x="600" y="376" text-anchor="middle" fill="#414954" font-family="Arial, sans-serif" font-size="30">${escapeXml(phrase.romaji)}</text>
  <text x="600" y="455" text-anchor="middle" fill="#1F3A5F" font-family="Arial, sans-serif" font-size="34" font-weight="700">${escapeXml(phrase.en)}</text>
  <text x="600" y="548" text-anchor="middle" fill="#59616B" font-family="Arial, sans-serif" font-size="19">${escapeXml(title)}</text>
</svg>`;

	return new Response(svg, {
		headers: { 'Content-Type': 'image/svg+xml; charset=utf-8' },
	});
}
