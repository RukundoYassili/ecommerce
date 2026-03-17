'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/data';

export default function CartDrawer() {
  const { state, toggleCart, removeFromCart, updateQty, totalPrice } = useCart();

  return (
    <AnimatePresence>
      {state.isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={toggleCart}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 3000 }}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            style={{
              position: 'fixed', top: 0, right: 0, bottom: 0, width: '400px',
              background: '#FAF7F2', zIndex: 3001, display: 'flex', flexDirection: 'column',
              boxShadow: '-10px 0 40px rgba(0,0,0,0.15)',
            }}
          >
            {/* Header */}
            <div style={{ padding: '24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'Playfair Display, serif' }}>Your Cart</h2>
                <p style={{ fontSize: '12px', color: 'var(--gray-warm)', marginTop: '2px' }}>
                  {state.items.length} {state.items.length === 1 ? 'item' : 'items'}
                </p>
              </div>
              <button onClick={toggleCart} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--charcoal)' }}>
                <X size={22} />
              </button>
            </div>

            {/* Items list */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
              {state.items.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 0' }}>
                  <ShoppingBag size={48} style={{ color: 'var(--border)', margin: '0 auto 16px' }} />
                  <p style={{ fontFamily: 'Playfair Display, serif', fontSize: '18px', color: 'var(--gray-warm)', marginBottom: '8px' }}>Your cart is empty</p>
                  <p style={{ fontSize: '13px', color: 'var(--gray-warm)', marginBottom: '24px' }}>Add items to start shopping</p>
                  <button onClick={toggleCart} className="btn-primary" style={{ margin: '0 auto' }}>Explore Products</button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {state.items.map((item) => (
                    <div key={item.id} style={{
                      display: 'flex', gap: '12px', background: 'white',
                      borderRadius: '10px', padding: '12px', border: '1px solid var(--border)',
                    }}>
                      {/* Product image */}
                      <div style={{ width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
                        <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>

                      {/* Product info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontWeight: 600, fontSize: '13px', lineHeight: 1.3 }} className="line-clamp-2">{item.name}</p>
                        <p style={{ fontSize: '11px', color: 'var(--gray-warm)', marginTop: '2px' }}>{item.color}</p>

                        {/* Qty stepper */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                          <button
                            onClick={() => updateQty(item.id, item.quantity - 1)}
                            style={{
                              width: '26px', height: '26px', borderRadius: '50%',
                              border: '1px solid var(--border)', background: 'none',
                              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                            }}
                          ><Minus size={12} /></button>
                          <span style={{ fontWeight: 700, fontSize: '13px', minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                          <button
                            onClick={() => updateQty(item.id, item.quantity + 1)}
                            style={{
                              width: '26px', height: '26px', borderRadius: '50%',
                              border: '1px solid var(--border)', background: 'none',
                              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                            }}
                          ><Plus size={12} /></button>
                        </div>
                      </div>

                      {/* Price + remove */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-warm)', padding: '2px' }}
                        ><Trash2 size={14} /></button>
                        <div>
                          <p style={{ fontWeight: 700, fontSize: '14px', color: 'var(--sienna)' }}>{formatPrice(item.price * item.quantity)}</p>
                          {item.quantity > 1 && <p style={{ fontSize: '10px', color: 'var(--gray-warm)', textAlign: 'right' }}>{formatPrice(item.price)} each</p>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {state.items.length > 0 && (
              <div style={{ padding: '20px 24px', borderTop: '1px solid var(--border)', background: 'white' }}>
                {/* Shipping Progress */}
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px' }}>
                    <span>{totalPrice >= 750000 ? '🎉 You got FREE delivery!' : `Add ${formatPrice(750000 - totalPrice)} more for free delivery`}</span>
                    <span style={{ fontWeight: 700 }}>{Math.min(100, (totalPrice / 750000) * 100).toFixed(0)}%</span>
                  </div>
                  <div style={{ height: '6px', background: 'var(--border)', borderRadius: '3px', overflow: 'hidden' }}>
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (totalPrice / 750000) * 100)}%` }}
                      style={{ height: '100%', background: totalPrice >= 750000 ? '#2E7D32' : 'var(--sienna)', transition: 'width 0.5s ease-out' }} 
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '13px', color: 'var(--gray-warm)' }}>Subtotal</span>
                  <span style={{ fontWeight: 700, fontSize: '18px' }}>{formatPrice(totalPrice)}</span>
                </div>
                <p style={{ fontSize: '11px', color: 'var(--gray-warm)', marginBottom: '16px' }}>
                  Shipping & taxes calculated at checkout
                </p>
                <Link href="/checkout" onClick={toggleCart}>
                  <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginBottom: '8px' }}>
                    Proceed to Checkout
                  </button>
                </Link>
                <button onClick={toggleCart} className="btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
