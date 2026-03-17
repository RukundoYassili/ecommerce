'use client';
import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight, Star, Heart, ShoppingBag, Truck, RotateCcw, Shield, Award, ChevronDown, Play } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import {
  products, categories, heroSlides, testimonials,
  getFeaturedProducts, getNewArrivals, formatPrice,
  type Product
} from '@/lib/data';
import toast from 'react-hot-toast';
import ProductCard from '@/components/product/ProductCard';

// ─── Hero Carousel ─────────────────────────────────────────────────────────

function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((c) => (c + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goTo = (idx: number) => {
    setDirection(idx > current ? 1 : -1);
    setCurrent(idx);
  };

  const slide = heroSlides[current];

  return (
    <div style={{ position: 'relative', height: 'min(90vh, 700px)', overflow: 'hidden' }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          style={{ position: 'absolute', inset: 0 }}
        >
          {/* Background image */}
          <img
            src={slide.image}
            alt={slide.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          {/* Gradient overlay */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(100deg, rgba(26,26,26,0.75) 0%, rgba(26,26,26,0.3) 60%, transparent 100%)' }} />

          {/* Content */}
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 60px', width: '100%' }}>
              {slide.badge && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                  style={{
                    display: 'inline-block', background: 'var(--sienna)',
                    color: 'white', padding: '6px 16px', borderRadius: '20px',
                    fontSize: '12px', fontWeight: 600, letterSpacing: '1px',
                    marginBottom: '20px', textTransform: 'uppercase',
                  }}
                >
                  {slide.badge}
                </motion.div>
              )}
              <motion.h1
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: 'clamp(40px, 6vw, 72px)',
                  fontWeight: 700, color: 'white',
                  lineHeight: 1.1, marginBottom: '20px',
                  whiteSpace: 'pre-line',
                }}
              >
                {slide.title}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                style={{
                  color: 'rgba(255,255,255,0.8)', fontSize: 'clamp(14px, 1.5vw, 18px)',
                  maxWidth: '480px', lineHeight: 1.7, marginBottom: '36px',
                }}
              >
                {slide.subtitle}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}
              >
                <Link href={slide.ctaLink}>
                  <button className="btn-primary" style={{ fontSize: '15px', padding: '14px 32px' }}>
                    {slide.cta} <ArrowRight size={18} />
                  </button>
                </Link>
                <Link href="/products/decor">
                  <button style={{
                    background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)',
                    color: 'white', border: '1.5px solid rgba(255,255,255,0.4)',
                    padding: '14px 32px', borderRadius: '4px', fontSize: '15px',
                    fontWeight: 600, cursor: 'pointer', transition: 'all 0.3s',
                    display: 'flex', alignItems: 'center', gap: '8px',
                  }}>
                    View Collections
                  </button>
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation arrows */}
      {[
        { dir: -1, icon: ChevronLeft, pos: 'left: 24px' },
        { dir: 1, icon: ChevronRight, pos: 'right: 24px' },
      ].map(({ dir, icon: Icon, pos }) => (
        <button
          key={pos}
          onClick={() => { setDirection(dir); setCurrent((c) => (c + dir + heroSlides.length) % heroSlides.length); }}
          style={{
            position: 'absolute', top: '50%', transform: 'translateY(-50%)',
            [pos.split(':')[0].trim()]: pos.split(':')[1].trim(),
            background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.3)', borderRadius: '50%',
            width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'white', transition: 'background 0.2s', zIndex: 10,
          }}
        >
          <Icon size={22} />
        </button>
      ))}

      {/* Dots */}
      <div style={{ position: 'absolute', bottom: '28px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px', zIndex: 10 }}>
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            style={{
              border: 'none', cursor: 'pointer', padding: 0,
              width: i === current ? '28px' : '8px', height: '8px',
              borderRadius: '4px', background: i === current ? 'white' : 'rgba(255,255,255,0.4)',
              transition: 'all 0.3s',
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Category Grid ──────────────────────────────────────────────────────────

function CategoryGrid() {
  return (
    <section style={{ padding: '80px 24px', background: 'white' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <p className="section-tag">Browse by Category</p>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, marginTop: '8px' }}>
            Shop Every Room
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: '16px',
        }}>
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href={`/products/${cat.slug}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  borderRadius: '12px', overflow: 'hidden', position: 'relative',
                  aspectRatio: '1', cursor: 'pointer',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-6px)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 16px 40px rgba(0,0,0,0.12)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = '';
                  (e.currentTarget as HTMLElement).style.boxShadow = '';
                }}>
                  <img src={cat.image} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(26,26,26,0.8) 0%, transparent 60%)' }} />
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '12px' }}>
                    <p style={{ color: 'white', fontWeight: 700, fontSize: '13px', marginBottom: '2px' }}>{cat.name}</p>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px' }}>{cat.count}+ items</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Product Card ───────────────────────────────────────────────────────────



import { supabase } from '@/lib/supabase';

// ─── Featured Products ───────────────────────────────────────────────────────

function FeaturedProducts() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('rating', { ascending: false })
        .limit(4);

      if (data) {
        const mapped = data.map((p: any) => ({
          ...p,
          id: p.id,
          image: p.image_url,
          originalPrice: p.original_price,
          inStock: p.in_stock,
          isNew: p.is_new,
          isBestseller: p.rating >= 4.8
        }));
        setFeatured(mapped);
      }
      setLoading(false);
    };
    fetchFeatured();
  }, []);

  if (loading) return null;

  return (
    <section style={{ padding: '80px 24px', background: 'var(--ivory)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <p className="section-tag">Handpicked for You</p>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, marginTop: '8px' }}>
              Bestsellers
            </h2>
          </div>
          <Link href="/products/sofas" className="btn-outline-sienna" style={{ display: 'flex' }}>
            View All <ArrowRight size={16} />
          </Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
          {featured.map((product, i) => (
            <motion.div key={product.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── New Arrivals ────────────────────────────────────────────────────────────

function NewArrivals() {
  const [arrivals, setArrivals] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArrivals = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_new', true)
        .limit(4);

      if (data) {
        const mapped = data.map((p: any) => ({
          ...p,
          id: p.id,
          image: p.image_url,
          originalPrice: p.original_price,
          inStock: p.in_stock,
          isNew: p.is_new,
          isBestseller: p.rating >= 4.8
        }));
        setArrivals(mapped);
      }
      setLoading(false);
    };
    fetchArrivals();
  }, []);

  if (loading) return null;

  return (
    <section style={{ padding: '80px 24px', background: 'white' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <p className="section-tag">Just Landed</p>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, marginTop: '8px' }}>New Arrivals</h2>
          </div>
          <Link href="/products/sofas" className="btn-outline-sienna" style={{ display: 'flex' }}>
            View All <ArrowRight size={16} />
          </Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
          {arrivals.map((product, i) => (
            <motion.div key={product.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Promo Banner ────────────────────────────────────────────────────────────

function PromoBanner() {
  return (
    <section style={{ padding: '0 24px', margin: '0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {[
            {
              title: 'The Bedroom Edit',
              sub: 'Up to 30% off beds & mattresses',
              cta: 'Shop Beds',
              href: '/products/beds',
              image: 'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=800&q=80',
              dark: true,
            },
            {
              title: 'Dining in Style',
              sub: 'Marble, teak & more — new in',
              cta: 'Shop Dining',
              href: '/products/dining',
              image: 'https://images.unsplash.com/photo-1617806118233-18e1c12d40ab?w=1200&q=80',
              dark: false,
            },
          ].map((promo, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              style={{
                position: 'relative', height: '340px', borderRadius: '16px', overflow: 'hidden', cursor: 'pointer',
              }}
            >
              <img src={promo.image} alt={promo.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }} />
              <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, rgba(26,26,26,${promo.dark ? '0.75' : '0.6'}) 0%, transparent 70%)` }} />
              <div style={{ position: 'absolute', bottom: '32px', left: '32px' }}>
                <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '26px', fontWeight: 700, color: 'white', marginBottom: '6px' }}>{promo.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '14px', marginBottom: '20px' }}>{promo.sub}</p>
                <Link href={promo.href}>
                  <button style={{
                    background: 'white', color: 'var(--charcoal)',
                    border: 'none', padding: '10px 22px', borderRadius: '4px',
                    fontWeight: 700, fontSize: '13px', cursor: 'pointer',
                    transition: 'background 0.2s', display: 'flex', alignItems: 'center', gap: '6px',
                  }}>
                    {promo.cta} <ArrowRight size={14} />
                  </button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Shop The Look ───────────────────────────────────────────────────────────

function ShopTheLook() {
  return (
    <section style={{ padding: '80px 24px', background: 'var(--cream)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <p className="section-tag">Room Inspiration</p>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, marginTop: '8px' }}>Shop The Look</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px' }}>
          <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', height: '440px' }}>
            <img src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=900&q=80" alt="Living room" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(26,26,26,0.2)' }} />
            {/* Hotspot pins */}
            {[
              { top: '45%', left: '30%', label: 'Vesta Chair — R18,999' },
              { top: '70%', left: '55%', label: 'Travertine Table — R15,999' },
            ].map((pin, i) => (
              <div key={i} style={{ position: 'absolute', top: pin.top, left: pin.left, transform: 'translate(-50%, -50%)' }}>
                <div style={{
                  width: '28px', height: '28px', background: 'white', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 0 0 4px rgba(255,255,255,0.3)', cursor: 'pointer', position: 'relative',
                }}>
                  <div style={{ width: '10px', height: '10px', background: 'var(--sienna)', borderRadius: '50%' }} />
                  <div style={{
                    position: 'absolute', bottom: '36px', left: '50%', transform: 'translateX(-50%)',
                    background: 'white', padding: '6px 12px', borderRadius: '6px', whiteSpace: 'nowrap',
                    fontSize: '12px', fontWeight: 600, boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  }}>
                    {pin.label}
                  </div>
                </div>
              </div>
            ))}
            <div style={{ position: 'absolute', bottom: '24px', left: '24px' }}>
              <span style={{ background: 'white', color: 'var(--charcoal)', padding: '8px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 700 }}>Living Room Look</span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', flex: 1 }}>
              <img src="https://images.unsplash.com/photo-1505693314120-0d443867891c?w=600&q=80" alt="Bedroom" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(26,26,26,0.3)' }} />
              <div style={{ position: 'absolute', bottom: '20px', left: '20px' }}>
                <span style={{ background: 'white', color: 'var(--charcoal)', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 700 }}>Bedroom Look</span>
              </div>
            </div>
            <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', flex: 1 }}>
              <img src="https://images.unsplash.com/photo-1617806118233-18e1c12d40ab?w=1200&q=80" alt="Dining" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(26,26,26,0.3)' }} />
              <div style={{ position: 'absolute', bottom: '20px', left: '20px' }}>
                <span style={{ background: 'white', color: 'var(--charcoal)', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 700 }}>Dining Look</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

function Testimonials() {
  return (
    <section style={{ padding: '80px 24px', background: 'white' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <p className="section-tag">Customer Stories</p>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, marginTop: '8px' }}>What Our Customers Say</h2>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '12px' }}>
            <div style={{ display: 'flex' }}>
              {[1,2,3,4,5].map((s) => <Star key={s} size={18} fill="#D4A853" color="#D4A853" />)}
            </div>
            <span style={{ fontWeight: 700, fontSize: '16px' }}>4.8</span>
            <span style={{ color: 'var(--gray-warm)', fontSize: '14px' }}>from 10,000+ reviews</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              style={{
                background: 'var(--ivory)', border: '1px solid var(--border)',
                borderRadius: '16px', padding: '24px',
              }}
            >
              <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
                {[1,2,3,4,5].map((s) => <Star key={s} size={14} fill={s <= t.rating ? '#D4A853' : 'none'} color={s <= t.rating ? '#D4A853' : '#CCC'} />)}
              </div>
              <p style={{ fontSize: '14px', lineHeight: 1.7, color: 'var(--charcoal-light)', marginBottom: '20px', fontStyle: 'italic' }}>
                "{t.text}"
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img src={t.avatar} alt={t.name} style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }} />
                <div>
                  <p style={{ fontWeight: 700, fontSize: '14px' }}>{t.name}</p>
                  <p style={{ fontSize: '12px', color: 'var(--gray-warm)' }}>{t.location} • {t.product}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Newsletter ───────────────────────────────────────────────────────────────

function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) { setSubmitted(true); toast.success('Thanks for subscribing!'); }
  };

  return (
    <section style={{
      padding: '80px 24px',
      background: 'linear-gradient(135deg, var(--charcoal) 0%, #2D2D2D 100%)',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '400px', height: '400px', background: 'var(--sienna)', borderRadius: '50%', opacity: 0.1 }} />
      <div style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: '300px', height: '300px', background: 'var(--gold)', borderRadius: '50%', opacity: 0.08 }} />
      <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', position: 'relative' }}>
        <p className="section-tag" style={{ color: 'var(--gold)' }}>Stay Updated</p>
        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, color: 'white', marginTop: '8px', marginBottom: '16px' }}>
          Get Exclusive Offers & Design Tips
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '15px', marginBottom: '36px', lineHeight: 1.6 }}>
          Subscribe to Our newsletter for early access to new collections, flash sales, and interior design inspiration.
        </p>

        {submitted ? (
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ color: 'var(--gold)', fontSize: '18px', fontWeight: 700 }}>
            🎉 You're subscribed! Welcome to B-FRESH family.
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Enter your email address"
              style={{
                flex: 1, minWidth: '240px', padding: '14px 20px', borderRadius: '4px',
                border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.08)',
                color: 'white', fontSize: '14px', outline: 'none',
              }}
            />
            <button type="submit" className="btn-primary" style={{ padding: '14px 28px' }}>
              Subscribe <ArrowRight size={16} />
            </button>
          </form>
        )}
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px', marginTop: '16px' }}>No spam, ever. Unsubscribe anytime.</p>
      </div>
    </section>
  );
}

// ─── Main Homepage ────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <>
      <HeroCarousel />
      <CategoryGrid />
      <FeaturedProducts />
      <PromoBanner />
      <NewArrivals />
      <ShopTheLook />
      <Testimonials />
      <Newsletter />
    </>
  );
}
