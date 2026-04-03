import { create } from 'zustand';

export interface CartItem {
  /** Unique line key — prefer Shopify variant GID when available. */
  id: string;
  productId?: string;
  title: string;
  price: string;
  quantity: number;
  image: string;
}

interface CartState {
  isOpen: boolean;
  items: CartItem[];
  openCart: () => void;
  closeCart: () => void;
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
}

export const useCartStore = create<CartState>((set) => ({
  isOpen: false,
  items: [],
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  addToCart: (item) =>
    set((state) => {
      const lineKey = item.id;
      const existingItem = state.items.find((i) => i.id === lineKey);
      if (existingItem) {
        return {
          items: state.items.map((i) =>
            i.id === lineKey ? { ...i, quantity: i.quantity + 1 } : i,
          ),
          isOpen: true,
        };
      }
      return { items: [...state.items, { ...item, quantity: 1 }], isOpen: true };
    }),
  removeFromCart: (id) =>
    set((state) => ({
      items: state.items.filter((i) => i.id !== id),
    })),
  updateQuantity: (id, quantity) =>
    set((state) => ({
      items:
        quantity === 0
          ? state.items.filter((i) => i.id !== id)
          : state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
    })),
}));
