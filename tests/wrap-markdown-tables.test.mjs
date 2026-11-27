import assert from 'node:assert/strict';
import test from 'node:test';
import { createMarkdownProcessor } from '@astrojs/markdown-remark';
import wrapMarkdownTables from '../scripts/wrap-markdown-tables.mjs';

test('Markdownの表をそれぞれスクロール用ラッパーで囲む', async () => {
	const processor = await createMarkdownProcessor({ rehypePlugins: [wrapMarkdownTables] });
	const { code } = await processor.render([
		'Before',
		'',
		'| Name | Price |',
		'| --- | --- |',
		'| Tea | 300 |',
		'',
		'> | Name | Price |',
		'> | --- | --- |',
		'> | Coffee | 400 |',
		'',
		'After',
	].join('\n'));

	assert.equal((code.match(/<div class="table-container">/g) ?? []).length, 2);
	assert.equal((code.match(/<p class="table-scroll-hint">Scroll horizontally if needed to see the full table\.<\/p>/g) ?? []).length, 2);
	assert.equal((code.match(/<div class="data-table-wrap" role="group" aria-label="Table \(scroll horizontally if needed\)" tabindex="0"><table>/g) ?? []).length, 2);
	assert.match(code, /<p>Before<\/p>/);
	assert.match(code, /<blockquote>\s*<div class="table-container">/);
	assert.match(code, /<td>Tea<\/td>/);
	assert.match(code, /<td>Coffee<\/td>/);
	assert.match(code, /<p>After<\/p>/);
});
