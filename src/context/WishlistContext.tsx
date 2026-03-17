'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';
import { type Product } from '@/lib/data';

interface WishlistContextType {
  items: Product[];
  addToWishlist: (product: Product) => Promise<void>;
  removeFromWishlist: (id: string) => Promise<void>;
  isWishlisted: (id: string) => boolean;
  toggleWishlist: (product: Product) => Promise<void>;
  count: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<Product[]>([]);
  const { user } = useAuth();

  // Load wishlist from Supabase on login
  React.useEffect(() => {
    const fetchWishlist = async () => {
      if (!user) {
        setItems([]);
        return;
      }

      const { data, error } = await supabase
        .from('wishlist')
        .select(`
          product_id,
          products (*)
        `)
        .eq('user_id', user.id);

      if (data) {
        const formatted = data.map((item: any) => ({
          ...item.products,
          id: item.products.id,
          image: item.products.image_url,
          originalPrice: item.products.original_price,
          inStock: item.products.in_stock,
          isNew: item.products.is_new
        }));
        setItems(formatted);
      }
    };

    fetchWishlist();
  }, [user]);

  const addToWishlist = async (product: Product) => {
    if (user) {
      const { error } = await supabase
        .from('wishlist')
        .insert({ user_id: user.id, product_id: product.id });
      
      if (error && error.code !== '23505') return; // Ignore if already exists
    }
    setItems((prev) => (prev.find((i) => i.id === product.id) ? prev : [...prev, product]));
  };

  const removeFromWishlist = async (id: string) => {
    if (user) {
      await supabase
        .from('wishlist')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', id);
    }
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const isWishlisted = (id: string) => items.some((i) => i.id === id);

  const toggleWishlist = async (product: Product) => {
    isWishlisted(product.id) ? await removeFromWishlist(product.id) : await addToWishlist(product);
  };

  return (
    <WishlistContext.Provider value={{ items, addToWishlist, removeFromWishlist, isWishlisted, toggleWishlist, count: items.length }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
};
