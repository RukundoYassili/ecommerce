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
import { supabase } from '@/lib/supabase';

// ─── Hero Carousel ─────────────────────────────────────────────────────────

// ─── Cinematic Hero Carousel ───────────────────────────────────────────────

function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((c) => (c + 1) % heroSlides.length);
    }, 6000); // 6s duration for premium feel
    return () => clearInterval(timer);
  }, []);

  const slide = heroSlides[current];

  return (
    <div style={{ position: 'relative', height: '100vh', minHeight: '700px', overflow: 'hidden', background: '#000' }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1.2, ease: [0.33, 1, 0.68, 1] }}
          style={{ position: 'absolute', inset: 0 }}
        >
          <img
            src={slide.image}
            alt={slide.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.65 }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)' }} />

          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 80px', width: '100%' }}>
              <motion.span
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--gold)',
                  fontSize: '14px', fontWeight: 800, letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '24px'
                }}
              >
                <div style={{ width: '40px', height: '1px', background: 'var(--gold)' }} />
                {slide.badge || 'EST. 2026'}
              </motion.span>

              <motion.h1
                initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.8 }}
                style={{
                  fontFamily: 'Playfair Display, serif', fontSize: 'clamp(48px, 8vw, 100px)',
                  fontWeight: 900, color: 'white', lineHeight: 1.05, marginBottom: '24px', letterSpacing: '-2px'
                }}
              >
                {slide.title}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
                style={{
                    color: 'rgba(255,255,255,0.7)', fontSize: '20px', maxWidth: '520px',
                    lineHeight: 1.8, marginBottom: '48px', fontWeight: 400
                }}
              >
                {slide.subtitle}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}
                style={{ display: 'flex', gap: '20px' }}
              >
                <Link href={slide.ctaLink}>
                  <button className="btn-primary" style={{ padding: '18px 44px', fontSize: '16px', fontWeight: 800 }}>
                    {slide.cta} <ArrowRight size={20} />
                  </button>
                </Link>
                <Link href="/products/decor">
                   <button style={{
                     background: 'transparent', color: 'white', border: '1.5px solid white',
                     padding: '18px 44px', fontSize: '16px', fontWeight: 800, borderRadius: '4px', cursor: 'pointer', transition: 'all 0.3s'
                   }} 
                   onMouseEnter={(e) => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = 'black'; }}
                   onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'white'; }}>
                     View Lookbook
                   </button>
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }} 
        transition={{ repeat: Infinity, duration: 2 }}
        style={{ position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', opacity: 0.6 }}
      >
        <span style={{ color: 'white', fontSize: '10px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase' }}>SCROLL</span>
        <div style={{ width: '1px', height: '40px', background: 'linear-gradient(to bottom, white, transparent)' }} />
      </motion.div>

      {/* Navigation and Dots omitted for cleaner cinematic look, but can be added back if requested */}
    </div>
  );
}

// ─── Bento Category Grid ───────────────────────────────────────────────────

function CategoryGrid() {
  const bentoCategories = [
    { ...categories.find(c => c.slug === 'sofas'), span: 'col-span-2 row-span-2', height: '420px' },
    { ...categories.find(c => c.slug === 'beds'), span: 'col-span-1 row-span-2', height: '420px' },
    { ...categories.find(c => c.slug === 'dining'), span: 'col-span-1 row-span-1', height: '202px' },
    { ...categories.find(c => c.slug === 'decor'), span: 'col-span-1 row-span-1', height: '202px' },
    { ...categories.find(c => c.slug === 'storage'), span: 'col-span-1 row-span-1', height: '202px' },
    { ...categories.find(c => c.slug === 'chairs'), span: 'col-span-1 row-span-1', height: '202px' },
  ];

  return (
    <section style={{ padding: '100px 24px', background: 'white' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <p className="section-tag" style={{ color: 'var(--sienna)', letterSpacing: '4px', fontWeight: 800 }}>COLLECTIONS</p>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 800, marginTop: '12px', color: 'var(--charcoal)' }}>
            The Sanctuary Edit
          </h2>
          <p style={{ color: 'var(--gray-warm)', fontSize: '18px', maxWidth: '600px', margin: '16px auto 0' }}>
            Hand-assembled pieces designed to define your personal space.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gridAutoRows: 'minmax(200px, auto)',
          gap: '24px',
        }} className="bento-container">
          {bentoCategories.map((cat, i) => (
            <motion.div
              key={cat?.id || i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className={cat.span}
              style={{
                position: 'relative', overflow: 'hidden', borderRadius: '32px', cursor: 'pointer',
                height: cat.height, border: '1px solid var(--border)',
                gridColumn: cat.span?.includes('col-span-2') ? 'span 2' : 'span 1',
                gridRow: cat.span?.includes('row-span-2') ? 'span 2' : 'span 1',
              }}
            >
              <Link href={`/products/${cat?.slug}`} style={{ textDecoration: 'none', height: '100%', display: 'block' }}>
                <motion.div 
                  whileHover={{ scale: 1.05 }} 
                  transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
                  style={{ height: '100%', width: '100%' }}
                >
                   <img 
                     src={cat?.image} 
                     alt={cat?.name} 
                     style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                   />
                </motion.div>
                <div style={{ 
                  position: 'absolute', inset: 0, 
                  background: 'linear-gradient(to top, rgba(26,26,26,0.95) 0%, rgba(26,26,26,0.4) 30%, transparent 100%)',
                  display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '32px'
                }}>
                  <p style={{ color: 'var(--gold)', fontSize: '12px', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>
                    EXPLORE
                  </p>
                  <h3 style={{ color: 'white', fontFamily: 'Playfair Display, serif', fontSize: '24px', fontWeight: 700, margin: 0 }}>
                    {cat?.name}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px', opacity: 0.7, color: 'white' }}>
                     <span style={{ fontSize: '13px' }}>{cat?.count}+ Curated Items</span>
                     <ArrowRight size={14} />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
      <style jsx global>{`
        @media (max-width: 1024px) {
          .bento-container {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .brand-story-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
            text-align: center;
          }
          .promo-grid {
            grid-template-columns: 1fr !important;
          }
          .shop-look-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 640px) {
          .bento-container {
            grid-template-columns: 1fr !important;
          }
          .bento-container > div {
            grid-column: span 1 !important;
            grid-row: span 1 !important;
            height: 300px !important;
          }
        }
      `}</style>
    </section>
  );
}


// ─── Excellence Features ────────────────────────────────────────────────────

function ExcellenceFeatures() {
  const features = [
    { icon: <Award size={32} />, title: 'Premium Craftsmanship', desc: 'Each piece is hand-assembled by master artisans in Rwanda.' },
    { icon: <Truck size={32} />, title: 'Expedited Delivery', desc: 'Complimentary shipping across Kigali on orders over 750k RWF.' },
    { icon: <Shield size={32} />, title: 'Guaranteed Longevity', desc: 'Every item comes with a 2-year comprehensive sanctuary warranty.' },
    { icon: <RotateCcw size={32} />, title: 'Seamless Returns', desc: 'Not perfect? We offer a 14-day effortless collection & return.' },
  ];

  return (
    <section style={{ padding: '60px 24px', background: 'var(--charcoal)', color: 'white' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px' }}>
        {features.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}
          >
            <div style={{ color: 'var(--gold)', background: 'rgba(212, 168, 83, 0.1)', padding: '12px', borderRadius: '16px' }}>
              {f.icon}
            </div>
            <div>
              <h4 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>{f.title}</h4>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ─── Brand Story ────────────────────────────────────────────────────────────

function BrandStory() {
  return (
    <section style={{ padding: '100px 24px', background: 'var(--ivory)', overflow: 'hidden' }}>
      <div className="brand-story-grid" style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="section-tag" style={{ color: 'var(--sienna)', fontWeight: 800 }}>OUR HERITAGE</p>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, margin: '20px 0', lineHeight: 1.2 }}>
            Crafting the Soul of <br /> Rwandan Homes
          </h2>
          <p style={{ fontSize: '18px', color: 'var(--charcoal-light)', lineHeight: 1.8, marginBottom: '32px' }}>
            Founded in the heart of Kigali, B-FRESH was born from a vision to blend traditional Rwandan craftsmanship with global luxury standards. We believe furniture isn't just about utility—it's about creating a sanctuary where memories are made.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '40px' }}>
            <div>
              <p style={{ fontSize: '32px', fontWeight: 800, color: 'var(--sienna)', margin: 0 }}>15k+</p>
              <p style={{ fontSize: '14px', color: 'var(--gray-warm)', margin: 0 }}>Homes Transformed</p>
            </div>
            <div>
              <p style={{ fontSize: '32px', fontWeight: 800, color: 'var(--sienna)', margin: 0 }}>24/7</p>
              <p style={{ fontSize: '14px', color: 'var(--gray-warm)', margin: 0 }}>White Glove Support</p>
            </div>
          </div>
          <Link href="/about">
            <button className="btn-outline-sienna" style={{ padding: '14px 36px' }}>
              Explore Our Story <ArrowRight size={18} />
            </button>
          </Link>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ position: 'relative' }}
        >
          <div style={{ position: 'relative', borderRadius: '40px', overflow: 'hidden', height: '600px', boxShadow: '0 40px 80px rgba(0,0,0,0.15)' }}>
            <img src="https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=1200&q=80" alt="Craftsmanship" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ 
            position: 'absolute', bottom: '-40px', left: '-40px', background: 'white', padding: '32px', 
            borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', maxWidth: '240px'
          }}>
            <p style={{ fontStyle: 'italic', color: 'var(--charcoal-light)', fontSize: '14px', margin: 0 }}>
              "Quality is the only bridge between a house and a home."
            </p>
            <p style={{ fontWeight: 800, marginTop: '12px', fontSize: '13px' }}>— CEO, B-FRESH</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}


// ─── Featured Products (8 cards, 5-category pill tabs) ───────────────────────

const FEAT_TABS = [
  { label: 'Top Rated', key: 'all' },
  { label: 'Sofas', key: 'sofas' },
  { label: 'Beds', key: 'beds' },
  { label: 'Dining', key: 'dining' },
  { label: 'Chairs', key: 'chairs' },
];

function FeaturedProducts() {
  const [list, setList] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('all');

  useEffect(() => {
    setLoading(true);
    let q = supabase.from('products').select('*').limit(8);
    q = tab === 'all'
      ? q.order('rating', { ascending: false })
      : q.eq('category', tab).order('rating', { ascending: false });
    q.then(({ data }) => {
      if (data) setList(data.map((p: any) => ({
        ...p, image: p.image_url, originalPrice: p.original_price,
        inStock: p.in_stock, isNew: p.is_new, isBestseller: p.rating >= 4.7
      })));
      setLoading(false);
    });
  }, [tab]);

  return (
    <section style={{ padding: '100px 24px', background: 'var(--ivory)' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header + pill tabs */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <p className="section-tag" style={{ color: 'var(--sienna)', fontWeight: 800 }}>CURATED SELECTION</p>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, margin: '12px 0 32px' }}>
            Bestselling Furniture
          </h2>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {FEAT_TABS.map(t => (
              <button key={t.key} onClick={() => setTab(t.key)} style={{
                padding: '10px 24px', borderRadius: '40px', border: 'none', cursor: 'pointer',
                fontWeight: 700, fontSize: '14px', transition: 'all 0.3s',
                background: tab === t.key ? 'var(--sienna)' : 'white',
                color: tab === t.key ? 'white' : 'var(--charcoal)',
                boxShadow: tab === t.key ? '0 4px 16px rgba(183,94,55,0.3)' : '0 2px 8px rgba(0,0,0,0.06)',
              }}>{t.label}</button>
            ))}
          </div>
        </div>

        {/* 8-product grid */}
        <AnimatePresence mode="wait">
          <motion.div key={tab}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '28px' }}>
            {loading
              ? Array(8).fill(0).map((_, i) => <div key={i} style={{ height: '380px', borderRadius: '16px', background: '#f0f0f0' }} />)
              : list.map(p => <ProductCard key={p.id} product={p} />)
            }
          </motion.div>
        </AnimatePresence>

        {/* CTA */}
        <div style={{ textAlign: 'center', marginTop: '56px' }}>
          <Link
            href={tab === 'all' ? '/products/sofas' : `/products/${tab}`}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '16px 48px', borderRadius: '4px', border: '2px solid var(--sienna)',
              color: 'var(--sienna)', fontWeight: 800, fontSize: '15px', textDecoration: 'none',
            }}
          >
            View All {tab === 'all' ? 'Collections' : tab.charAt(0).toUpperCase() + tab.slice(1)} <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── New Arrivals (horizontal scroll carousel, 10 cards) ────────────────────

function NewArrivals() {
  const [arrivals, setArrivals] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.from('products').select('*').eq('is_new', true).order('created_at', { ascending: false }).limit(10)
      .then(({ data }) => {
        if (data) setArrivals(data.map((p: any) => ({
          ...p, image: p.image_url, originalPrice: p.original_price,
          inStock: p.in_stock, isNew: p.is_new, isBestseller: p.rating >= 4.7
        })));
        setLoading(false);
      });
  }, []);

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: dir === 'right' ? 320 : -320, behavior: 'smooth' });
  };

  return (
    <section style={{ padding: '100px 0', background: 'white', overflow: 'hidden' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
          <div>
            <p className="section-tag" style={{ color: 'var(--sienna)', fontWeight: 800 }}>JUST LANDED</p>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, marginTop: '8px' }}>
              New Arrivals
            </h2>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button onClick={() => scroll('left')} style={{ width: '44px', height: '44px', borderRadius: '50%', border: '1.5px solid var(--border)', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--sienna)'; (e.currentTarget as HTMLElement).style.color = 'white'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--sienna)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'white'; (e.currentTarget as HTMLElement).style.color = 'inherit'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; }}
            ><ChevronLeft size={18} /></button>
            <button onClick={() => scroll('right')} style={{ width: '44px', height: '44px', borderRadius: '50%', border: '1.5px solid var(--border)', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--sienna)'; (e.currentTarget as HTMLElement).style.color = 'white'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--sienna)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'white'; (e.currentTarget as HTMLElement).style.color = 'inherit'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; }}
            ><ChevronRight size={18} /></button>
            <Link href="/products/sofas" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--sienna)', fontWeight: 700, fontSize: '14px', textDecoration: 'none' }}>
              View All <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* Horizontal scroll rail — full width */}
      <div
        ref={scrollRef}
        style={{
          display: 'flex', gap: '24px', overflowX: 'auto', paddingLeft: 'max(24px, calc((100vw - 1400px) / 2))',
          paddingRight: '24px', paddingBottom: '8px', scrollbarWidth: 'none',
        }}
      >
        {(loading ? Array(8).fill(null) : arrivals).map((product, i) =>
          product ? (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              style={{ flexShrink: 0, width: '300px' }}
            >
              <ProductCard product={product} />
            </motion.div>
          ) : (
            <div key={i} style={{ flexShrink: 0, width: '300px', height: '380px', borderRadius: '16px', background: '#f0f0f0' }} />
          )
        )}
      </div>
    </section>
  );
}

// ─── Promo Banner ────────────────────────────────────────────────────────────

function PromoBanner() {
  return (
    <section style={{ padding: '0 24px', margin: '0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div className="promo-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
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
        <div className="shop-look-grid" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px' }}>
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

// ─── Floating Trust Badge ───────────────────────────────────────────────────

function FloatingTrustBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 2, duration: 1 }}
      style={{
        position: 'fixed', bottom: '30px', right: '30px', zIndex: 1000,
        background: 'white', padding: '12px 20px', borderRadius: '40px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', gap: '12px',
        border: '1.5px solid var(--border)', cursor: 'pointer',
      }}
    >
      {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="#D4A853" color="#D4A853" />)}
      <p style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: 'var(--charcoal)' }}>
        15k+ Verified in Rwanda
      </p>
    </motion.div>
  );
}

// ─── Main Homepage ────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <>
      <HeroCarousel />
      <CategoryGrid />
      <ExcellenceFeatures />
      <FeaturedProducts />
      <BrandStory />
      <NewArrivals />
      <PromoBanner />
      <ShopTheLook />
      <Testimonials />
      <Newsletter />
      <FloatingTrustBadge />
    </>
  );
}
