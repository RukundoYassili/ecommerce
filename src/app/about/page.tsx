import React from 'react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div style={{ background: 'var(--ivory)', minHeight: '100vh', padding: '60px 24px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '42px', fontWeight: 700, marginBottom: '24px' }}>Our Story</h1>
           <div style={{ width: '100%', height: '400px', borderRadius: '16px', overflow: 'hidden', marginBottom: '40px' }}>
             <img src="https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=1200&q=80" alt="B-FRESH Studio" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
           </div>
          <p style={{ color: 'var(--charcoal)', fontSize: '20px', lineHeight: 1.6, maxWidth: '800px', margin: '0 auto' }}>
            Founded in Kigali, B-FRESH TRADING LTD was born out of a simple philosophy: beautiful, premium furniture should be accessible to everyone creating their sanctuary.
          </p>
        </div>

        {/* Values Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px', marginBottom: '80px' }}>
          {[
            { title: 'Quality Craftsmanship', text: 'We work directly with master artisans who have spent decades perfecting their craft. Every joint, every stitch is deliberate.' },
            { title: 'Sustainable Materials', text: 'Our wood is responsibly sourced and our fabrics are chosen for their low environmental impact and high durability.' },
            { title: 'Direct to You', text: 'By removing middlemen and operating primarily online, we pass the savings directly to you without compromising on quality.' }
          ].map(v => (
            <div key={v.title} style={{ background: 'white', padding: '32px', borderRadius: '16px', border: '1px solid var(--border)' }}>
               <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '20px', fontWeight: 700, marginBottom: '16px', color: 'var(--sienna)' }}>{v.title}</h3>
               <p style={{ color: 'var(--gray-warm)', lineHeight: 1.6, fontSize: '15px' }}>{v.text}</p>
            </div>
          ))}
        </div>

        {/* Team Section */}
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '32px', fontWeight: 700, marginBottom: '40px' }}>The Team Behind the Craft</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
            {[
              { name: 'Sarah M.', role: 'Head of Design', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80' },
              { name: 'David K.', role: 'Lead Artisan', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80' },
              { name: 'Grace T.', role: 'Customer Experience', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80' }
            ].map(m => (
              <div key={m.name}>
                <img src={m.img} alt={m.name} style={{ width: '160px', height: '160px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 16px', border: '4px solid white', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }} />
                <h4 style={{ fontWeight: 700, fontSize: '16px' }}>{m.name}</h4>
                <p style={{ color: 'var(--gray-warm)', fontSize: '14px' }}>{m.role}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ textAlign: 'center', background: 'white', padding: '60px', borderRadius: '16px', border: '1px solid var(--border)' }}>
           <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '28px', fontWeight: 700, marginBottom: '16px' }}>Ready to elevate your space?</h2>
           <p style={{ color: 'var(--gray-warm)', marginBottom: '32px', fontSize: '16px' }}>Explore our latest collections and find the perfect piece for your home.</p>
           <Link href="/" className="btn-primary" style={{ display: 'inline-flex' }}>Shop Collections</Link>
        </div>

      </div>
    </div>
  );
}
