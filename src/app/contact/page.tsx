import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export default function ContactPage() {
  return (
    <div style={{ background: 'var(--ivory)', minHeight: '100vh', padding: '60px 24px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '42px', fontWeight: 700, marginBottom: '16px' }}>Contact Us</h1>
          <p style={{ color: 'var(--gray-warm)', fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>
            We're here to help you create your dream home. Reach out to our team for any inquiries regarding products, orders, or interior design advice.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px' }}>
          {/* Contact Form */}
          <div style={{ background: 'white', padding: '40px', borderRadius: '16px', border: '1px solid var(--border)' }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '24px', fontWeight: 700, marginBottom: '24px' }}>Send us a Message</h2>
            <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>First Name</label>
                  <input type="text" placeholder="John" style={{ width: '100%', padding: '12px 16px', border: '1.5px solid var(--border)', borderRadius: '8px', fontSize: '14px', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Last Name</label>
                  <input type="text" placeholder="Doe" style={{ width: '100%', padding: '12px 16px', border: '1.5px solid var(--border)', borderRadius: '8px', fontSize: '14px', outline: 'none' }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Email Address</label>
                <input type="email" placeholder="john@example.com" style={{ width: '100%', padding: '12px 16px', border: '1.5px solid var(--border)', borderRadius: '8px', fontSize: '14px', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Subject</label>
                <select style={{ width: '100%', padding: '12px 16px', border: '1.5px solid var(--border)', borderRadius: '8px', fontSize: '14px', outline: 'none', background: 'white' }}>
                  <option>Order Status</option>
                  <option>Product Inquiry</option>
                  <option>Return & Exchange</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Message</label>
                <textarea rows={5} placeholder="How can we help you?" style={{ width: '100%', padding: '12px 16px', border: '1.5px solid var(--border)', borderRadius: '8px', fontSize: '14px', outline: 'none', resize: 'vertical' }} />
              </div>
              <button type="button" className="btn-primary" style={{ justifyContent: 'center', padding: '14px', fontSize: '15px', marginTop: '10px' }}>
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div style={{ background: 'white', padding: '40px', borderRadius: '16px', border: '1px solid var(--border)', flex: 1 }}>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '24px', fontWeight: 700, marginBottom: '32px' }}>Get in Touch</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#FEF9F5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <MapPin size={24} color="var(--sienna)" />
                  </div>
                  <div>
                    <h3 style={{ fontWeight: 700, fontSize: '15px', marginBottom: '4px' }}>Our Showroom</h3>
                    <p style={{ color: 'var(--gray-warm)', fontSize: '14px', lineHeight: 1.6 }}>123 Design Boulevard<br/>Musanze District<br/>Rwanda</p>
                  </div>
                </div>

                <div style={{ width: '100%', height: '1px', background: 'var(--border)' }} />

                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#FEF9F5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Phone size={24} color="var(--sienna)" />
                  </div>
                  <div>
                    <h3 style={{ fontWeight: 700, fontSize: '15px', marginBottom: '4px' }}>Phone Support</h3>
                    <p style={{ color: 'var(--gray-warm)', fontSize: '14px' }}>+250 788 885 231</p>
                    <p style={{ color: 'var(--gray-warm)', fontSize: '13px', marginTop: '4px' }}>Mon - Fri: 8am - 6pm</p>
                  </div>
                </div>

                <div style={{ width: '100%', height: '1px', background: 'var(--border)' }} />

                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#FEF9F5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Mail size={24} color="var(--sienna)" />
                  </div>
                  <div>
                    <h3 style={{ fontWeight: 700, fontSize: '15px', marginBottom: '4px' }}>Email Us</h3>
                    <p style={{ color: 'var(--gray-warm)', fontSize: '14px' }}>support@b-fresh.co.rw</p>
                    <p style={{ color: 'var(--gray-warm)', fontSize: '13px', marginTop: '4px' }}>We reply within 24 hours</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div style={{ height: '250px', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border)', position: 'relative' }}>
               <img src="https://images.unsplash.com/photo-1524758870432-af57e54afa26?w=800&q=80" alt="Showroom Map" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
               <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <button className="btn-primary">View on Google Maps</button>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
