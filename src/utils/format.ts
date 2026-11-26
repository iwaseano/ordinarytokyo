export function formatDate(date: Date): string {
	return new Intl.DateTimeFormat('en', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		timeZone: 'UTC',
	}).format(date);
}

export function formatJpy(price: number): string {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'JPY',
		maximumFractionDigits: 0,
	}).format(price);
}

export function formatUsd(priceJpy: number, usdJpyRate: number): string {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		maximumFractionDigits: 2,
	}).format(priceJpy / usdJpyRate);
}
