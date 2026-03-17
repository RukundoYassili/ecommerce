'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    category: 'Orders & Shipping',
    items: [
      { q: 'How long does delivery take?', a: 'For standard items in stock, delivery within Kigali takes 2-3 business days. For customized or out-of-stock items, please allow 10-14 business days.' },
      { q: 'Do you offer free shipping?', a: 'Yes! We offer free delivery on all orders over 750,000 RWF. For orders under this amount, a standard delivery fee of 48,750 RWF applies depending on your location.' },
      { q: 'Can I track my order?', a: 'Absolutely. Once your order has been dispatched, you will receive an email with a tracking link to monitor your delivery in real-time.' }
    ]
  },
  {
    category: 'Returns & Warranty',
    items: [
      { q: 'What is your return policy?', a: 'We offer a 30-day hassle-free return policy. If you are not completely satisfied with your furniture, you can return it in its original condition for a full refund or exchange.' },
      { q: 'Do your products come with a warranty?', a: 'Yes, all our furniture comes with a minimum 1-year structural warranty, while premium items like mattresses and solid wood tables carry up to a 10-year warranty.' }
    ]
  },
  {
    category: 'Products & Assembly',
    items: [
      { q: 'Do you offer assembly services?', a: 'Yes, our delivery team will assemble your furniture upon delivery for free, so you can start enjoying your new pieces immediately.' },
      { q: 'Where is your furniture made?', a: 'Our furniture is designed in-house and manufactured by partnered artisan workshops around the globe, ensuring the highest standards of materials and craftsmanship.' },
      { q: 'Can I see the furniture in person?', a: 'Yes! You can visit our flagship showroom at 123 Design Boulevard, Kigali, to experience the quality and comfort of our products firsthand.' }
    ]
  }
];

export default function FAQPage() {
  const [open, setOpen] = useState<string | null>(null);

  const toggle = (q: string) => setOpen(open === q ? null : q);

  return (
    <div style={{ background: 'var(--ivory)', minHeight: '100vh', padding: '60px 24px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '42px', fontWeight: 700, marginBottom: '16px' }}>Frequently Asked Questions</h1>
          <p style={{ color: 'var(--gray-warm)', fontSize: '18px' }}>Find answers to common questions about our products, shipping, and policies.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
          {faqs.map(section => (
            <div key={section.category}>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '24px', fontWeight: 700, marginBottom: '24px', paddingBottom: '12px', borderBottom: '2px solid var(--border)' }}>
                {section.category}
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {section.items.map(item => (
                  <div key={item.q} style={{ background: 'white', borderRadius: '12px', border: '1px solid var(--border)', overflow: 'hidden' }}>
                    <button 
                      onClick={() => toggle(item.q)}
                      style={{ width: '100%', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                    >
                      <span style={{ fontWeight: 600, fontSize: '15px', color: open === item.q ? 'var(--sienna)' : 'var(--charcoal)', transition: 'color 0.2s' }}>{item.q}</span>
                      {open === item.q ? <ChevronUp size={20} color="var(--sienna)" /> : <ChevronDown size={20} color="var(--gray-warm)" />}
                    </button>
                    <AnimatePresence>
                      {open === item.q && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
                          <div style={{ padding: '0 20px 20px', color: 'var(--gray-warm)', fontSize: '14px', lineHeight: 1.6 }}>
                            {item.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '60px', padding: '40px', background: 'white', borderRadius: '16px', border: '1px solid var(--border)' }}>
          <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '22px', fontWeight: 700, marginBottom: '12px' }}>Still have questions?</h3>
          <p style={{ color: 'var(--gray-warm)', marginBottom: '24px', fontSize: '15px' }}>Our customer support team is always ready to help you.</p>
          <Link href="/contact" className="btn-primary" style={{ display: 'inline-flex' }}>Contact Us</Link>
        </div>
      </div>
    </div>
  );
}
