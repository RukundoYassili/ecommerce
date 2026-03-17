'use client';
import React from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter, Youtube, Truck, RotateCcw, Shield, Star } from 'lucide-react';

const footerLinks = {
  company: [
    { label: 'About B-FRESH', href: '/about' },
    { label: 'Our Story', href: '/about' },
    { label: 'Visit Showrooms', href: '/contact' },
    { label: 'Blog', href: '/blog' },
    { label: 'Careers', href: '/careers' },
  ],
  categories: [
    { label: 'Sofas & Sectionals', href: '/products/sofas' },
    { label: 'Beds & Mattresses', href: '/products/beds' },
    { label: 'Dining Sets', href: '/products/dining' },
    { label: 'Chairs', href: '/products/chairs' },
    { label: 'Home Decor', href: '/products/decor' },
    { label: 'Storage & Wardrobes', href: '/products/storage' },
  ],
  policies: [
    { label: 'Contact Us', href: '/contact' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Shipping & Delivery', href: '/policies/shipping' },
    { label: 'Returns & Refunds', href: '/policies/returns' },
    { label: 'Warranty', href: '/policies/warranty' },
    { label: 'Privacy Policy', href: '/privacy' },
  ],
};

const trustBadges = [
  { icon: Truck, title: 'Free Delivery', sub: 'On orders over 750,000 RWF' },
  { icon: RotateCcw, title: 'Easy Returns', sub: '30-day hassle-free returns' },
  { icon: Shield, title: 'Quality Assured', sub: 'Premium grade materials' },
  { icon: Star, title: 'Top Rated', sub: '4.8★ from 10,000+ reviews' },
];

export default function Footer() {
  return (
    <footer>
      {/* Trust badges */}
      <div style={{ background: 'var(--charcoal)', padding: '48px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px' }}>
          {trustBadges.map((badge, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '48px', height: '48px', background: 'var(--sienna)',
                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <badge.icon size={22} color="white" />
              </div>
              <div>
                <div style={{ color: 'white', fontWeight: 700, fontSize: '14px' }}>{badge.title}</div>
                <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '12px', marginTop: '2px' }}>{badge.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main footer */}
      <div style={{ background: '#111', padding: '64px 24px 40px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '48px', marginBottom: '48px' }}>
            {/* Brand column */}
            <div>
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '28px', fontWeight: 700, color: 'white', lineHeight: 1 }}>B-FRESH</div>
                <div style={{ fontSize: '10px', color: 'var(--gold)', letterSpacing: '3px', marginTop: '2px', fontWeight: 600 }}>TRADING LTD</div>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', lineHeight: 1.7, marginBottom: '24px' }}>
                Transforming homes across Rwanda with handcrafted, premium-quality furniture that blends timeless design with everyday comfort.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
                <a href="tel:+250788885231" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '13px' }}>
                  <Phone size={14} color="var(--sienna)" /> +250 788 885 231
                </a>
                <a href="mailto:support@b-fresh.co.rw" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '13px' }}>
                  <Mail size={14} color="var(--sienna)" /> support@b-fresh.co.rw
                </a>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>
                  <MapPin size={14} color="var(--sienna)" /> Musanze, Rwanda
                </span>
              </div>
              {/* Social links */}
              <div style={{ display: 'flex', gap: '12px' }}>
                {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                  <a key={i} href="#" style={{
                    width: '36px', height: '36px', background: 'rgba(255,255,255,0.08)',
                    borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--sienna)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}>
                    <Icon size={16} color="white" />
                  </a>
                ))}
              </div>
            </div>

            {/* Links columns */}
            {Object.entries(footerLinks).map(([key, links]) => (
              <div key={key}>
                <h4 style={{ color: 'white', fontSize: '13px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '20px' }}>
                  {key === 'company' ? 'Company' : key === 'categories' ? 'Shop' : 'Support'}
                </h4>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: '13px', transition: 'color 0.2s' }}
                        onMouseEnter={(e) => ((e.target as HTMLElement).style.color = 'var(--gold)')}
                        onMouseLeave={(e) => ((e.target as HTMLElement).style.color = 'rgba(255,255,255,0.5)')}
                      >{link.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '12px' }}>
              © 2026 B-FRESH TRADING LTD. All rights reserved.
            </p>
            <div style={{ display: 'flex', gap: '16px' }}>
              {['Terms', 'Privacy', 'Cookies'].map((t) => (
                <Link key={t} href="#" style={{ color: 'rgba(255,255,255,0.35)', textDecoration: 'none', fontSize: '12px' }}>{t}</Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
