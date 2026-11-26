import affiliateLinks from './affiliate-links.json';

interface AffiliateLink {
	label: string;
	url: string;
}

const links: Record<string, AffiliateLink> = affiliateLinks;

export function getAffiliateLink(id: string) {
	const link = links[id];
	if (!link) {
		throw new Error(`Unknown affiliate link ID: ${id}`);
	}
	return { id, ...link };
}
