import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';
import affiliateLinks from './data/affiliate-links.json';
import { DOMAINS } from './data/site';

const phraseSchema = z.object({
	jp: z.string().min(1),
	romaji: z.string().min(1),
	en: z.string().min(1),
}).strict();

const articleSchema = z.object({
	title: z.string().min(1),
	slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
	description: z.string().min(120).max(160),
	stage: z.enum(['first-trip', 'repeat', 'live-like-local']),
	domain: z
		.string()
		.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
		.refine((value) => Object.hasOwn(DOMAINS, value), {
			message: 'domain must be registered in src/data/site.ts',
		}),
	tags: z.array(z.string().min(1)),
	chain: z.array(z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)),
	publishedAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
	checkedAt: z.coerce.date(),
	heroImage: z.string().min(1).optional(),
	heroAlt: z.string().min(1).optional(),
	draft: z.boolean().default(false),
	measured: z
		.array(
			z.object({
				item: z.string().min(1),
				priceJpy: z.number().nonnegative(),
				place: z.string().min(1),
				note: z.string().min(1),
			}).strict(),
		)
		.min(1),
	phrasesAsked: z
		.array(
			phraseSchema.extend({
				answers: z
					.array(phraseSchema)
					.min(1),
			}).strict(),
		)
		.min(1),
	phrasesSay: z
		.array(
			phraseSchema.extend({
				situation: z.string().min(1),
			}).strict(),
		)
		.min(1),
	affiliateLinks: z
		.array(z.string().min(1))
		.default([])
		.refine((ids) => ids.every((id) => Object.hasOwn(affiliateLinks, id)), {
			message: 'affiliateLinks must use IDs registered in src/data/affiliate-links.json',
		}),
	faq: z
		.array(
			z.object({
				question: z.string().min(1),
				answer: z.string().min(1),
			}).strict(),
		)
		.default([]),
}).strict().refine(
	({ heroImage, heroAlt }) => !heroImage || Boolean(heroAlt),
	{
		path: ['heroAlt'],
		message: 'heroAlt is required when heroImage is specified',
	},
);

const articles = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
	schema: articleSchema,
});

export const collections = { articles };
