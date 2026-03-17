'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ArrowRight, Check } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password || !formData.firstName) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setLoading(true);
    try {
      const data = await register(`${formData.firstName} ${formData.lastName}`, formData.email, formData.password);
      
      if (data?.session) {
        toast.success('Account created successfully!');
        router.push('/checkout');
      } else {
        toast.success('Registration successful! Please check your email to confirm your account.', {
          duration: 6000,
          icon: '✉️'
        });
        // Optionally redirect to a "Verify Email" landing page or just keep them here
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1.1fr 0.9fr' }} className="auth-layout">
      {/* Left - Cinematic Image Section */}
      <div style={{ position: 'relative', overflow: 'hidden', padding: '60px' }} className="hidden lg:flex flex-col justify-end bg-charcoal">
        <img 
          src="https://images.unsplash.com/photo-1505693314120-0d443867891c?w=1200&q=90" 
          alt="Home Interior" 
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5 }} 
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(26,26,26,0.95) 0%, transparent 60%)' }} />
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8 }}
          style={{ position: 'relative', zIndex: 2, maxWidth: '500px' }}
        >
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '48px', fontWeight: 700, color: 'white', lineHeight: 1.1, marginBottom: '24px' }}>
            Start Your Home Story
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px' }}>
            {[
              'Exclusive member-only collections',
              'Complimentary interior styling sessions',
              'Real-time order tracking & history',
              'Priority invitation to B-FRESH events'
            ].map((text, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '22px', height: '22px', background: 'var(--sienna)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Check size={12} color="white" strokeWidth={3} />
                </div>
                <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '15px' }}>{text}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right - Form Section */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', background: 'var(--ivory)', overflowY: 'auto' }}>
        <motion.div 
          initial={{ opacity: 0, x: 20 }} 
          animate={{ opacity: 1, x: 0 }} 
          style={{ width: '100%', maxWidth: '420px', padding: '40px 0' }}
        >
          <Link href="/" style={{ textDecoration: 'none', display: 'inline-block', marginBottom: '40px' }}>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '28px', fontWeight: 800, color: 'var(--charcoal)', letterSpacing: '-0.5px' }}>B-FRESH</div>
            <div style={{ fontSize: '10px', color: 'var(--sienna)', letterSpacing: '4px', fontWeight: 700, marginTop: '-2px' }}>TRADING LTD</div>
          </Link>

          <div style={{ marginBottom: '32px' }}>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '32px', fontWeight: 700, color: 'var(--charcoal)', marginBottom: '8px' }}>Create Account</h1>
            <p style={{ color: 'var(--gray-warm)', fontSize: '15px' }}>
              Let's get your B-FRESH membership started.
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: 'var(--charcoal)' }}>First Name</label>
                <input 
                  type="text" 
                  value={formData.firstName} 
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})} 
                  placeholder="John" 
                  style={{ width: '100%', padding: '13px 16px', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '14px', outline: 'none', background: 'white' }}
                  className="auth-input"
                />
              </div>
              <div className="form-group">
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: 'var(--charcoal)' }}>Last Name</label>
                <input 
                  type="text" 
                  value={formData.lastName} 
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})} 
                  placeholder="Doe" 
                  style={{ width: '100%', padding: '13px 16px', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '14px', outline: 'none', background: 'white' }}
                  className="auth-input"
                />
              </div>
            </div>
            
            <div className="form-group">
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: 'var(--charcoal)' }}>Email Adress</label>
              <input 
                type="email" 
                value={formData.email} 
                onChange={(e) => setFormData({...formData, email: e.target.value})} 
                placeholder="name@example.com" 
                style={{ width: '100%', padding: '13px 16px', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '14px', outline: 'none', background: 'white' }}
                className="auth-input"
              />
            </div>

            <div className="form-group">
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: 'var(--charcoal)' }}>Phone Number</label>
              <input 
                type="tel" 
                value={formData.phone} 
                onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                placeholder="+250 ..." 
                style={{ width: '100%', padding: '13px 16px', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '14px', outline: 'none', background: 'white' }}
                className="auth-input"
              />
            </div>

            <div className="form-group">
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: 'var(--charcoal)' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showPass ? 'text' : 'password'} 
                  value={formData.password} 
                  onChange={(e) => setFormData({...formData, password: e.target.value})} 
                  placeholder="At least 8 characters" 
                  style={{ width: '100%', padding: '13px 48px 13px 16px', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '14px', outline: 'none', background: 'white' }}
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

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginTop: '4px' }}>
              <input type="checkbox" id="terms" required style={{ marginTop: '3px', accentColor: 'var(--sienna)', width: '16px', height: '16px' }} />
              <label htmlFor="terms" style={{ fontSize: '12px', color: 'var(--gray-warm)', lineHeight: 1.6, cursor: 'pointer' }}>
                I agree to the <Link href="#" style={{ color: 'var(--charcoal)', fontWeight: 600, textDecoration: 'underline' }}>Terms of Service</Link> and <Link href="#" style={{ color: 'var(--charcoal)', fontWeight: 600, textDecoration: 'underline' }}>Privacy Policy</Link>
              </label>
            </div>
            
            <button 
              type="submit" 
              disabled={loading} 
              className="btn-primary" 
              style={{ justifyContent: 'center', padding: '16px', fontSize: '16px', borderRadius: '12px', marginTop: '12px' }}
            >
              {loading ? 'Creating Account...' : 'Create Account'} {!loading && <ArrowRight size={20} />}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '32px', fontSize: '14px', color: 'var(--gray-warm)' }}>
            Already a member? <Link href="/auth/login" style={{ color: 'var(--sienna)', fontWeight: 700, textDecoration: 'none' }}>Sign In</Link>
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
