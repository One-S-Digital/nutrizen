/**
 * Optimizes Shopify CDN image URLs for faster loading
 * Shopify CDN supports: width, height, crop, quality parameters
 *
 * Example:
 * - Original: https://cdn.shopify.com/s/files/1/xyz/product.jpg
 * - Optimized: https://cdn.shopify.com/s/files/1/xyz/product.jpg?width=500&quality=85
 */

export function optimizeShopifyImage(
  imageUrl: string | null | undefined,
  width?: number
): string {
  if (!imageUrl) return '';

  // Only optimize Shopify CDN URLs, leave others unchanged
  if (!imageUrl.includes('cdn.shopify.com')) {
    return imageUrl;
  }

  try {
    const url = new URL(imageUrl);

    // Set quality to 85 (good balance between file size and quality)
    // Shopify CDN default quality is 100, so this saves ~30-40%
    url.searchParams.set('quality', '85');

    // If width is provided, add it (helps with responsive images)
    if (width) {
      url.searchParams.set('width', String(width));
    }

    return url.toString();
  } catch (e) {
    // If URL parsing fails, return original URL
    console.warn('Failed to optimize Shopify image URL:', imageUrl);
    return imageUrl;
  }
}

/**
 * Get responsive image URLs for different device widths
 * Used with Next.js Image component's sizes attribute
 */
export function getShopifyImageUrlForWidth(imageUrl: string | null | undefined, width: number): string {
  return optimizeShopifyImage(imageUrl, width);
}
