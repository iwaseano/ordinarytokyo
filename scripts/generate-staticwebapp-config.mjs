import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const affiliateFile = path.join(root, 'src/data/affiliate-links.json');
const outputFile = path.join(root, 'public/staticwebapp.config.json');

const affiliateLinks = JSON.parse(await readFile(affiliateFile, 'utf8'));
const routes = Object.entries(affiliateLinks).map(([id, link]) => {
	if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) {
		throw new Error(`Invalid affiliate link ID "${id}". Use lowercase letters, numbers, and hyphens.`);
	}
	if (
		typeof link.label !== 'string' ||
		link.label.trim().length === 0 ||
		typeof link.url !== 'string' ||
		!URL.canParse(link.url) ||
		!['http:', 'https:'].includes(new URL(link.url).protocol)
	) {
		throw new Error(`Affiliate link "${id}" must have an absolute HTTP or HTTPS URL.`);
	}

	return {
		route: `/go/${id}/`,
		redirect: link.url,
		statusCode: 302,
	};
});

const config = {
	routes,
	globalHeaders: {
		'X-Content-Type-Options': 'nosniff',
		'Referrer-Policy': 'strict-origin-when-cross-origin',
		'X-Frame-Options': 'DENY',
	},
};

await writeFile(outputFile, `${JSON.stringify(config, null, 2)}\n`);
