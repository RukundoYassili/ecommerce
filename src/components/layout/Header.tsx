'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, ShoppingBag, Heart, User, Menu, X, ChevronDown,
  Phone, MapPin, Truck, RotateCcw, Shield
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { categories, products } from '@/lib/data';
import { useAuth } from '@/context/AuthContext';

const navItems = [
  { label: 'Living Room', href: '/products/living-room', sub: ['Sofas', 'Lounge Chairs', 'Coffee Tables', 'TV Units', 'Recliners'] },
  { label: 'Bedroom', href: '/products/bedroom', sub: ['Beds', 'Wardrobes', 'Mattresses', 'Dressing Tables', 'Bedside Tables'] },
  { label: 'Dining', href: '/products/dining', sub: ['Dining Sets', 'Dining Chairs', 'Bar Furniture', 'Kitchen Cabinets'] },
  { label: 'Chairs', href: '/products/chairs', sub: ['Lounge Chairs', 'Office Chairs', 'Dining Chairs', 'Accent Chairs'] },
  { label: 'Storage', href: '/products/storage', sub: ['Wardrobes', 'Bookshelves', 'Chest of Drawers', 'Shoe Racks'] },
  { label: 'Decor', href: '/products/decor', sub: ['Lamps', 'Mirrors', 'Carpets', 'Cushions', 'Wall Decor'] },
  { label: 'Sale 🔥', href: '/products/sale', sub: [] },
];

import { supabase } from '@/lib/supabase';

export default function Header() {
  const { totalItems, toggleCart } = useCart();
  const { count: wishCount } = useWishlist();
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [activeNav, setActiveNav] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (searchQuery.length > 2) {
      const delayDebounceFn = setTimeout(async () => {
        setSearching(true);
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .or(`name.ilike.%${searchQuery}%,category.ilike.%${searchQuery}%,subcategory.ilike.%${searchQuery}%`)
          .limit(8);

        if (data) {
          setSearchResults(data);
        }
        setSearching(false);
      }, 300);

      return () => clearTimeout(delayDebounceFn);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  return (
    <>
      {/* Top announcement bar */}
      <div className="hidden md:block" style={{ background: 'var(--charcoal)', color: 'white', padding: '8px 0', fontSize: '12px', textAlign: 'center', letterSpacing: '1px' }}>
        <span>🚚 FREE DELIVERY on orders over 750,000 RWF &nbsp;|&nbsp; 📞 <a href="tel:+250788885231" style={{ color: 'var(--gold)' }}>+250 788 885 231</a> &nbsp;|&nbsp; 🏪 Visit Our Musanze Showroom</span>
      </div>

      {/* Main header */}
      <header
        style={{
          position: 'sticky', top: 0, zIndex: 1000,
          background: scrolled ? 'rgba(250,247,242,0.97)' : '#FAF7F2',
          backdropFilter: scrolled ? 'blur(10px)' : 'none',
          borderBottom: '1px solid var(--border)',
          transition: 'all 0.3s ease',
          boxShadow: scrolled ? '0 4px 20px rgba(26,26,26,0.08)' : 'none',
        }}
      >
        {/* Header main row */}
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px', height: '72px', display: 'flex', alignItems: 'center', gap: '24px' }}>
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--charcoal)' }}
          >
            <Menu size={24} />
          </button>

          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
              <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '22px', fontWeight: 700, color: 'var(--charcoal)', letterSpacing: '-0.5px' }}>
                B-FRESH
              </span>
              <span style={{ fontSize: '9px', color: 'var(--sienna)', letterSpacing: '3px', fontWeight: 600, textTransform: 'uppercase' }}>
                TRADING LTD
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex" style={{ flex: 1, justifyContent: 'center', gap: 0 }}>
            {navItems.map((item) => (
              <div
                key={item.label}
                style={{ position: 'relative' }}
                onMouseEnter={() => setActiveNav(item.label)}
                onMouseLeave={() => setActiveNav(null)}
              >
                <Link
                  href={item.href}
                  style={{
                    textDecoration: 'none',
                    color: item.label === 'Sale 🔥' ? 'var(--sienna)' : 'var(--charcoal)',
                    fontSize: '13px',
                    fontWeight: 600,
                    padding: '24px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    letterSpacing: '0.3px',
                    borderBottom: activeNav === item.label ? '2px solid var(--sienna)' : '2px solid transparent',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {item.label}
                  {item.sub.length > 0 && <ChevronDown size={12} style={{ transition: 'transform 0.2s', transform: activeNav === item.label ? 'rotate(180deg)' : 'rotate(0deg)' }} />}
                </Link>

                {/* Mega-menu dropdown */}
                <AnimatePresence>
                  {activeNav === item.label && item.sub.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.15 }}
                      style={{
                        position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
                        background: 'white', border: '1px solid var(--border)',
                        borderRadius: '8px', padding: '16px', minWidth: '180px',
                        boxShadow: '0 16px 48px rgba(26,26,26,0.12)',
                        zIndex: 1001,
                      }}
                    >
                      {item.sub.map((sub) => (
                        <Link
                          key={sub}
                          href={item.href}
                          style={{
                            display: 'block', padding: '8px 12px', fontSize: '13px',
                            color: 'var(--charcoal-light)', textDecoration: 'none',
                            borderRadius: '4px', transition: 'all 0.15s',
                          }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'var(--cream)'; (e.currentTarget as HTMLAnchorElement).style.color = 'var(--sienna)'; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'none'; (e.currentTarget as HTMLAnchorElement).style.color = 'var(--charcoal-light)'; }}
                        >
                          {sub}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          {/* Right icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginLeft: 'auto' }}>
            {/* Search */}
            <button
              onClick={() => setSearchOpen(true)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--charcoal)', padding: '4px' }}
            >
              <Search size={20} />
            </button>

            {/* Wishlist */}
            <Link href="/wishlist" style={{ position: 'relative', color: 'var(--charcoal)', lineHeight: 0 }}>
              <Heart size={20} />
              {mounted && wishCount > 0 && (
                <span style={{
                  position: 'absolute', top: '-8px', right: '-8px',
                  background: 'var(--sienna)', color: 'white',
                  borderRadius: '50%', width: '18px', height: '18px',
                  fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700,
                }}>{wishCount}</span>
              )}
            </Link>

            {/* Cart */}
            <button
              onClick={toggleCart}
              style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--charcoal)', padding: '4px' }}
            >
              <ShoppingBag size={20} />
              {mounted && totalItems > 0 && (
                <span style={{
                  position: 'absolute', top: '-8px', right: '-8px',
                  background: 'var(--sienna)', color: 'white',
                  borderRadius: '50%', width: '18px', height: '18px',
                  fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700,
                }}>{totalItems}</span>
              )}
            </button>

            {/* Account */}
            {user ? (
              <div style={{ position: 'relative' }} onMouseEnter={() => setActiveNav('user')} onMouseLeave={() => setActiveNav(null)}>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', padding: '4px' }}>
                  <img src={user.avatar} alt={user.name} style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid var(--sienna)' }} />
                </button>
                <AnimatePresence>
                  {activeNav === 'user' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                      style={{ position: 'absolute', top: '100%', right: 0, background: 'white', border: '1px solid var(--border)', borderRadius: '8px', padding: '8px', minWidth: '160px', boxShadow: '0 16px 48px rgba(26,26,26,0.12)', zIndex: 1001 }}
                    >
                      <p style={{ padding: '8px 12px', fontSize: '13px', fontWeight: 700, margin: 0, borderBottom: '1px solid var(--border)', marginBottom: '4px' }}>Hi, {user.name.split(' ')[0]}</p>
                      <Link href="/account" style={{ display: 'block', padding: '8px 12px', fontSize: '13px', color: 'var(--charcoal-light)', textDecoration: 'none', borderRadius: '4px' }}>My Account</Link>
                      <Link href="/account/orders" style={{ display: 'block', padding: '8px 12px', fontSize: '13px', color: 'var(--charcoal-light)', textDecoration: 'none', borderRadius: '4px' }}>Orders</Link>
                      <button onClick={logout} style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: '8px 12px', fontSize: '13px', color: '#E53935', cursor: 'pointer', fontWeight: 600 }}>Logout</button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link href="/auth/login" style={{ color: 'var(--charcoal)', lineHeight: 0 }}>
                <User size={20} />
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Search overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(26,26,26,0.85)',
              zIndex: 2000, display: 'flex', alignItems: 'flex-start', paddingTop: '80px',
              backdropFilter: 'blur(8px)'
            }}
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -30, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{ width: '100%', maxWidth: '720px', margin: '0 auto', padding: '0 24px' }}
            >
              <div style={{
                background: 'white', borderRadius: '16px', padding: '12px 20px',
                display: 'flex', alignItems: 'center', gap: '16px',
                boxShadow: '0 32px 80px rgba(0,0,0,0.4)',
              }}>
                <Search size={22} style={{ color: 'var(--sienna)' }} />
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for sofas, beds, dining tables..."
                  style={{
                    flex: 1, border: 'none', outline: 'none',
                    fontSize: '18px', color: 'var(--charcoal)', background: 'none', padding: '12px 0',
                    fontFamily: 'inherit'
                  }}
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                    <X size={18} style={{ color: 'var(--gray-warm)' }} />
                  </button>
                )}
                <div style={{ width: '1px', height: '24px', background: 'var(--border)' }} />
                <button onClick={() => setSearchOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 600, color: 'var(--charcoal-light)' }}>
                  Close
                </button>
              </div>

              {/* Search Results */}
              <AnimatePresence>
                {searchQuery.length > 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    style={{
                      background: 'white', marginTop: '12px', borderRadius: '16px',
                      maxHeight: '480px', overflowY: 'auto', padding: '16px',
                      boxShadow: '0 20px 48px rgba(0,0,0,0.2)'
                    }}
                  >
                    <p style={{ fontSize: '12px', color: 'var(--gray-warm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px', padding: '0 12px' }}>
                      Search Results
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {searching && (
                        <div style={{ padding: '20px', textAlign: 'center' }}>
                          <p style={{ color: 'var(--gray-warm)', fontSize: '14px' }}>Searching...</p>
                        </div>
                      )}
                      {!searching && searchResults.map((product) => (
                          <Link
                            key={product.id}
                            href={`/products/${product.category}/${product.id}`}
                            onClick={() => setSearchOpen(false)}
                            style={{
                              display: 'flex', alignItems: 'center', gap: '16px', padding: '12px',
                              borderRadius: '12px', textDecoration: 'none', color: 'inherit',
                              transition: 'all 0.2s', border: '1px solid transparent'
                            }}
                            onMouseEnter={(e) => {
                              (e.currentTarget as HTMLElement).style.background = 'var(--cream)';
                              (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
                            }}
                            onMouseLeave={(e) => {
                              (e.currentTarget as HTMLElement).style.background = 'none';
                              (e.currentTarget as HTMLElement).style.borderColor = 'transparent';
                            }}
                          >
                            <div style={{ width: '60px', height: '60px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0, background: '#F5F2EE' }}>
                              <img src={product.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <div style={{ flex: 1 }}>
                              <h4 style={{ fontSize: '14px', fontWeight: 600, margin: 0 }}>{product.name}</h4>
                              <p style={{ fontSize: '12px', color: 'var(--gray-warm)', margin: '2px 0 0' }}>{product.subcategory}</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--sienna)' }}>RWF {product.price.toLocaleString()}</span>
                            </div>
                          </Link>
                        ))}
                      
                      {!searching && searchQuery.length > 2 && searchResults.length === 0 && (
                        <div style={{ padding: '40px 24px', textAlign: 'center' }}>
                          <p style={{ color: 'var(--gray-warm)', fontSize: '14px' }}>No products found for "{searchQuery}"</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Trending Searches */}
              {!searchQuery && (
                <div style={{ display: 'flex', gap: '8px', marginTop: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
                  <span style={{ color: 'white', fontSize: '13px', marginRight: '8px', opacity: 0.8 }}>Trending:</span>
                  {['Sofas', 'King Beds', 'Dining Sets', 'Coffee Tables', 'Wardrobes'].map((s) => (
                    <span
                      key={s}
                      onClick={() => setSearchQuery(s.toLowerCase())}
                      style={{
                        background: 'rgba(255,255,255,0.15)', color: 'white',
                        padding: '8px 16px', borderRadius: '30px', fontSize: '13px',
                        cursor: 'pointer', fontWeight: 500, border: '1px solid rgba(255,255,255,0.1)',
                        transition: 'all 0.2s', backdropFilter: 'blur(4px)'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.25)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.15)')}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile menu drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1500 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              style={{
                position: 'fixed', top: 0, left: 0, bottom: 0, width: '300px',
                background: '#FAF7F2', zIndex: 1600, overflowY: 'auto', padding: '24px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '20px', fontWeight: 700 }}>B-FRESH</span>
                <button onClick={() => setMobileOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  <X size={24} />
                </button>
              </div>
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    display: 'block', padding: '14px 0',
                    borderBottom: '1px solid var(--border)',
                    color: item.label === 'Sale 🔥' ? 'var(--sienna)' : 'var(--charcoal)',
                    textDecoration: 'none', fontWeight: 600, fontSize: '15px',
                  }}
                >
                  {item.label}
                </Link>
              ))}
              <div style={{ marginTop: '32px' }}>
                <Link href="/auth/login" onClick={() => setMobileOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--charcoal)', textDecoration: 'none', fontSize: '14px', padding: '10px 0' }}>
                  <User size={18} /> Login / Register
                </Link>
                <a href="tel:+250788885231" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--charcoal)', textDecoration: 'none', fontSize: '14px', padding: '10px 0' }}>
                  <Phone size={18} /> +250 788 885 231
                </a>
                <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--charcoal)', textDecoration: 'none', fontSize: '14px', padding: '10px 0' }}>
                  <MapPin size={18} /> Musanze, Rwanda
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
