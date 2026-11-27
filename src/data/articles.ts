import { getCollection } from 'astro:content';

export async function getVisibleArticles() {
	const includeDrafts =
		import.meta.env.DEV || import.meta.env.PUBLIC_SHOW_DRAFTS === 'true';

	return getCollection('articles', ({ data }) => includeDrafts || !data.draft);
}

export async function getSortedArticles() {
	const articles = await getVisibleArticles();
	return articles.sort(
		(a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf(),
	);
}

export function getArticlePath(slug: string): string {
	return `/${slug}/`;
}

export function getSayPhraseId(index: number): string {
	return `say-phrase-${index + 1}`;
}
