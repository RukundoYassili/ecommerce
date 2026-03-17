'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      router.push('/checkout');
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1.1fr 0.9fr' }} className="auth-layout">
      {/* Left - Cinematic Image Section */}
      <div style={{ position: 'relative', overflow: 'hidden', padding: '60px' }} className="hidden lg:flex flex-col justify-end bg-charcoal">
        <img 
          src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=90" 
          alt="Luxury Furniture" 
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} 
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(26,26,26,0.95) 0%, transparent 60%)' }} />
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ position: 'relative', zIndex: 2, maxWidth: '500px' }}
        >
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '48px', fontWeight: 700, color: 'white', lineHeight: 1.1, marginBottom: '20px' }}>
            Elevate Your Everyday Living
          </div>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '18px', lineHeight: 1.6, fontWeight: 400 }}>
            Discover handcrafted pieces that turn houses into homes. Sign in to continue your curated journey with B-FRESH.
          </p>
          <div style={{ display: 'flex', gap: '30px', marginTop: '40px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '30px' }}>
            <div>
              <div style={{ color: 'var(--gold)', fontWeight: 700, fontSize: '20px' }}>15k+</div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Happy Customers</div>
            </div>
            <div>
              <div style={{ color: 'var(--gold)', fontWeight: 700, fontSize: '20px' }}>Rwanda</div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Nationwide Delivery</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right - Focused Form Section */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', background: 'var(--ivory)' }}>
        <motion.div 
          initial={{ opacity: 0, x: 20 }} 
          animate={{ opacity: 1, x: 0 }} 
          style={{ width: '100%', maxWidth: '380px' }}
        >
          <Link href="/" style={{ textDecoration: 'none', display: 'inline-block', marginBottom: '48px' }}>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '28px', fontWeight: 800, color: 'var(--charcoal)', letterSpacing: '-0.5px' }}>B-FRESH</div>
            <div style={{ fontSize: '10px', color: 'var(--sienna)', letterSpacing: '4px', fontWeight: 700, marginTop: '-2px' }}>TRADING LTD</div>
          </Link>

          <div style={{ marginBottom: '32px' }}>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '32px', fontWeight: 700, color: 'var(--charcoal)', marginBottom: '8px' }}>Sign In</h1>
            <p style={{ color: 'var(--gray-warm)', fontSize: '15px' }}>
              Welcome back. Let's get you signed in.
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="form-group">
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: 'var(--charcoal)' }}>Email Address</label>
              <input 
                type="email" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="name@example.com"
                style={{ 
                  width: '100%', padding: '14px 16px', border: '1px solid var(--border)', borderRadius: '12px', 
                  fontSize: '15px', outline: 'none', background: 'white', transition: 'all 0.3s ease',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                }}
                className="auth-input"
              />
            </div>
            
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--charcoal)' }}>Password</label>
                <Link href="/auth/forgot-password" style={{ fontSize: '13px', color: 'var(--sienna)', textDecoration: 'none', fontWeight: 500 }}>Forgot?</Link>
              </div>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showPass ? 'text' : 'password'} 
                  required 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="••••••••"
                  style={{ 
                    width: '100%', padding: '14px 48px 14px 16px', border: '1px solid var(--border)', borderRadius: '12px', 
                    fontSize: '15px', outline: 'none', background: 'white', transition: 'all 0.3s ease',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                  }}
                  className="auth-input"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPass(!showPass)} 
                  style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-warm)' }}
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="btn-primary" 
              style={{ 
                justifyContent: 'center', padding: '16px', fontSize: '16px', 
                borderRadius: '12px', marginTop: '8px' 
              }}
            >
              {loading ? 'Entering...' : 'Sign In'} {!loading && <ArrowRight size={20} />}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '32px', fontSize: '14px', color: 'var(--gray-warm)' }}>
            New to B-FRESH? <Link href="/auth/register" style={{ color: 'var(--sienna)', fontWeight: 700, textDecoration: 'none' }}>Create an account</Link>
          </p>

          <style jsx global>{`
            .auth-input:focus {
              border-color: var(--sienna) !important;
              box-shadow: 0 0 0 4px rgba(192, 84, 26, 0.08) !important;
            }
          `}</style>
        </motion.div>
      </div>
    </div>
  );
}
