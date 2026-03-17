'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Eye, EyeOff, CheckCircle2, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

export default function ResetPasswordPage() {
  const { updatePassword } = useAuth();
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    setLoading(true);
    try {
      await updatePassword(password);
      setSuccess(true);
      toast.success('Password updated successfully!');
      setTimeout(() => {
        router.push('/auth/login');
      }, 3000);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update password');
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
            Secure Your Sanctuary
          </div>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '18px', lineHeight: 1.6, fontWeight: 400 }}>
            Choose a strong password to protect your curated collection and personal dashboard.
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
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '28px', fontWeight: 800, color: 'var(--charcoal)', letterSpacing: '-0.5px', marginBottom: '48px' }}>
            B-FRESH
          </div>

          {!success ? (
            <>
              <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '32px', fontWeight: 700, color: 'var(--charcoal)', marginBottom: '8px' }}>Reset Password</h1>
                <p style={{ color: 'var(--gray-warm)', fontSize: '15px' }}>
                  Choose a new password for your account.
                </p>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div className="form-group">
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: 'var(--charcoal)' }}>New Password</label>
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

                <div className="form-group">
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: 'var(--charcoal)' }}>Confirm Password</label>
                  <input 
                    type="password" 
                    required 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    placeholder="••••••••"
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
                  {loading ? 'Updating...' : 'Save New Password'}
                </button>
              </form>
            </>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '80px', height: '80px', background: '#E8F5E9', color: '#2E7D32', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px' }}>
                <CheckCircle2 size={32} />
              </div>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '28px', fontWeight: 700, color: 'var(--charcoal)', marginBottom: '16px' }}>Successful Reset</h2>
              <p style={{ color: 'var(--gray-warm)', fontSize: '16px', lineHeight: 1.6, marginBottom: '32px' }}>
                Your password has been securely updated. Redirecting you to sign in...
              </p>
              <Link href="/auth/login" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px', borderRadius: '12px' }}>
                Sign In Now <ArrowRight size={18} style={{ marginLeft: '10px' }} />
              </Link>
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
