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

	assert.equal((code.match(/<div class="data-table-wrap"><table>/g) ?? []).length, 2);
	assert.match(code, /<p>Before<\/p>/);
	assert.match(code, /<blockquote>\s*<div class="data-table-wrap"><table>/);
	assert.match(code, /<td>Tea<\/td>/);
	assert.match(code, /<td>Coffee<\/td>/);
	assert.match(code, /<p>After<\/p>/);
});
