// @ts-check
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import optimizeMarkdownImages from './scripts/optimize-markdown-images.mjs';

export default defineConfig({
	site: 'https://ordinarytokyo.com',
	markdown: {
		processor: unified({ remarkPlugins: [optimizeMarkdownImages] }),
	},
});
