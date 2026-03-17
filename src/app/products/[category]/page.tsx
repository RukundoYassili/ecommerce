'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, ChevronDown, X } from 'lucide-react';
import { products, categories, formatPrice, type Product } from '@/lib/data';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';
import ProductCard from '@/components/product/ProductCard';

const sortOptions = ['Most Popular', 'Price: Low to High', 'Price: High to Low', 'Newest First', 'Top Rated'];

const categoryGroups: Record<string, string[]> = {
  'living-room': ['sofas', 'tables', 'recliners', 'tv-units', 'carpets', 'chairs'],
  'bedroom': ['beds', 'mattresses', 'storage', 'decor'],
  'dining': ['dining', 'tables', 'chairs'],
  'chairs': ['chairs', 'recliners'],
  'storage': ['storage', 'bookshelves', 'tv-units'],
  'decor': ['decor', 'carpets', 'tables'],
  'sale': []
};

const titleMap: Record<string, string> = {
  'living-room': 'Living Room',
  'bedroom': 'Bedroom',
  'dining': 'Dining',
  'chairs': 'Chairs',
  'storage': 'Storage',
  'decor': 'Decor',
  'sale': 'Sale 🔥'
};

export default function ProductsPage() {
  const params = useParams();
  const slug = (params?.category as string)?.toLowerCase();
  const category = categories.find((c) => c.slug === slug);
  const pageTitle = category?.name || titleMap[slug] || 'All Products';

  const [sort, setSort] = useState('Most Popular');
  const [maxPrice, setMaxPrice] = useState(10000000);
  const [filterOpen, setFilterOpen] = useState(false);
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      let query = supabase.from('products').select('*');

      if (slug === 'sale') {
        query = query.gt('discount', 0);
      } else if (categoryGroups[slug]) {
        query = query.in('category', categoryGroups[slug]);
      } else if (slug) {
        query = query.eq('category', slug);
      }

      const { data, error } = await query;
      if (error) {
        toast.error('Failed to fetch products');
      } else {
        const mapped: Product[] = (data || []).map((p: any) => ({
          id: p.id,
          name: p.name,
          category: p.category,
          subcategory: p.subcategory,
          price: Number(p.price),
          originalPrice: Number(p.original_price),
          discount: Number(p.discount),
          rating: Number(p.rating),
          reviews: p.reviews,
          image: p.image_url,
          images: p.images || [],
          description: p.description,
          features: p.features || [],
          material: p.material || '',
          color: p.color || '',
          dimensions: p.dimensions || '',
          warranty: p.warranty || '',
          inStock: p.in_stock,
          isNew: p.is_new,
          isBestseller: p.rating >= 4.8
        }));
        setProductsList(mapped);
      }
      setLoading(false);
    };

    fetchProducts();
  }, [slug]);

  const categoryProducts = useMemo(() => {
    let p = [...productsList];
    p = p.filter((pr) => pr.price <= maxPrice);
    
    if (sort === 'Price: Low to High') p.sort((a, b) => a.price - b.price);
    else if (sort === 'Price: High to Low') p.sort((a, b) => b.price - a.price);
    else if (sort === 'Newest First') p.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    else if (sort === 'Top Rated') p.sort((a, b) => b.rating - a.rating);
    else p.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));
    
    return p;
  }, [productsList, sort, maxPrice]);

  return (
    <>
      <div style={{ background: 'white', borderBottom: '1px solid var(--border)', padding: '12px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '8px', fontSize: '13px', color: 'var(--gray-warm)' }}>
          <Link href="/" style={{ color: 'var(--gray-warm)', textDecoration: 'none' }}>Home</Link>
          <span>/</span>
          <span style={{ color: 'var(--charcoal)', fontWeight: 600 }}>{pageTitle}</span>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '32px', fontWeight: 700 }}>
              {pageTitle}
            </h1>
            <p style={{ color: 'var(--gray-warm)', marginTop: '4px', fontSize: '14px' }}>{categoryProducts.length} products</p>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button onClick={() => setFilterOpen(!filterOpen)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', border: '1px solid var(--border)', borderRadius: '6px', background: 'white', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
              <SlidersHorizontal size={15} /> Filters
            </button>
            <div style={{ position: 'relative' }}>
              <select value={sort} onChange={(e) => setSort(e.target.value)} style={{ padding: '8px 32px 8px 14px', border: '1px solid var(--border)', borderRadius: '6px', background: 'white', fontSize: '13px', fontWeight: 600, cursor: 'pointer', appearance: 'none', color: 'var(--charcoal)' }}>
                {sortOptions.map((o) => <option key={o}>{o}</option>)}
              </select>
              <ChevronDown size={14} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '32px' }}>
          <AnimatePresence>
            {filterOpen && (
              <motion.aside
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: '280px', opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                style={{ flexShrink: 0, overflow: 'hidden' }}
              >
                <div style={{ width: '280px', background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid var(--border)', alignSelf: 'flex-start', position: 'sticky', top: '100px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <span style={{ fontWeight: 800, fontSize: '18px', fontFamily: 'Playfair Display, serif' }}>Filters</span>
                    <button 
                      onClick={() => setFilterOpen(false)} 
                      style={{ background: 'var(--cream)', border: 'none', cursor: 'pointer', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <X size={14} />
                    </button>
                  </div>

                  <div style={{ marginBottom: '32px' }}>
                    <p style={{ fontWeight: 700, fontSize: '14px', marginBottom: '16px', color: 'var(--charcoal)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '4px', height: '14px', background: 'var(--sienna)', borderRadius: '2px' }} />
                      Categories
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {categories.slice(0, 8).map((cat) => (
                        <Link 
                          key={cat.id} 
                          href={`/products/${cat.slug}`} 
                          style={{ 
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                            padding: '10px 12px', border: '1px solid transparent', textDecoration: 'none', 
                            color: cat.slug === slug ? 'var(--sienna)' : 'var(--charcoal-light)', 
                            fontSize: '13px', fontWeight: cat.slug === slug ? 700 : 500,
                            borderRadius: '8px', background: cat.slug === slug ? 'var(--cream)' : 'transparent',
                            transition: 'all 0.2s'
                          }}
                        >
                          <span>{cat.name}</span>
                          <span style={{ color: 'var(--gray-warm)', fontSize: '11px', background: 'white', padding: '2px 6px', borderRadius: '10px', border: '1px solid var(--border)' }}>{cat.count}</span>
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginBottom: '32px' }}>
                    <p style={{ fontWeight: 700, fontSize: '14px', marginBottom: '16px', color: 'var(--charcoal)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '4px', height: '14px', background: 'var(--sienna)', borderRadius: '2px' }} />
                      Price Range
                    </p>
                    <div style={{ padding: '0 8px' }}>
                      <input 
                        type="range" min={0} max={10000000} step={100000} 
                        value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} 
                        style={{ width: '100%', accentColor: 'var(--sienna)', height: '4px', cursor: 'pointer' }} 
                      />
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--charcoal)', marginTop: '12px', fontWeight: 600 }}>
                        <span>RWF 0</span>
                        <span>{formatPrice(maxPrice)}</span>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => { setMaxPrice(10000000); }}
                    style={{ width: '100%', marginTop: '32px', padding: '12px', background: 'none', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '13px', fontWeight: 600, color: 'var(--charcoal)', cursor: 'pointer', transition: 'all 0.2s' }}
                  >
                    Clear All Filters
                  </button>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          <div style={{ flex: 1 }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '100px 0' }}>Loading products...</div>
            ) : categoryProducts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '100px 0', background: 'var(--cream)', borderRadius: '20px', border: '2px dashed var(--border)' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🪑</div>
                <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>No items match your filters</h3>
                <p style={{ color: 'var(--gray-warm)', marginBottom: '24px' }}>Try adjusting your price range or exploring other categories.</p>
                <button onClick={() => setMaxPrice(10000000)} className="btn-primary" style={{ display: 'inline-flex' }}>Reset Filters</button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '24px' }}>
                {categoryProducts.map((product, i) => (
                  <motion.div 
                    key={product.id} 
                    initial={{ opacity: 0, scale: 0.95 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    transition={{ duration: 0.3, delay: Math.min(i * 0.05, 0.5) }}
                    layout
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
