'use client';
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/data';

export default function WishlistPage() {
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (items.length === 0) {
    return (
      <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 24px', textAlign: 'center' }}>
        <div style={{ width: '100px', height: '100px', background: 'var(--ivory)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
          <Heart size={48} color="var(--border)" />
        </div>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '32px', fontWeight: 700, marginBottom: '12px' }}>Your wishlist is empty</h1>
        <p style={{ color: 'var(--gray-warm)', marginBottom: '32px', maxWidth: '400px' }}>Save items you love here and they'll be waiting for you when you're ready to buy.</p>
        <Link href="/" className="btn-primary" style={{ display: 'inline-flex' }}>Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--ivory)', minHeight: '100vh', padding: '60px 24px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '36px', fontWeight: 700, marginBottom: '40px' }}>My Wishlist</h1>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '32px' }}>
          {items.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', border: '1px solid var(--border)', position: 'relative' }}
            >
              <button 
                onClick={() => removeFromWishlist(product.id)}
                style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 10, background: 'rgba(255,255,255,0.9)', border: 'none', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
              >
                <Trash2 size={16} color="#E53935" />
              </button>

              <Link href={`/products/${product.category}/${product.id}`} style={{ textDecoration: 'none' }}>
                <div style={{ height: '260px', overflow: 'hidden', background: '#F5F2EE' }}>
                  <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              </Link>

              <div style={{ padding: '24px' }}>
                <p style={{ fontSize: '12px', color: 'var(--gray-warm)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>{product.subcategory}</p>
                <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px', color: 'var(--charcoal)', height: '44px' }} className="line-clamp-2">{product.name}</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--sienna)' }}>{formatPrice(product.price)}</span>
                  {product.discount > 0 && <span style={{ fontSize: '12px', color: 'var(--gray-warm)', textDecoration: 'line-through' }}>{formatPrice(product.originalPrice)}</span>}
                </div>
                <button 
                  onClick={() => addToCart(product)}
                  className="btn-primary" 
                  style={{ width: '100%', justifyContent: 'center', gap: '8px' }}
                >
                  <ShoppingBag size={18} /> Add to Cart
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
