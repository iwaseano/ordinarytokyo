export const SITE = {
	name: 'Ordinary Tokyo',
	url: 'https://ordinarytokyo.com',
	description:
		'Everyday Tokyo, explained by a local: practical guides, real-world checks, and Japanese phrases for the places people actually use.',
	author: 'Tokyo-based Japanese local',
	currency: {
		usdJpyRate: 150,
		checkedAt: '2026-11-26',
	},
	popularSlugs: ['konbini-checkout', 'saizeriya-ordering'],
} as const;

export const STAGES = {
	'first-trip': {
		title: 'First Trip',
		description: 'Everyday essentials to help you feel confident on your first visit to Japan.',
	},
	repeat: {
		title: 'Second Trip+',
		description: 'Go beyond the classic itinerary and discover the routines locals return to.',
	},
	'live-like-local': {
		title: 'Live Like a Local',
		description: 'Practical guides for longer stays and a more everyday rhythm in Tokyo.',
	},
} as const;

export const DOMAINS = {
	food: {
		title: 'Everyday Food',
		description: 'Ordering, eating, and finding value at places Tokyo residents use regularly.',
	},
	shopping: {
		title: 'Everyday Shopping',
		description: 'Useful products, stores, and shopping routines from daily life in Tokyo.',
	},
	infrastructure: {
		title: 'Everyday Infrastructure',
		description: 'The services and small systems that make daily life in Japan work.',
	},
	'local-places': {
		title: 'Local Places',
		description: 'Neighborhood places and everyday routines beyond the usual sightseeing route.',
	},
} as const;

export const CHAINS: Record<string, { title: string; description: string; localNote: string }> = {
	'seven-eleven': {
		title: '7-Eleven',
		description: 'A major convenience store chain with ready-to-eat food, daily essentials, and in-store services.',
		localNote: 'Local guides focus on ordinary visits and details that are useful at the counter.',
	},
	familymart: {
		title: 'FamilyMart',
		description: 'A nationwide convenience store chain known for prepared foods and everyday services.',
		localNote: 'Guides explain common checkout questions and how to handle a quick stop.',
	},
	lawson: {
		title: 'Lawson',
		description: 'A nationwide convenience store chain with prepared foods, sweets, and everyday services.',
		localNote: 'Local guides focus on what visitors can buy and what may happen at the register.',
	},
	saizeriya: {
		title: 'Saizeriya',
		description: 'A casual Italian-style family restaurant chain used by local diners for everyday meals.',
		localNote: 'Guides cover practical ordering steps and the experience of a regular meal.',
	},
};

export type StageId = keyof typeof STAGES;
export type DomainId = keyof typeof DOMAINS;

export function titleFromSlug(slug: string): string {
	return slug
		.split('-')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
}

export function domainInfo(id: string): { title: string; description: string } {
	return id in DOMAINS
		? DOMAINS[id as DomainId]
		: { title: titleFromSlug(id), description: `Practical local guides about ${titleFromSlug(id)}.` };
}

export function chainInfo(id: string): { title: string; description: string; localNote: string } {
	return (
		CHAINS[id] ?? {
			title: titleFromSlug(id),
			description: `Practical local guides, measurements, and phrases for ${titleFromSlug(id)} in Tokyo.`,
			localNote: 'Guides explain how local residents use this chain in everyday life.',
		}
	);
}
