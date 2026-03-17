'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Package, Truck, Check, MapPin, 
  CreditCard, Smartphone, Clock, Calendar, 
  Printer, HelpCircle 
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { formatPrice } from '@/lib/data';

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params?.id as string;
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      const fetchOrder = async () => {
        try {
          const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('id', orderId)
            .single();

          if (data) setOrder(data);
        } catch (err) {
          console.error('Error fetching order:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchOrder();
    }
  }, [orderId]);

  if (loading) return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--ivory)' }}>
      <Clock size={32} className="animate-spin" color="var(--gray-warm)" />
    </div>
  );
  
  if (!order) return <div style={{ padding: '100px', textAlign: 'center', background: 'var(--ivory)' }}>Order not found</div>;

  const items = order.items || [];
  const address = order.shipping_address || {};
  const deliveryFee = order.total_amount > 750000 ? 0 : 25000; // Localized 25k RWF

  return (
    <div style={{ background: 'var(--ivory)', minHeight: '100vh', padding: '60px 24px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        
        {/* ── Breadcrumb & Actions ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <Link href="/account/orders" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--gray-warm)', textDecoration: 'none', fontWeight: 800, fontSize: '13px' }}>
            <ArrowLeft size={16} /> BACK TO ORDERS
          </Link>
          <div style={{ display: 'flex', gap: '12px' }}>
             <button onClick={() => window.print()} style={{ background: 'white', border: '1px solid var(--border)', padding: '10px 20px', borderRadius: '12px', fontSize: '13px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <Printer size={16} /> Print Receipt
             </button>
             <button style={{ background: 'var(--charcoal)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '12px', fontSize: '13px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <HelpCircle size={16} /> Help
             </button>
          </div>
        </div>

        {/* ── Header Headline ── */}
        <div style={{ background: 'white', borderRadius: '32px', padding: '40px', border: '1px solid var(--border)', marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '24px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
               <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '36px', fontWeight: 800, margin: 0 }}>Order Detail</h1>
               <span style={{ padding: '6px 14px', background: 'var(--ivory)', color: 'var(--charcoal)', borderRadius: '10px', fontSize: '12px', fontWeight: 900 }}>
                  #{orderId.substring(0,8).toUpperCase()}
               </span>
            </div>
            <div style={{ display: 'flex', gap: '24px', color: 'var(--gray-warm)', fontSize: '14px', fontWeight: 600 }}>
               <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={14} /> Placed on {new Date(order.created_at).toLocaleDateString()}</span>
               <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={14} /> Expected: 3-5 Business Days</span>
            </div>
          </div>
          <div style={{ background: 'var(--charcoal)', color: 'var(--gold)', padding: '12px 24px', borderRadius: '16px', fontSize: '14px', fontWeight: 900, letterSpacing: '1px' }}>
            {order.status.toUpperCase()}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '48px', alignItems: 'start' }}>
          
          {/* ── Left side: Items & Breakdown ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            <div style={{ background: 'white', borderRadius: '32px', padding: '40px', border: '1px solid var(--border)' }}>
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '22px', fontWeight: 800, marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Package size={24} color="var(--sienna)" /> Artisan Pieces ({items.length})
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {items.map((item: any) => (
                  <div key={item.id} style={{ display: 'flex', gap: '24px', alignItems: 'center', paddingBottom: '24px', borderBottom: '1px solid var(--border)' }}>
                    <img src={item.image} alt={item.name} style={{ width: '100px', height: '100px', borderRadius: '16px', objectFit: 'cover', border: '1px solid var(--border)' }} />
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: '17px', fontWeight: 800, margin: 0, color: 'var(--charcoal)' }}>{item.name}</h4>
                      <p style={{ fontSize: '13px', color: 'var(--gray-warm)', margin: '4px 0 8px' }}>Qty: {item.quantity} • {item.material?.split(',')[0] || 'Premium Wood'}</p>
                      <p style={{ fontSize: '16px', fontWeight: 800, color: 'var(--sienna)' }}>{formatPrice(item.price)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div style={{ marginTop: '32px', padding: '32px', background: 'var(--ivory)', borderRadius: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: 'var(--gray-warm)', marginBottom: '12px' }}>
                  <span>Subtotal</span>
                  <span style={{ fontWeight: 700 }}>{formatPrice(order.total_amount - deliveryFee)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: 'var(--gray-warm)', marginBottom: '12px' }}>
                  <span>Regional Delivery (Kigali/Musanze)</span>
                  <span style={{ fontWeight: 800, color: deliveryFee === 0 ? '#059669' : 'inherit' }}>{deliveryFee === 0 ? 'COMPLIMENTARY' : formatPrice(deliveryFee)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '24px', fontWeight: 900, borderTop: '2px dashed var(--border)', paddingTop: '20px', marginTop: '20px', color: 'var(--charcoal)' }}>
                  <span>Total Investment</span>
                  <span>{formatPrice(order.total_amount)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right side: Sidebar Info ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            {/* Tracking Progress */}
            <div style={{ background: 'white', borderRadius: '32px', padding: '32px', border: '1px solid var(--border)' }}>
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '18px', fontWeight: 800, marginBottom: '24px' }}>Tracking Journey</h3>
              <div style={{ position: 'relative', paddingLeft: '40px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <div style={{ position: 'absolute', left: '15px', top: '10px', bottom: '10px', width: '2px', background: 'var(--border)' }} />
                
                <TrackingStep title="Experience Initiated" subtitle={new Date(order.created_at).toLocaleDateString()} active />
                <TrackingStep title="Artisan Preparation" subtitle="Pending" />
                <TrackingStep title="White-Glove Delivery" subtitle="Kigali Route" />
              </div>
            </div>

            {/* Local Delivery Hub */}
            <div style={{ background: 'white', borderRadius: '32px', padding: '32px', border: '1px solid var(--border)' }}>
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '18px', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MapPin size={20} color="var(--sienna)" /> Local Destination
              </h3>
              <div style={{ fontSize: '15px', color: 'var(--charcoal-light)', lineHeight: 1.6 }}>
                <p style={{ fontWeight: 800, color: 'var(--charcoal)', marginBottom: '6px' }}>{address.firstName} {address.lastName}</p>
                <p style={{ margin: 0 }}>{address.address}</p>
                <p style={{ margin: 0 }}>{address.region}, {address.city}</p>
                <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--gray-warm)', fontWeight: 700 }}>
                   <Smartphone size={16} /> {address.phone}
                </div>
              </div>
            </div>

            {/* Payment Verification */}
            <div style={{ background: 'var(--cream)', borderRadius: '32px', padding: '32px', border: '1px solid var(--border)' }}>
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '18px', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CreditCard size={20} color="var(--sienna)" /> Payment Status
              </h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <div>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--charcoal)' }}>
                       {order.payment_method === 'momo' ? 'Momo Pay' : order.payment_method === 'card' ? 'Intl. Card' : 'Cash on Delivery'}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--gray-warm)' }}>Verified Transaction</div>
                 </div>
                 <div style={{ background: '#E8F5E9', color: '#2E7D32', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Check size={14} /> PAID
                 </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

function TrackingStep({ title, subtitle, active }: any) {
  return (
    <div style={{ position: 'relative' }}>
      <div style={{ 
        position: 'absolute', left: '-33px', top: '0', width: '16px', height: '16px', 
        borderRadius: '50%', background: active ? 'var(--charcoal)' : 'var(--border)', 
        border: active ? '4px solid var(--gold)' : '4px solid white',
        boxShadow: active ? '0 0 0 4px var(--ivory)' : 'none',
        zIndex: 2
      }} />
      <p style={{ fontSize: '15px', fontWeight: 800, margin: 0, color: active ? 'var(--charcoal)' : 'var(--gray-warm)' }}>{title}</p>
      <p style={{ fontSize: '12px', color: 'var(--gray-warm)', margin: 0 }}>{subtitle}</p>
    </div>
  );
}

