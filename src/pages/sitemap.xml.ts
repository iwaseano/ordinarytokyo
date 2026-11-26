import { getVisibleArticles } from '../data/articles';
import { DOMAINS, SITE, STAGES } from '../data/site';

function escapeXml(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

export async function GET() {
	const articles = await getVisibleArticles();
	const staticPaths = [
		'/',
		'/about/',
		'/privacy-policy/',
		'/affiliate-disclosure/',
		'/contact/',
		...Object.keys(STAGES).map((stage) => `/stage/${stage}/`),
		...Object.keys(DOMAINS).map((domain) => `/domain/${domain}/`),
		...Array.from(
			new Set(articles.flatMap((article) => article.data.chain)),
			(chain) => `/chains/${chain}/`,
		),
		...articles.map((article) => `/${article.data.slug}/`),
	];
	const urls = [...new Set(staticPaths)]
		.map((path) => `<url><loc>${escapeXml(new URL(path, SITE.url).toString())}</loc></url>`)
		.join('');
	const body = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;

	return new Response(body, {
		headers: { 'Content-Type': 'application/xml; charset=utf-8' },
	});
}
