import { createHash } from 'node:crypto';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const articleAssetRoot = `${path.resolve(root, 'src/assets/articles')}${path.sep}`;
const outputDirectory = path.resolve(root, 'public/images/optimized');

async function optimizeImage(node, file) {
	const sourceUrl = node.url.split(/[?#]/, 1)[0];
	if (!sourceUrl || /^(?:[a-z]+:)?\/\//i.test(sourceUrl) || sourceUrl.startsWith('/')) {
		return;
	}

	const markdownPath = file.history[0];
	if (!markdownPath) {
		throw new Error('Cannot resolve a local Markdown image without its source file path.');
	}

	const sourcePath = path.resolve(
		path.dirname(markdownPath),
		decodeURIComponent(sourceUrl),
	);
	if (!sourcePath.startsWith(articleAssetRoot)) {
		throw new Error(
			`Markdown images must be stored under src/assets/articles/: ${node.url}`,
		);
	}

	const fileId = createHash('sha256')
		.update(path.relative(articleAssetRoot, sourcePath))
		.digest('hex')
		.slice(0, 16);
	const outputName = `${fileId}.webp`;
	const outputPath = path.join(outputDirectory, outputName);

	await mkdir(outputDirectory, { recursive: true });
	const image = sharp(sourcePath).rotate();
	const metadata = await image.metadata();
	await image
		.resize({ width: 1800, height: 1800, fit: 'inside', withoutEnlargement: true })
		.webp({ quality: 82 })
		.toFile(outputPath);

	node.url = `/images/optimized/${outputName}`;
	const data = node.data && typeof node.data === 'object' ? node.data : {};
	const hProperties =
		data.hProperties && typeof data.hProperties === 'object'
			? data.hProperties
			: {};
	node.data = {
		...data,
		hProperties: {
			...hProperties,
			...(metadata.width ? { width: metadata.width } : {}),
			...(metadata.height ? { height: metadata.height } : {}),
			loading: 'lazy',
			decoding: 'async',
		},
	};
}

async function visitImages(node, file) {
	if (!node || typeof node !== 'object') return;
	if (node.type === 'image') await optimizeImage(node, file);
	if (Array.isArray(node.children)) {
		for (const child of node.children) {
			await visitImages(child, file);
		}
	}
}

export default function optimizeMarkdownImages() {
	return async (tree, file) => visitImages(tree, file);
}
