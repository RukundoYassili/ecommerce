'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Phone, MapPin, Save, 
  ArrowLeft, Camera, Shield, Globe, 
  Smartphone, Lock 
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import toast, { Toaster } from 'react-hot-toast';

export default function SettingsPage() {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    full_name: '',
    phone: '',
    address: '',
    avatar_url: ''
  });

  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (data) {
            setProfile({
              full_name: data.full_name || user.name || '',
              phone: data.phone || '',
              address: data.address || '',
              avatar_url: data.avatar_url || user.avatar || ''
            });
          }
        } catch (err) {
          console.error('Error fetching profile:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchProfile();
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    try {
      await updateProfile({
        name: profile.full_name,
        phone: profile.phone,
        address: profile.address,
      });
      toast.success('B-FRESH Profile Updated!');
    } catch (error) {
      toast.error('Failed to update sanctuary details');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--ivory)' }}>
      <div className="animate-pulse" style={{ fontSize: '14px', fontWeight: 800, color: 'var(--gray-warm)' }}>Dressing your sanctuary...</div>
    </div>
  );

  return (
    <div style={{ background: 'var(--ivory)', minHeight: '100vh', padding: '60px 24px' }}>
      <Toaster position="bottom-right" />
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        {/* ── Navigation ── */}
        <Link href="/account" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--gray-warm)', textDecoration: 'none', marginBottom: '32px', fontWeight: 800, fontSize: '13px' }}>
          <ArrowLeft size={16} /> RETURN TO SANCTUARY
        </Link>
        
        <header style={{ marginBottom: '48px' }}>
           <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '42px', fontWeight: 800, margin: 0, color: 'var(--charcoal)' }}>Profile Management</h1>
           <p style={{ color: 'var(--gray-warm)', fontSize: '16px', marginTop: '8px' }}>Define your personal experience with B-FRESH.</p>
        </header>

        <form onSubmit={handleSave} style={{ display: 'grid', gap: '32px' }}>
          
          {/* ── Visual Identity ── */}
          <section style={{ background: 'white', borderRadius: '32px', padding: '40px', border: '1px solid var(--border)', boxShadow: '0 20px 40px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '32px', marginBottom: '40px' }}>
              <div style={{ position: 'relative' }}>
                <img 
                  src={profile.avatar_url || `https://ui-avatars.com/api/?name=${user?.name}&background=1a1a1a&color=fff&size=200`} 
                  alt="Profile" 
                  style={{ width: '120px', height: '120px', borderRadius: '40px', objectFit: 'cover', border: '4px solid var(--ivory)' }} 
                />
                <button type="button" style={{ position: 'absolute', bottom: '-10px', right: '-10px', background: 'var(--charcoal)', color: 'white', border: '4.5px solid white', width: '44px', height: '44px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'transform 0.2s' }}>
                  <Camera size={20} />
                </button>
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 800 }}>Visual Identity</h3>
                <p style={{ color: 'var(--gray-warm)', fontSize: '14px', margin: '6px 0 0' }}>This helps us identify you in our Kigali showrooms.</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
               <Field label="Full Name" icon={User} value={profile.full_name} onChange={(v) => setProfile({...profile, full_name: v})} />
               <div style={{ opacity: 0.6 }}>
                  <Field label="Email Address" icon={Mail} value={user?.email || ''} disabled sub="Permanent Identifier" />
               </div>
            </div>
          </section>

          {/* ── Communications & Logistics ── */}
          <section style={{ background: 'white', borderRadius: '32px', padding: '40px', border: '1px solid var(--border)', boxShadow: '0 20px 40px rgba(0,0,0,0.02)' }}>
             <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '22px', fontWeight: 800, marginBottom: '32px' }}>Logistics & Reach</h3>
             
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
                <Field label="Phone Number" icon={Smartphone} placeholder="+250 7xx xxx xxx" value={profile.phone} onChange={(v) => setProfile({...profile, phone: v})} />
                <Field label="Default Delivery Region" icon={Globe} value="Kigali, Rwanda" disabled />
             </div>

             <div style={{ marginBottom: '40px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: 'var(--gray-warm)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                   Permanent Shipping Base
                </label>
                <div style={{ position: 'relative' }}>
                   <MapPin size={20} style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--sienna)' }} />
                   <textarea 
                     value={profile.address}
                     onChange={(e) => setProfile({...profile, address: e.target.value})}
                     placeholder="Street, Landmark, City..."
                     style={{ 
                       width: '100%', padding: '16px 16px 16px 48px', minHeight: '120px', 
                       borderRadius: '16px', border: '1.5px solid var(--border)', fontSize: '15px', 
                       outline: 'none', background: 'white', resize: 'none' 
                     }}
                   />
                </div>
             </div>

             <div style={{ borderTop: '1px solid var(--border)', paddingTop: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#059669', fontSize: '13px', fontWeight: 800 }}>
                   <Lock size={16} /> YOUR DATA IS PRIVATELY HELD
                </div>
                <button 
                  type="submit" 
                  disabled={saving}
                  className="btn-primary" 
                  style={{ padding: '16px 48px', borderRadius: '16px', fontSize: '15px', gap: '12px', background: 'var(--charcoal)' }}
                >
                  {saving ? 'UPDATING...' : <><Save size={18} /> SAVE PREFERENCES</>}
                </button>
             </div>
          </section>

          {/* ── Membership Status Card ── */}
          <div style={{ background: 'var(--cream)', borderRadius: '32px', padding: '32px', border: '1px solid var(--border)', display: 'flex', gap: '24px', alignItems: 'center' }}>
             <div style={{ width: '64px', height: '64px', background: 'white', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Shield size={32} color="var(--gold)" fill="var(--gold)" style={{ opacity: 0.3 }} />
             </div>
             <div>
                <h4 style={{ margin: 0, fontWeight: 800, fontSize: '16px' }}>Verified B-FRESH Professional</h4>
                <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--gray-warm)', lineHeight: 1.5 }}>
                   As a verified member, your data is used only for high-precision fulfillment and elite showroom access in Kigali.
                </p>
             </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, icon: Icon, value, onChange, disabled, placeholder, sub }: any) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: 'var(--gray-warm)', textTransform: 'uppercase', letterSpacing: '1px' }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <Icon size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--sienna)' }} />
        <input 
          type="text" 
          value={value}
          disabled={disabled}
          placeholder={placeholder}
          onChange={(e) => onChange && onChange(e.target.value)}
          style={{ 
            width: '100%', padding: '14px 14px 14px 48px', borderRadius: '14px', 
            border: '1.5px solid var(--border)', fontSize: '15px', outline: 'none',
            background: disabled ? 'var(--ivory)' : 'white'
          }}
        />
      </div>
      {sub && <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--sienna)', opacity: 0.8 }}>{sub}</span>}
    </div>
  );
}

