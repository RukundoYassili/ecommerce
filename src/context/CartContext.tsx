'use client';
import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Product } from '@/lib/data';

interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

type CartAction =
  | { type: 'ADD_ITEM'; product: Product }
  | { type: 'REMOVE_ITEM'; id: string }
  | { type: 'UPDATE_QTY'; id: string; quantity: number }
  | { type: 'TOGGLE_CART' }
  | { type: 'CLEAR_CART' };

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find((i) => i.id === action.product.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.id === action.product.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
          isOpen: true,
        };
      }
      return { ...state, items: [...state.items, { ...action.product, quantity: 1 }], isOpen: true };
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((i) => i.id !== action.id) };
    case 'UPDATE_QTY':
      return {
        ...state,
        items:
          action.quantity <= 0
            ? state.items.filter((i) => i.id !== action.id)
            : state.items.map((i) => (i.id === action.id ? { ...i, quantity: action.quantity } : i)),
      };
    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen };
    case 'CLEAR_CART':
      return { ...state, items: [] };
    default:
      return state;
  }
};

interface CartContextType {
  state: CartState;
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  updateQty: (id: string, quantity: number) => void;
  toggleCart: () => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [], isOpen: false }, (initial) => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bfresh_cart');
      return saved ? { ...initial, items: JSON.parse(saved) } : initial;
    }
    return initial;
  });

  React.useEffect(() => {
    localStorage.setItem('bfresh_cart', JSON.stringify(state.items));
  }, [state.items]);

  const totalItems = state.items.reduce((sum: number, i: CartItem) => sum + i.quantity, 0);
  const totalPrice = state.items.reduce((sum: number, i: CartItem) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{
      state,
      addToCart: (p) => dispatch({ type: 'ADD_ITEM', product: p }),
      removeFromCart: (id) => dispatch({ type: 'REMOVE_ITEM', id }),
      updateQty: (id, quantity) => dispatch({ type: 'UPDATE_QTY', id, quantity }),
      toggleCart: () => dispatch({ type: 'TOGGLE_CART' }),
      clearCart: () => dispatch({ type: 'CLEAR_CART' }),
      totalItems,
      totalPrice,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
