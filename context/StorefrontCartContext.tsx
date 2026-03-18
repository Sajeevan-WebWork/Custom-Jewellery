"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type CartItem = {
  id: number | string;
  name: string;
  price: number;
  category: string;
  image: string;
  quantity: number;
};

type CartContextValue = {
  cartItems: CartItem[];
  addToCart: (product: Omit<CartItem, "quantity">) => void;
  removeFromCart: (productId: number | string) => void;
  updateQuantity: (productId: number | string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function StorefrontCartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const savedCart = window.localStorage.getItem("luxe_cart");
    if (!savedCart) return;

    try {
      setCartItems(JSON.parse(savedCart));
    } catch {
      window.localStorage.removeItem("luxe_cart");
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("luxe_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const value = useMemo<CartContextValue>(
    () => ({
      cartItems,
      addToCart: (product) => {
        setCartItems((current) => {
          const existingItem = current.find((item) => item.id === product.id);
          if (existingItem) {
            return current.map((item) =>
              item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            );
          }

          return [...current, { ...product, quantity: 1 }];
        });
      },
      removeFromCart: (productId) => {
        setCartItems((current) => current.filter((item) => item.id !== productId));
      },
      updateQuantity: (productId, quantity) => {
        setCartItems((current) =>
          quantity <= 0
            ? current.filter((item) => item.id !== productId)
            : current.map((item) => (item.id === productId ? { ...item, quantity } : item))
        );
      },
      clearCart: () => setCartItems([]),
      cartTotal: cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
      cartCount: cartItems.reduce((count, item) => count + item.quantity, 0),
      isCartOpen,
      setIsCartOpen,
    }),
    [cartItems, isCartOpen]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useStorefrontCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useStorefrontCart must be used within StorefrontCartProvider");
  }
  return context;
}

