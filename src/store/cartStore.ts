import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface CartItem {
  /** Shopify variant GID — used as the cart line key and for checkout. */
  id: string;
  productId?: string;
  title: string;
  /** Numeric amount string, e.g. "299.00". Always stored as raw number, not display string. */
  price: string;
  /** ISO currency code, e.g. "ZAR". */
  currencyCode: string;
  quantity: number;
  image: string;
}

interface CartState {
  isOpen: boolean;
  items: CartItem[];
  /** Shopify cart GID — cached after the first checkout creation. Cleared when cart contents change. */
  shopifyCartId: string | null;
  /** Shopify-hosted checkout URL — cached alongside shopifyCartId. */
  shopifyCheckoutUrl: string | null;

  openCart: () => void;
  closeCart: () => void;
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  setShopifyCart: (cartId: string, checkoutUrl: string) => void;
  invalidateShopifyCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      isOpen: false,
      items: [],
      shopifyCartId: null,
      shopifyCheckoutUrl: null,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      addToCart: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i,
              ),
              isOpen: true,
              shopifyCartId: null,
              shopifyCheckoutUrl: null,
            };
          }
          return {
            items: [...state.items, { ...item, quantity: 1 }],
            isOpen: true,
            shopifyCartId: null,
            shopifyCheckoutUrl: null,
          };
        }),

      removeFromCart: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
          shopifyCartId: null,
          shopifyCheckoutUrl: null,
        })),

      updateQuantity: (id, quantity) =>
        set((state) => ({
          items:
            quantity === 0
              ? state.items.filter((i) => i.id !== id)
              : state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
          shopifyCartId: null,
          shopifyCheckoutUrl: null,
        })),

      setShopifyCart: (cartId, checkoutUrl) =>
        set({ shopifyCartId: cartId, shopifyCheckoutUrl: checkoutUrl }),

      invalidateShopifyCart: () =>
        set({ shopifyCartId: null, shopifyCheckoutUrl: null }),
    }),
    {
      name: "nutrizen-cart",
      storage: createJSONStorage(() => localStorage),
      // Only persist cart data — not UI state like isOpen
      partialize: (state) => ({
        items: state.items,
        shopifyCartId: state.shopifyCartId,
        shopifyCheckoutUrl: state.shopifyCheckoutUrl,
      }),
    },
  ),
);
