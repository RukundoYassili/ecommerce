'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Heart, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { formatPrice, type Product } from '@/lib/data';
import toast from 'react-hot-toast';

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(product.id);
  
  // Hover Gallery State
  const [hoverIndex, setHoverIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const gallery = [product.image, ...(product.images || [])].slice(0, 4); 

  // Random Scarcity Badge (Generated once on mount to prevent hydration mismatch)
  const [badge, setBadge] = useState<{text: string, color: string} | null>(null);
  
  useEffect(() => {
    if (Math.random() > 0.7) {
      const badges = [
        { text: `🔥 ${Math.floor(Math.random() * 40 + 10)} bought today`, color: '#E53935' },
        { text: `⚡ Only ${Math.floor(Math.random() * 4 + 1)} left!`, color: '#D32F2F' },
        { text: `👀 14 viewing now`, color: '#1976D2' },
        { text: `⭐ Top Rated in Kigali`, color: '#D4A853' }
      ];
      setBadge(badges[Math.floor(Math.random() * badges.length)]);
    }
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (gallery.length <= 1) return;
    const { left, width } = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - left;
    const sectionWidth = width / gallery.length;
    const newIndex = Math.min(Math.floor(x / sectionWidth), gallery.length - 1);
    setHoverIndex(newIndex);
  };

  return (
    <div 
      className="product-card" 
      style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border)', position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setHoverIndex(0); }}
    >
      <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', gap: '6px', zIndex: 3, flexDirection: 'column', alignItems: 'flex-start' }}>
        {product.isNew && <span style={{ background: 'var(--charcoal)', color: 'white', fontSize: '9px', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>NEW ARRIVAL</span>}
        {product.isBestseller && <span style={{ background: 'var(--gold)', color: 'var(--charcoal)', fontSize: '9px', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>BESTSELLER</span>}
        {product.discount > 0 && <span style={{ background: '#E53935', color: 'white', fontSize: '10px', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>-{product.discount}% OFF</span>}
      </div>

      <button 
        onClick={(e) => { e.preventDefault(); toggleWishlist(product); }} 
        style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 3, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)', border: 'none', cursor: 'pointer', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', transition: 'transform 0.2s' }}
      >
        <Heart size={14} fill={wishlisted ? '#C0541A' : 'none'} color={wishlisted ? '#C0541A' : '#1A1A1A'} />
      </button>

      <Link href={`/products/${product.category}/${product.id}`} style={{ display: 'block', position: 'relative' }}>
        <div 
          style={{ height: '240px', overflow: 'hidden', background: '#F5F2EE', position: 'relative' }}
          onMouseMove={handleMouseMove}
        >
          {/* Main Image Layer */}
          <img 
            src={gallery[hoverIndex] || product.image} 
            alt={product.name} 
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease', transform: isHovered ? 'scale(1.05)' : 'scale(1)' }} 
          />
          
          {/* Progress Bars for Scrubbing */}
          {isHovered && gallery.length > 1 && (
            <div style={{ position: 'absolute', bottom: '8px', left: '10px', right: '10px', display: 'flex', gap: '4px', zIndex: 2 }}>
              {gallery.map((_, i) => (
                <div key={i} style={{ height: '3px', flex: 1, background: i === hoverIndex ? 'var(--charcoal)' : 'rgba(0,0,0,0.2)', borderRadius: '2px', transition: 'background 0.2s' }} />
              ))}
            </div>
          )}

          {/* Dynamic Scarcity Badge */}
          <AnimatePresence>
            {isHovered && badge && (
              <motion.div 
                key="scarcity-badge"
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, scale: 0.95 }}
                style={{ position: 'absolute', bottom: '20px', left: '10px', right: '10px', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)', padding: '6px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, color: badge.color, boxShadow: '0 4px 12px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                {badge.text}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Link>

      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <p style={{ fontSize: '10px', color: 'var(--gray-warm)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>{product.subcategory}</p>
        <h3 style={{ fontWeight: 600, fontSize: '14px', lineHeight: 1.3, marginBottom: '8px', minHeight: '36px' }} className="line-clamp-2">
          <Link href={`/products/${product.category}/${product.id}`} style={{ textDecoration: 'none', color: 'var(--charcoal)' }} className="hover:text-sienna transition-colors">
            {product.name}
          </Link>
        </h3>
        
        <div style={{ display: 'flex', gap: '2px', marginBottom: '12px', alignItems: 'center' }}>
          {[1,2,3,4,5].map((s) => <Star key={s} size={12} fill={s <= Math.round(product.rating) ? '#D4A853' : 'none'} color={s <= Math.round(product.rating) ? '#D4A853' : '#E5E5E5'} />)}
          <span style={{ fontSize: '11px', color: 'var(--gray-warm)', marginLeft: '6px', fontWeight: 500 }}>({product.reviews})</span>
        </div>

        <div style={{ marginTop: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <span style={{ fontWeight: 700, fontSize: '18px', color: 'var(--charcoal)' }}>{formatPrice(product.price)}</span>
            <span style={{ fontSize: '12px', color: 'var(--gray-warm)', textDecoration: 'line-through' }}>{formatPrice(product.originalPrice)}</span>
          </div>
          <button 
            style={{ width: '100%', padding: '12px', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: isHovered ? 'var(--charcoal)' : 'var(--cream)', color: isHovered ? 'white' : 'var(--charcoal)', border: isHovered ? '1px solid var(--charcoal)' : '1px solid var(--border)', borderRadius: '8px', fontWeight: 600, transition: 'all 0.3s ease', cursor: 'pointer' }}
            onClick={() => { addToCart(product); toast.success('Added to cart!', { duration: 1800, icon: '🛍️' }); }}>
            <ShoppingBag size={15} /> Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
