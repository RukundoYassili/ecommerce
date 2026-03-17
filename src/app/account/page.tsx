'use client';
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { 
  ShoppingBag, Settings, Package, Heart, LogOut, 
  ChevronRight, User as UserIcon, Shield, Star, 
  MapPin, Clock, Zap, ExternalLink 
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { formatPrice } from '@/lib/data';
import toast from 'react-hot-toast';

export default function AccountPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [recentOrder, setRecentOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1);

        if (data && data.length > 0) {
          setRecentOrder(data[0]);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, router]);

  if (!user) return null;

  const quickActions = [
    { title: 'Orders History', desc: 'Track and manage your pieces', icon: Package, href: '/account/orders', color: 'var(--charcoal)' },
    { title: 'Saved Treasures', desc: 'Your curated wishlist', icon: Heart, href: '/wishlist', color: '#E53935' },
    { title: 'Personal Info', desc: 'Delivery and billing details', icon: Settings, href: '/account/settings', color: 'var(--sienna)' },
  ];

  return (
    <div style={{ background: 'var(--ivory)', minHeight: '100vh', padding: '60px 24px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        
        {/* ── Profile Hero Section ── */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ 
            background: 'white', borderRadius: '32px', padding: '48px', border: '1px solid var(--border)', 
            display: 'flex', alignItems: 'center', gap: '40px', marginBottom: '48px', position: 'relative',
            boxShadow: '0 20px 50px rgba(0,0,0,0.02)', overflow: 'hidden'
          }}
        >
          {/* Subtle Background Pattern */}
          <div style={{ position: 'absolute', right: '-40px', bottom: '-40px', opacity: 0.03, transform: 'rotate(-15deg)' }}>
             <Star size={300} fill="var(--charcoal)" />
          </div>

          <div style={{ position: 'relative' }}>
            <img 
              src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=1a1a1a&color=fff&size=200`} 
              alt={user.name} 
              style={{ width: '120px', height: '120px', borderRadius: '32px', objectFit: 'cover', border: '4px solid var(--ivory)', boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }} 
            />
            <div style={{ position: 'absolute', bottom: '-10px', right: '-10px', background: 'var(--gold)', color: 'var(--charcoal)', padding: '6px 14px', borderRadius: '12px', fontSize: '10px', fontWeight: 900, boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
              VIP
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
               <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '36px', fontWeight: 800, margin: 0, color: 'var(--charcoal)' }}>{user.name}</h1>
               <Shield size={20} color="var(--sienna)" fill="var(--gold)" style={{ opacity: 0.8 }} />
            </div>
            <p style={{ color: 'var(--gray-warm)', fontSize: '16px', fontWeight: 500, margin: 0 }}>{user.email} • Verified Member since 2024</p>
            
            <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
              <Badge icon={Star} label="Showroom Customer" color="var(--charcoal)" bg="var(--ivory)" />
              <Badge icon={MapPin} label="Kigali, Rwanda" color="var(--sienna)" bg="var(--cream)" />
            </div>
          </div>

          <button 
            onClick={logout} 
            className="btn-secondary"
            style={{ padding: '12px 24px', borderRadius: '14px', gap: '10px', border: '1.5px solid var(--border)', fontSize: '14px' }}
          >
            <LogOut size={18} /> Sign Out
          </button>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '48px', alignItems: 'start' }}>
          
          {/* ── Left side: Quick Actions & Stats ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>Your Sanctuary</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {quickActions.map((action, i) => (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link href={action.href} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div 
                      style={{ 
                        background: 'white', padding: '24px', borderRadius: '24px', border: '1px solid var(--border)', 
                        display: 'flex', alignItems: 'center', gap: '20px', transition: 'all 0.3s ease' 
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'var(--charcoal)';
                        e.currentTarget.style.transform = 'translateX(8px)';
                        e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.03)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'var(--border)';
                        e.currentTarget.style.transform = 'translateX(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <div style={{ width: '56px', height: '56px', background: 'var(--cream)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: action.color }}>
                        <action.icon size={24} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: '17px', fontWeight: 800, margin: 0 }}>{action.title}</h3>
                        <p style={{ color: 'var(--gray-warm)', fontSize: '13px', marginTop: '2px' }}>{action.desc}</p>
                      </div>
                      <ChevronRight size={20} color="var(--border)" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* ── Right side: Activity & Local Status ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
               <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '24px', fontWeight: 800 }}>Recent Experience</h2>
               {recentOrder && <Link href="/account/orders" style={{ fontSize: '13px', color: 'var(--sienna)', fontWeight: 800, textDecoration: 'none' }}>View All</Link>}
            </div>

            {loading ? (
              <div style={{ height: '200px', background: 'white', borderRadius: '32px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clock size={24} className="animate-spin" color="var(--gray-warm)" />
              </div>
            ) : recentOrder ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ background: 'var(--charcoal)', color: 'white', borderRadius: '32px', padding: '32px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                   <div style={{ background: 'rgba(255,255,255,0.1)', padding: '6px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 800, letterSpacing: '1px' }}>
                      ORDER #{recentOrder.id.substring(0,8).toUpperCase()}
                   </div>
                   <div style={{ color: 'var(--gold)', fontSize: '12px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Zap size={14} fill="var(--gold)" /> {recentOrder.status.toUpperCase()}
                   </div>
                </div>

                <div style={{ marginBottom: '32px' }}>
                   <h4 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '4px' }}>{recentOrder.items?.length || 0} Professional Pieces</h4>
                   <p style={{ opacity: 0.6, fontSize: '14px' }}>Arriving at {recentOrder.shipping_address?.city || 'Selected Location'}</p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                   <div>
                      <div style={{ fontSize: '11px', opacity: 0.5, fontWeight: 800, textTransform: 'uppercase' }}>Investment</div>
                      <div style={{ fontSize: '18px', fontWeight: 800 }}>{formatPrice(recentOrder.total_amount)}</div>
                   </div>
                   <Link href={`/account/orders/${recentOrder.id}`}>
                      <button className="btn-primary" style={{ background: 'white', color: 'var(--charcoal)', padding: '12px 20px', borderRadius: '12px', fontSize: '13px', fontWeight: 800 }}>Track Order</button>
                   </Link>
                </div>
              </motion.div>
            ) : (
              <div style={{ background: 'white', padding: '48px', borderRadius: '32px', border: '1px solid var(--border)', textAlign: 'center' }}>
                <ShoppingBag size={48} color="var(--border)" style={{ marginBottom: '24px', opacity: 0.5 }} />
                <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '8px' }}>Your collection is empty</h3>
                <p style={{ color: 'var(--gray-warm)', fontSize: '14px', marginBottom: '24px' }}>Begin your journey with curated furniture designed for high-end living.</p>
                <Link href="/" className="btn-primary" style={{ padding: '14px 32px', borderRadius: '12px' }}>Start Exploring</Link>
              </div>
            )}

            {/* Local Showroom Promo */}
            <div style={{ background: 'var(--cream)', borderRadius: '32px', padding: '24px', border: '1px solid var(--border)', display: 'flex', gap: '20px', alignItems: 'center' }}>
               <div style={{ width: '48px', height: '48px', background: 'white', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <ExternalLink size={20} color="var(--sienna)" />
               </div>
               <div>
                  <div style={{ fontWeight: 800, fontSize: '14px' }}>Visit our Kigali Showroom</div>
                  <div style={{ fontSize: '12px', color: 'var(--gray-warm)' }}>Show your VIP status on your phone for a 10% in-store discount.</div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Badge({ icon: Icon, label, color, bg }: any) {
  return (
    <div style={{ 
      display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', 
      background: bg, color: color, borderRadius: '100px', fontSize: '12px', fontWeight: 800 
    }}>
      <Icon size={14} /> {label}
    </div>
  );
}

