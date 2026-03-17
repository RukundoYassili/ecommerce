'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, CreditCard, Truck, Shield, Check, 
  ChevronRight, Lock, MapPin, Smartphone, 
  ArrowLeft, Info, Package, Zap 
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/data';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const steps = [
  { id: 'shipping', label: 'Shipping', icon: MapPin },
  { id: 'payment', label: 'Payment', icon: CreditCard },
  { id: 'review', label: 'Finalize', icon: Check }
];

const RWANDA_REGIONS = [
  'Kigali City', 'Musanze (Northern)', 'Gisenyi/Rubavu (Western)', 
  'Huye (Southern)', 'Rwamagana (Eastern)', 'Other'
];

export default function CheckoutPage() {
  const { state, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  
  const [step, setStep] = useState(0);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [payMethod, setPayMethod] = useState('momo'); // Default to MoMo for Rwanda
  
  const [form, setForm] = useState({
    firstName: user?.name.split(' ')[0] || '',
    lastName: user?.name.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: 'Kigali',
    region: 'Kigali City',
    postal: '0000'
  });

  const delivery = totalPrice > 750000 ? 0 : 25000; // Localized shipping rate
  const total = totalPrice + delivery;

  const nextStep = () => {
    // Basic validation
    if (step === 0) {
      if (!form.firstName || !form.address || !form.phone) {
        toast.error('Please fill in your delivery details');
        return;
      }
    }
    setStep(Math.min(steps.length - 1, step + 1));
    window.scrollTo(0, 0);
  };

  const prevStep = () => {
    setStep(Math.max(0, step - 1));
    window.scrollTo(0, 0);
  };

  const handleOrder = async () => {
    if (!user) {
      toast.error('Please login to place an order');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.from('orders').insert({
        user_id: user.id,
        status: 'processing',
        total_amount: total,
        shipping_address: form,
        payment_method: payMethod,
        items: state.items
      });

      if (error) throw error;

      setOrderPlaced(true);
      clearCart();
      toast.success('B-FRESH Experience Initiated!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (state.items.length === 0 && !orderPlaced) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 24px', background: 'var(--ivory)' }}>
        <div style={{ padding: '40px', background: 'white', borderRadius: '32px', textAlign: 'center', border: '1px solid var(--border)', boxShadow: '0 20px 40px rgba(0,0,0,0.03)' }}>
          <div style={{ width: '80px', height: '80px', background: 'var(--cream)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <ShoppingBag size={32} color="var(--sienna)" />
          </div>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '28px', fontWeight: 700, marginBottom: '12px' }}>Your Cart is Quiet</h2>
          <p style={{ color: 'var(--gray-warm)', marginBottom: '32px', maxWidth: '300px' }}>Our artisans are ready when you are. Add some treasures to your space to begin.</p>
          <Link href="/" className="btn-primary" style={{ padding: '14px 40px', borderRadius: '12px' }}>Start Curating</Link>
        </div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div style={{ minHeight: '90vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 24px', background: 'var(--ivory)' }}>
        <Toaster position="bottom-right" />
        <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ textAlign: 'center', maxWidth: '500px' }}>
          <div style={{ width: '100px', height: '100px', background: 'var(--charcoal)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px', border: '4px solid var(--gold)' }}>
            <Check size={48} color="var(--gold)" />
          </div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '42px', fontWeight: 800, marginBottom: '16px', color: 'var(--charcoal)' }}>Your space is about to get better.</h1>
          <p style={{ color: 'var(--gray-warm)', fontSize: '18px', lineHeight: 1.6, marginBottom: '40px' }}>
            Thank you, {form.firstName}. Your order has been placed in our artisan queue. We'll contact you at <strong>{form.phone}</strong> for delivery coordination.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <Link href="/" className="btn-primary" style={{ padding: '16px 32px', borderRadius: '14px', background: 'var(--charcoal)' }}>Back to Home</Link>
            <Link href="/account/orders" className="btn-secondary" style={{ padding: '16px 32px', borderRadius: '14px' }}>Track Order</Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--ivory)', minHeight: '100vh' }}>
      <Toaster position="bottom-right" />
      
      {/* ── Seamless Checkout Header ── */}
      <nav style={{ background: 'white', borderBottom: '1px solid var(--border)', padding: '24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
              <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '20px', fontWeight: 800, color: 'var(--charcoal)' }}>B-FRESH</span>
              <span style={{ fontSize: '8px', letterSpacing: '2px', fontWeight: 800, color: 'var(--sienna)' }}>TRADING LTD</span>
            </div>
          </Link>
          
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {steps.map((s, i) => (
              <div key={s.id} style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ 
                    width: '32px', height: '32px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: i <= step ? 'var(--charcoal)' : 'var(--cream)', color: i <= step ? 'var(--gold)' : 'var(--gray-warm)',
                    transition: 'all 0.4s'
                  }}>
                    <s.icon size={16} />
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: i === step ? 800 : 500, color: i <= step ? 'var(--charcoal)' : 'var(--gray-warm)', transition: 'all 0.4s' }}>{s.label}</span>
                </div>
                {i < steps.length - 1 && <div style={{ width: '40px', height: '1.5px', background: i < step ? 'var(--charcoal)' : 'var(--border)', margin: '0 12px' }} />}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--gray-warm)', fontSize: '11px', fontWeight: 700 }}>
             <Lock size={12} /> SECURE CHECKOUT
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 24px', display: 'grid', gridTemplateColumns: '1fr 400px', gap: '48px', alignItems: 'start' }}>
        
        {/* ── Left side: Form steps ── */}
        <div style={{ background: 'white', borderRadius: '32px', padding: '40px', border: '1px solid var(--border)', boxShadow: '0 20px 40px rgba(0,0,0,0.02)' }}>
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="step-0" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                  <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '28px', fontWeight: 700 }}>Where should we deliver?</h2>
                  <Link href="/cart" style={{ fontSize: '13px', color: 'var(--sienna)', fontWeight: 700, textDecoration: 'none' }}>Edit Cart</Link>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                  <Input label="First Name" value={form.firstName} onChange={(v: string) => setForm({...form, firstName: v})} />
                  <Input label="Last Name" value={form.lastName} onChange={(v: string) => setForm({...form, lastName: v})} />
                </div>
                
                <div style={{ marginBottom: '24px' }}>
                   <Input label="Phone Number (WhatsApp preferred)" type="tel" icon={Smartphone} value={form.phone} onChange={(v: string) => setForm({...form, phone: v})} />
                </div>

                <div style={{ marginBottom: '24px' }}>
                   <Input label="Street Address / Apartment / Landmark" value={form.address} onChange={(v: string) => setForm({...form, address: v})} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: 'var(--gray-warm)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Region</label>
                    <select 
                      value={form.region} 
                      onChange={(e) => setForm({...form, region: e.target.value})}
                      style={{ width: '100%', padding: '14px', border: '1.5px solid var(--border)', borderRadius: '12px', fontSize: '14px', outline: 'none', background: 'white', fontWeight: 600, appearance: 'none' }}
                    >
                      {RWANDA_REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <Input label="City" value={form.city} onChange={(v: string) => setForm({...form, city: v})} />
                </div>

                <button onClick={nextStep} className="btn-primary" style={{ width: '100%', padding: '18px', borderRadius: '16px', fontSize: '16px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                   Continue to Payment <ChevronRight size={18} />
                </button>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div key="step-1" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
                  <button onClick={prevStep} style={{ background: 'var(--cream)', border: 'none', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    <ArrowLeft size={18} />
                  </button>
                  <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '28px', fontWeight: 700 }}>Choose Payment</h2>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
                  {[
                    { id: 'momo', label: 'MTN MoMo / Airtel Money', icon: Smartphone, sub: 'Instant confirmation via RWF pay' },
                    { id: 'card', label: 'Credit / Debit Card', icon: CreditCard, sub: 'Visa, Mastercard, Amex' },
                    { id: 'cod', label: 'Cash on Delivery', icon: Truck, sub: 'Pay when your furniture arrives (RWF)' },
                  ].map(method => (
                    <label key={method.id} style={{
                      display: 'flex', alignItems: 'center', gap: '20px', padding: '24px', borderRadius: '20px', border: `2.5px solid ${payMethod === method.id ? 'var(--charcoal)' : 'var(--border)'}`,
                      cursor: 'pointer', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)', background: payMethod === method.id ? 'var(--ivory)' : 'white'
                    }}>
                      <input type="radio" checked={payMethod === method.id} onChange={() => setPayMethod(method.id)} style={{ width: '20px', height: '20px', accentColor: 'var(--charcoal)' }} />
                      <div style={{ width: '48px', height: '48px', background: payMethod === method.id ? 'var(--charcoal)' : 'var(--cream)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s' }}>
                        <method.icon size={24} color={payMethod === method.id ? 'var(--gold)' : 'var(--gray-warm)'} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 800, fontSize: '15px' }}>{method.label}</div>
                        <div style={{ fontSize: '12px', color: 'var(--gray-warm)' }}>{method.sub}</div>
                      </div>
                    </label>
                  ))}
                </div>

                <button onClick={nextStep} className="btn-primary" style={{ width: '100%', padding: '18px', borderRadius: '16px', fontSize: '16px', fontWeight: 800 }}>
                   Review Your Order
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step-2" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
                  <button onClick={prevStep} style={{ background: 'var(--cream)', border: 'none', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    <ArrowLeft size={18} />
                  </button>
                  <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '28px', fontWeight: 700 }}>Ready to Elevate?</h2>
                </div>

                <div style={{ background: 'var(--ivory)', borderRadius: '24px', padding: '24px', border: '1px solid var(--border)', marginBottom: '32px' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--gray-warm)' }}>DELIVERY TO</span>
                      <button onClick={() => setStep(0)} style={{ background: 'none', border: 'none', color: 'var(--sienna)', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>Edit</button>
                   </div>
                   <div style={{ fontWeight: 800, fontSize: '15px' }}>{form.firstName} {form.lastName}</div>
                   <div style={{ fontSize: '14px', color: 'var(--gray-warm)', marginTop: '4px' }}>{form.address}, {form.city}</div>
                   <div style={{ fontSize: '14px', color: 'var(--gray-warm)' }}>{form.phone}</div>
                </div>

                <button onClick={handleOrder} disabled={loading} className="btn-primary" style={{ width: '100%', padding: '20px', borderRadius: '16px', fontSize: '18px', fontWeight: 800, background: 'var(--charcoal)', position: 'relative', overflow: 'hidden' }}>
                   {loading ? (
                     <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1 }}>Finalizing Experience...</motion.div>
                   ) : (
                     <>Confirm Order • {formatPrice(total)}</>
                   )}
                </button>
                <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--gray-warm)', marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                  <Shield size={12} /> Encrypted & Secure checkout
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Right side: Visual Summary ── */}
        <div style={{ position: 'sticky', top: '120px' }}>
          <div style={{ background: 'white', borderRadius: '32px', padding: '32px', border: '1px solid var(--border)', boxShadow: '0 20px 40px rgba(0,0,0,0.02)' }}>
             <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '20px', fontWeight: 800, marginBottom: '24px' }}>Luxury Cart ({state.items.length})</h3>
             
             <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {state.items.map(item => (
                  <div key={item.id} style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '12px', overflow: 'hidden', flexShrink: 0, border: '1px solid var(--border)' }}>
                      <img src={item.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--charcoal)' }} className="line-clamp-1">{item.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--gray-warm)' }}>Qty: {item.quantity} • {item.material?.split(',')[0]}</div>
                    </div>
                    <div style={{ fontWeight: 800, fontSize: '14px' }}>{formatPrice(item.price * item.quantity)}</div>
                  </div>
                ))}
             </div>

             <div style={{ borderTop: '1px solid var(--border)', paddingTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: 'var(--gray-warm)' }}>
                  <span>Subtotal</span><span>{formatPrice(totalPrice)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: 'var(--gray-warm)' }}>
                  <span>Regional Delivery</span>
                  <span style={{ color: delivery === 0 ? '#059669' : 'inherit', fontWeight: delivery === 0 ? 800 : 400 }}>
                    {delivery === 0 ? 'COMPLIMENTARY' : formatPrice(delivery)}
                  </span>
                </div>
                <div style={{ borderTop: '2px solid var(--border)', borderStyle: 'dashed', marginTop: '12px', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 800, fontSize: '18px' }}>Estimated Total</span>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 900, fontSize: '24px', color: 'var(--charcoal)', letterSpacing: '-0.5px' }}>{formatPrice(total)}</div>
                    <div style={{ fontSize: '10px', color: 'var(--sienna)', fontWeight: 800 }}>VAT INCLUDED</div>
                  </div>
                </div>
             </div>

             <div style={{ marginTop: '32px', padding: '20px', background: 'var(--ivory)', borderRadius: '24px', display: 'flex', gap: '16px', border: '1px dashed var(--border)' }}>
                <Zap size={24} color="var(--gold)" fill="var(--gold)" />
                <div style={{ fontSize: '12px' }}>
                   <div style={{ fontWeight: 800 }}>Our Promise</div>
                   <div style={{ color: 'var(--gray-warm)' }}>Premium white-glove delivery to your doorstep in 3-5 days.</div>
                </div>
             </div>
          </div>
        </div>
      </div>
      <style jsx global>{`
        .line-clamp-1 { display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
    </div>
  );
}

function Input({ label, type = 'text', value, onChange, icon: Icon, placeholder }: any) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: 'var(--gray-warm)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</label>
      <div style={{ position: 'relative' }}>
        {Icon && <Icon size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-warm)' }} />}
        <input 
          type={type} 
          placeholder={placeholder}
          value={value} 
          onChange={(e) => onChange(e.target.value)}
          style={{ 
            width: '100%', padding: `14px 14px 14px ${Icon ? '44px' : '14px'}`, 
            border: '1.5px solid var(--border)', borderRadius: '12px', fontSize: '14px', 
            outline: 'none', transition: 'all 0.2s', background: 'white' 
          }}
          onFocus={(e) => { e.target.style.borderColor = 'var(--charcoal)'; e.target.style.boxShadow = '0 0 0 4px rgba(0,0,0,0.03)'; }}
          onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
        />
      </div>
    </div>
  );
}

