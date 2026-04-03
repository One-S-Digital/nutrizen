/** Format a Shopify Storefront API money string with ISO currency code. */
export function formatPrice(amount: string, currencyCode: string): string {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currencyCode,
    }).format(parseFloat(amount));
  } catch {
    return `${amount} ${currencyCode}`;
  }
}
