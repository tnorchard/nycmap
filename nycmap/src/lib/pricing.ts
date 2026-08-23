export const OUTBID_MULTIPLIER = 1.5;

export function minOutbid(currentPrice: number) {
  return Math.max(currentPrice + 1, Math.ceil(currentPrice * OUTBID_MULTIPLIER));
}

export function formatMoney(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}
