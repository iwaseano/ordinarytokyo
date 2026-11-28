// @ts-check
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import * as pagefind from 'pagefind';
import optimizeMarkdownImages from './scripts/optimize-markdown-images.mjs';
import wrapMarkdownTables from './scripts/wrap-markdown-tables.mjs';

export default defineConfig({
	site: 'https://ordinarytokyo.com',
	integrations: [{
		name: 'article-search',
		hooks: {
			'astro:build:done': async ({ dir, logger }) => {
				try {
					const { index, errors } = await pagefind.createIndex();
					if (errors.length || !index) throw new Error(errors.join('\n') || 'Could not create search index');
					const directory = fileURLToPath(dir);
					const result = await index.addDirectory({ path: directory });
					if (result.errors.length) throw new Error(result.errors.join('\n'));
					const output = await index.writeFiles({ outputPath: path.join(directory, 'pagefind') });
					if (output.errors.length) throw new Error(output.errors.join('\n'));
					logger.info(`Processed ${result.page_count} pages for the search index.`);
				} finally {
					await pagefind.close();
				}
			},
		},
	}],
	markdown: {
		processor: unified({
			remarkPlugins: [optimizeMarkdownImages],
			rehypePlugins: [wrapMarkdownTables],
		}),
	},
});
