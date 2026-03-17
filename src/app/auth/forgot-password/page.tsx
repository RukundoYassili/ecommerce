'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Send } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email');
      return;
    }
    
    setLoading(true);
    try {
      await resetPassword(email);
      setSent(true);
      toast.success('Recovery link sent to your email');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send recovery link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1.1fr 0.9fr' }} className="auth-layout">
      {/* Left - Cinematic Image Section */}
      <div style={{ position: 'relative', overflow: 'hidden', padding: '60px' }} className="hidden lg:flex flex-col justify-end bg-charcoal">
        <img 
          src="https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=1200&q=90" 
          alt="Luxury Interior" 
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
            We'll Help You Get Back In
          </div>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '18px', lineHeight: 1.6, fontWeight: 400 }}>
            Security is our priority. Enter your email and we'll send you a secure link to reset your access.
          </p>
        </motion.div>
      </div>

      {/* Right - Focused Form Section */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', background: 'var(--ivory)' }}>
        <motion.div 
          initial={{ opacity: 0, x: 20 }} 
          animate={{ opacity: 1, x: 0 }} 
          style={{ width: '100%', maxWidth: '380px' }}
        >
          <Link href="/auth/login" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--gray-warm)', marginBottom: '40px', fontSize: '14px', fontWeight: 700 }}>
             <ArrowLeft size={16} /> BACK TO SIGN IN
          </Link>

          {!sent ? (
            <>
              <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '32px', fontWeight: 700, color: 'var(--charcoal)', marginBottom: '8px' }}>Forgot Password?</h1>
                <p style={{ color: 'var(--gray-warm)', fontSize: '15px' }}>
                  No worries. Enter your email address and we'll send you a password reset link.
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
                
                <button 
                  type="submit" 
                  disabled={loading} 
                  className="btn-primary" 
                  style={{ 
                    justifyContent: 'center', padding: '16px', fontSize: '16px', 
                    borderRadius: '12px', marginTop: '8px' 
                  }}
                >
                  {loading ? 'Sending Request...' : 'Send Recovery Link'} {!loading && <Send size={18} style={{ marginLeft: '10px' }} />}
                </button>
              </form>
            </>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '80px', height: '80px', background: 'var(--cream)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px', color: 'var(--sienna)' }}>
                <Send size={32} />
              </div>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '28px', fontWeight: 700, color: 'var(--charcoal)', marginBottom: '16px' }}>Check Your Email</h2>
              <p style={{ color: 'var(--gray-warm)', fontSize: '16px', lineHeight: 1.6, marginBottom: '32px' }}>
                We've sent a password reset link to <br /><strong style={{ color: 'var(--charcoal)' }}>{email}</strong>
              </p>
              <p style={{ fontSize: '14px', color: 'var(--gray-warm)' }}>
                Didn't receive it? <button onClick={handleSubmit} style={{ background: 'none', border: 'none', color: 'var(--sienna)', fontWeight: 700, cursor: 'pointer', padding: 0 }}>Click here to resend</button>
              </p>
            </div>
          )}

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
