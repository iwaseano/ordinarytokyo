import { SITE } from '../data/site';

export function GET() {
	return new Response(
		`User-agent: *\nAllow: /\nSitemap: ${new URL('/sitemap.xml', SITE.url).toString()}\n`,
		{ headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
	);
}
