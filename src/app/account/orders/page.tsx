'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Package, ChevronRight, ArrowLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { formatPrice } from '@/lib/data';

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const fetchOrders = async () => {
        setLoading(true);
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (data) setOrders(data);
        setLoading(false);
      };
      fetchOrders();
    }
  }, [user]);

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Loading your orders...</p>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--ivory)', minHeight: '100vh', padding: '40px 24px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Link href="/account" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--gray-warm)', textDecoration: 'none', marginBottom: '24px', fontSize: '14px' }}>
          <ArrowLeft size={16} /> Back to Account
        </Link>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '32px', fontWeight: 700, marginBottom: '32px' }}>Order History</h1>

        {orders.length === 0 ? (
          <div style={{ background: 'white', padding: '60px 24px', borderRadius: '24px', border: '1px solid var(--border)', textAlign: 'center' }}>
            <Package size={48} style={{ color: 'var(--border)', marginBottom: '16px' }} />
            <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>No orders found</h3>
            <p style={{ color: 'var(--gray-warm)', marginBottom: '24px' }}>You haven't placed any orders yet.</p>
            <Link href="/" className="btn-primary" style={{ display: 'inline-flex' }}>Start Shopping</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {orders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '20px' }}
              >
                <div style={{ width: '60px', height: '60px', background: 'var(--ivory)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--sienna)' }}>
                  <Package size={24} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--sienna)', fontWeight: 700 }}>ORDER #{order.id.substring(0,8).toUpperCase()}</span>
                    <span style={{ fontSize: '13px', color: 'var(--gray-warm)' }}>{new Date(order.created_at).toLocaleDateString()}</span>
                  </div>
                  <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '4px' }}>{order.items?.length || 0} Items</h4>
                  <p style={{ fontSize: '14px', color: 'var(--charcoal)' }}>{formatPrice(order.total_amount)} • <span style={{ color: '#2E7D32', fontWeight: 600 }}>{order.status.toUpperCase()}</span></p>
                </div>
                <Link href={`/account/orders/${order.id}`}>
                  <button style={{ background: 'none', border: '1px solid var(--border)', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    Details <ChevronRight size={14} />
                  </button>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
