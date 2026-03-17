'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star, Heart, ShoppingBag, Truck, RotateCcw, Shield,
  ChevronRight, Plus, Minus, Check, ArrowRight, Share2, 
  MapPin, Info, Zap
} from 'lucide-react';
import { type Product, formatPrice } from '@/lib/data';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import toast from 'react-hot-toast';
import ProductCard from '@/components/product/ProductCard';
import { supabase } from '@/lib/supabase';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params?.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview');

  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isScrolledPastCTA, setIsScrolledPastCTA] = useState(false);
  const [related, setRelated] = useState<Product[]>([]);

  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (ctaRef.current) {
        const rect = ctaRef.current.getBoundingClientRect();
        setIsScrolledPastCTA(rect.top < 0);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (error) {
        setLoading(false);
        return;
      }

      const p: Product = {
        id: data.id,
        name: data.name,
        category: data.category,
        subcategory: data.subcategory,
        price: Number(data.price),
        originalPrice: Number(data.original_price),
        discount: Number(data.discount),
        rating: Number(data.rating),
        reviews: data.reviews,
        image: data.image_url,
        images: data.images || [],
        description: data.description,
        features: data.features || [],
        material: data.material || '',
        color: data.color || '',
        dimensions: data.dimensions || '',
        warranty: data.warranty || '',
        inStock: data.in_stock,
        isNew: data.is_new,
        isBestseller: data.rating >= 4.8
      };
      setProduct(p);

      // Fetch related products
      const { data: relatedData } = await supabase
        .from('products')
        .select('*')
        .eq('category', data.category)
        .neq('id', productId)
        .limit(4);

      if (relatedData) {
        const mappedRelated = relatedData.map((rp: any) => ({
          id: rp.id,
          name: rp.name,
          category: rp.category,
          subcategory: rp.subcategory,
          price: Number(rp.price),
          originalPrice: Number(rp.original_price),
          discount: Number(rp.discount),
          rating: Number(rp.rating),
          reviews: rp.reviews,
          image: rp.image_url,
          images: rp.images || [],
          description: rp.description,
          features: rp.features || [],
          material: rp.material || '',
          color: rp.color || '',
          dimensions: rp.dimensions || '',
          warranty: rp.warranty || '',
          inStock: rp.in_stock,
          isNew: rp.is_new,
          isBestseller: rp.rating >= 4.8
        }));
        setRelated(mappedRelated);
      }
      setLoading(false);
    };

    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <div style={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--ivory)' }}>
        <div className="loader">
           <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '20px', fontWeight: 600, color: 'var(--charcoal)', textAlign: 'center' }}>
             <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5 }}>Crafting Your Experience...</motion.div>
           </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const images = [product.image, ...(product.images || [])].filter(Boolean);
  const wishlisted = isWishlisted(product.id);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - (top + window.scrollY)) / height) * 100;
    setMousePos({ x, y });
  };

  return (
    <div style={{ background: 'var(--ivory)', minHeight: '100vh', paddingBottom: '100px' }}>
      {/* ── Breadcrumb & Top Bar ── */}
      <div style={{ padding: '20px 24px', maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '8px', fontSize: '13px', color: 'var(--gray-warm)', alignItems: 'center' }}>
          <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>Home</Link>
          <ChevronRight size={14} />
          <Link href={`/products/${product.category}`} style={{ textDecoration: 'none', color: 'inherit' }}>{product.subcategory}</Link>
          <ChevronRight size={14} />
          <span style={{ color: 'var(--charcoal)', fontWeight: 600 }}>{product.name}</span>
        </div>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--charcoal)', fontWeight: 600 }}>
          <Share2 size={16} /> Share
        </button>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 0.8fr)', gap: '60px', alignItems: 'start' }}>
          
          {/* ── Left Column: Media Gallery ── */}
          <div style={{ position: 'sticky', top: '100px' }}>
            <div style={{ display: 'flex', gap: '20px' }}>
              {/* Vertical Thumbnails */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {images.map((img, i) => (
                  <button 
                    key={i} 
                    onClick={() => setSelectedImage(i)}
                    style={{ 
                      width: '80px', height: '100px', borderRadius: '12px', overflow: 'hidden', 
                      border: `2px solid ${selectedImage === i ? 'var(--sienna)' : 'transparent'}`,
                      background: 'white', cursor: 'pointer', transition: 'all 0.3s ease', padding: '2px'
                    }}
                  >
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                  </button>
                ))}
              </div>

              {/* Main Visual with Zoom Effect */}
              <div 
                style={{ flex: 1, height: '640px', background: 'white', borderRadius: '24px', overflow: 'hidden', cursor: 'crosshair', border: '1px solid var(--border)', position: 'relative' }}
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
                onMouseMove={handleMouseMove}
              >
                <motion.img 
                  key={selectedImage}
                  src={images[selectedImage]} 
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{ 
                    width: '100%', height: '100%', objectFit: 'cover',
                    transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                    transform: isZoomed ? 'scale(2)' : 'scale(1)',
                    transition: isZoomed ? 'none' : 'transform 0.5s ease-out'
                  }} 
                />
                
                {/* Floating Meta Badges */}
                <div style={{ position: 'absolute', top: '24px', left: '24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                   {product.isNew && <span style={{ background: 'var(--charcoal)', color: 'white', padding: '6px 14px', borderRadius: '50px', fontSize: '10px', fontWeight: 800, letterSpacing: '1px' }}>NEW ARRIVAL</span>}
                   {product.isBestseller && <span style={{ background: 'var(--gold)', color: 'var(--charcoal)', padding: '6px 14px', borderRadius: '50px', fontSize: '10px', fontWeight: 800, letterSpacing: '1px' }}>BESTSELLER</span>}
                </div>
              </div>
            </div>
          </div>

          {/* ── Right Column: Configuration & Purchase ── */}
          <div style={{ padding: '20px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', gap: '2px' }}>
                {[1,2,3,4,5].map(s => <Star key={s} size={16} fill={s <= Math.round(product.rating) ? 'var(--gold)' : 'none'} color={s <= Math.round(product.rating) ? 'var(--gold)' : '#DDD'} />)}
              </div>
              <span style={{ fontWeight: 700, fontSize: '14px' }}>{product.rating}</span>
              <span style={{ color: 'var(--gray-warm)', fontSize: '14px' }}>({product.reviews} verified reviews)</span>
            </div>

            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '42px', fontWeight: 700, lineHeight: 1.1, marginBottom: '12px', color: 'var(--charcoal)' }}>
              {product.name}
            </h1>
            <p style={{ color: 'var(--gray-warm)', fontSize: '16px', lineHeight: 1.6, marginBottom: '32px', maxWidth: '90%' }}>
              {product.description.split('.')[0]}. Luxury meets durability in this handcrafted masterpiece.
            </p>

            <div style={{ background: 'white', padding: '32px', borderRadius: '24px', border: '1px solid var(--border)', boxShadow: '0 20px 40px rgba(0,0,0,0.03)', marginBottom: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '14px', marginBottom: '8px' }}>
                <span style={{ fontSize: '44px', fontWeight: 800, color: 'var(--charcoal)', letterSpacing: '-1px' }}>{formatPrice(product.price)}</span>
                <span style={{ fontSize: '20px', color: 'var(--gray-warm)', textDecoration: 'line-through' }}>{formatPrice(product.originalPrice)}</span>
                <span style={{ background: 'rgba(192, 84, 26, 0.1)', color: 'var(--sienna)', padding: '4px 12px', borderRadius: '50px', fontSize: '14px', fontWeight: 700 }}>Save {product.discount}%</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#059669', fontSize: '14px', fontWeight: 600 }}>
                <Zap size={14} fill="#059669" /> Free installation & delivery included for Kigali orders
              </div>

              <div style={{ marginTop: '32px', paddingTop: '32px', borderTop: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                     <span style={{ fontWeight: 700, fontSize: '15px' }}>Quantity</span>
                     <div style={{ display: 'flex', alignItems: 'center', background: 'var(--cream)', borderRadius: '12px', padding: '4px' }}>
                        <button onClick={() => setQuantity(q => Math.max(1, q-1))} style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'none', cursor: 'pointer' }}><Minus size={14} /></button>
                        <span style={{ width: '40px', textAlign: 'center', fontWeight: 800 }}>{quantity}</span>
                        <button onClick={() => setQuantity(q => q+1)} style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'none', cursor: 'pointer' }}><Plus size={14} /></button>
                     </div>
                   </div>
                   <div style={{ color: 'var(--gray-warm)', fontSize: '13px' }}>
                     <Check size={14} style={{ border: '1px solid #059669', borderRadius: '50%', color: '#059669', padding: '1px', marginRight: '4px' }} /> In Stock
                   </div>
                </div>

                <div ref={ctaRef} style={{ display: 'flex', gap: '12px' }}>
                  <button 
                    onClick={() => { for(let i=0; i<quantity; i++) addToCart(product); toast.success('Added to cart!'); }}
                    className="btn-primary" 
                    style={{ flex: 1, background: 'var(--charcoal)', color: 'white', borderRadius: '14px', padding: '18px', fontSize: '16px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                  >
                    <ShoppingBag size={20} /> Add to Cart
                  </button>
                  <button 
                    onClick={() => toggleWishlist(product)}
                    style={{ 
                      width: '60px', height: '60px', borderRadius: '14px', border: '1.5px solid var(--border)', 
                      background: wishlisted ? '#FEF3F0' : 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' 
                    }}
                  >
                    <Heart size={22} fill={wishlisted ? 'var(--sienna)' : 'none'} color={wishlisted ? 'var(--sienna)' : 'var(--charcoal)'} />
                  </button>
                </div>
              </div>
            </div>

            {/* Feature Highlights Bento */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '48px' }}>
               {[
                 { icon: Truck, title: 'Rwanda Shipping', sub: 'Free over 750k RWF' },
                 { icon: RotateCcw, title: 'Easy Returns', sub: '30-day hassle free' },
                 { icon: Shield, title: 'Warranty', sub: product.warranty },
                 { icon: MapPin, title: 'Showroom Pick-up', sub: 'Available at Musanze' }
               ].map((item, i) => (
                 <div key={i} style={{ display: 'flex', gap: '16px', padding: '16px', background: 'white', borderRadius: '16px', border: '1px solid var(--border)' }}>
                   <div style={{ width: '40px', height: '40px', background: 'var(--cream)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                     <item.icon size={20} color="var(--sienna)" />
                   </div>
                   <div>
                     <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--charcoal)' }}>{item.title}</div>
                     <div style={{ fontSize: '11px', color: 'var(--gray-warm)' }}>{item.sub}</div>
                   </div>
                 </div>
               ))}
            </div>

            {/* Dynamic Tabs */}
            <div style={{ borderBottom: '1px solid var(--border)', display: 'flex', gap: '32px', marginBottom: '24px' }}>
               {['Overview', 'Specifications', 'Features'].map(tab => (
                 <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{ 
                    padding: '12px 0', border: 'none', background: 'none', cursor: 'pointer', fontSize: '15px', fontWeight: 700, 
                    color: activeTab === tab ? 'var(--sienna)' : 'var(--gray-warm)',
                    borderBottom: activeTab === tab ? '2px solid var(--sienna)' : '2px solid transparent',
                    transition: 'all 0.3s'
                  }}
                 >
                   {tab}
                 </button>
               ))}
            </div>
            
            <div style={{ minHeight: '120px' }}>
               <AnimatePresence mode="wait">
                 {activeTab === 'Overview' && (
                   <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} style={{ fontSize: '15px', color: 'var(--charcoal-light)', lineHeight: 1.8 }}>
                     {product.description}
                   </motion.p>
                 )}
                 {activeTab === 'Specifications' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: 'var(--border)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
                      {[
                        ['Material', product.material], 
                        ['Color', product.color], 
                        ['Dimensions', product.dimensions], 
                        ['Warranty', product.warranty]
                      ].map(([k,v]) => (
                        <div key={k} style={{ background: 'white', padding: '16px 20px' }}>
                          <div style={{ fontSize: '10px', color: 'var(--gray-warm)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>{k}</div>
                          <div style={{ fontSize: '14px', fontWeight: 700 }}>{v}</div>
                        </div>
                      ))}
                    </motion.div>
                 )}
                 {activeTab === 'Features' && (
                    <motion.ul initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} style={{ paddingLeft: '20px' }}>
                      {product.features.map((f, i) => <li key={i} style={{ fontSize: '15px', color: 'var(--charcoal-light)', marginBottom: '10px', lineHeight: 1.6 }}>{f}</li>)}
                    </motion.ul>
                 )}
               </AnimatePresence>
            </div>
          </div>
        </div>

        {/* ── Customer Reviews Section ── */}
        <div style={{ marginTop: '100px', paddingTop: '80px', borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '50px' }}>
            <div>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '36px', fontWeight: 700, color: 'var(--charcoal)' }}>Voices of Our Vibe</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '10px' }}>
                <div style={{ fontSize: '56px', fontWeight: 900 }}>{product.rating}</div>
                <div>
                   <div style={{ display: 'flex', gap: '2px' }}>
                     {[1,2,3,4,5].map(s => <Star key={s} size={18} fill={s <= Math.round(product.rating) ? 'var(--gold)' : 'none'} color={s <= Math.round(product.rating) ? 'var(--gold)' : '#DDD'} />)}
                   </div>
                   <div style={{ fontSize: '14px', color: 'var(--gray-warm)', fontWeight: 600 }}>Total {product.reviews} reviews</div>
                </div>
              </div>
            </div>
            <button className="btn-primary" style={{ height: 'fit-content', borderRadius: '50px', padding: '12px 32px' }}>Share Your Experience</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
             {[
               { author: 'Emmanuel K.', date: 'March 14, 2024', text: 'The level of craftsmanship is unparalleled in Rwanda. This piece transformed our living room completely.', rating: 5 },
               { author: 'Chantal U.', date: 'Feb 28, 2024', text: 'Comfortable, stylish, and arrived precisely on time. The B-FRESH team was very professional during setup.', rating: 5 },
               { author: 'Patrick N.', date: 'Jan 20, 2024', text: 'Excellent build quality. The fabric feels very premium and the color is even richer in person.', rating: 4 }
             ].map((review, i) => (
                <div key={i} style={{ background: 'white', padding: '32px', borderRadius: '24px', border: '1px solid var(--border)', position: 'relative' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                      <span style={{ fontWeight: 800, fontSize: '15px' }}>{review.author}</span>
                      <span style={{ fontSize: '12px', color: 'var(--gray-warm)' }}>{review.date}</span>
                   </div>
                   <div style={{ display: 'flex', gap: '2px', marginBottom: '16px' }}>
                     {[1,2,3,4,5].map(s => <Star key={s} size={12} fill={s <= review.rating ? 'var(--gold)' : 'none'} color={s <= review.rating ? 'var(--gold)' : '#EEE'} />)}
                   </div>
                   <p style={{ fontSize: '15px', color: 'var(--charcoal-light)', lineHeight: 1.6, marginTop: '16px' }}>"{review.text}"</p>
                   <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', gap: '8px', color: '#059669', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      <Check size={14} /> Verified Collector
                   </div>
                </div>
             ))}
          </div>
        </div>

        {/* ── Related Treasures ── */}
        {related.length > 0 && (
          <div style={{ marginTop: '120px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px' }}>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '36px', fontWeight: 700 }}>Complete the Aesthetic</h2>
              <Link href={`/products/${product.category}`} style={{ textDecoration: 'none', color: 'var(--charcoal)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                Curate More <ArrowRight size={18} />
              </Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>

      {/* ── Sticky Mobile CTA / Bar ── */}
      <AnimatePresence>
        {isScrolledPastCTA && (
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            style={{ 
              position: 'fixed', bottom: 0, left: 0, right: 0, background: 'rgba(255,255,255,0.85)', 
              backdropFilter: 'blur(16px)', padding: '16px 24px', borderTop: '1px solid var(--border)',
              zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}
          >
            <div className="hidden sm:flex items-center gap-16">
               <img src={product.image} style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }} />
               <div>
                  <div style={{ fontWeight: 800, fontSize: '14px', color: 'var(--charcoal)' }}>{product.name}</div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--sienna)' }}>{formatPrice(product.price)}</div>
               </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', flex: 1, maxWidth: '500px' }}>
               <button 
                onClick={() => { for(let i=0; i<quantity; i++) addToCart(product); toast.success('Added to cart!'); }}
                style={{ flex: 1, background: 'var(--charcoal)', color: 'white', border: 'none', padding: '14px 24px', borderRadius: '12px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
               >
                 <ShoppingBag size={18} /> Add to Cart
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        body { background: var(--ivory); }
        .btn-primary:active { transform: scale(0.98); }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
    </div>
  );
}

