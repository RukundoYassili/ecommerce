'use client';
import React from 'react';
import { motion } from 'framer-motion';

export default function Loading() {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
      {/* Skeleton Breadcrumb */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
        {[100, 60, 120].map((w, i) => (
          <div key={i} style={{ width: `${w}px`, height: '14px', background: 'var(--border)', borderRadius: '4px' }} className="animate-pulse" />
        ))}
      </div>

      <div style={{ display: 'flex', gap: '32px' }}>
        {/* Sidebar Skeleton */}
        <div style={{ width: '280px', flexShrink: 0, display: 'none', md: 'block' } as any} className="hidden md:block">
          <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid var(--border)' }}>
            <div style={{ width: '80px', height: '24px', background: 'var(--border)', borderRadius: '4px', marginBottom: '24px' }} className="animate-pulse" />
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} style={{ width: '100%', height: '32px', background: 'var(--border)', borderRadius: '8px', marginBottom: '12px' }} className="animate-pulse" />
            ))}
            <div style={{ height: '2px', background: 'var(--border)', margin: '24px 0' }} />
            <div style={{ width: '100px', height: '20px', background: 'var(--border)', borderRadius: '4px', marginBottom: '16px' }} className="animate-pulse" />
            <div style={{ width: '100%', height: '8px', background: 'var(--border)', borderRadius: '4px', marginBottom: '24px' }} className="animate-pulse" />
          </div>
        </div>

        {/* Grid Skeleton */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px' }}>
            <div style={{ width: '240px', height: '40px', background: 'var(--border)', borderRadius: '8px' }} className="animate-pulse" />
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ width: '100px', height: '40px', background: 'var(--border)', borderRadius: '8px' }} className="animate-pulse" />
              <div style={{ width: '150px', height: '40px', background: 'var(--border)', borderRadius: '8px' }} className="animate-pulse" />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '24px' }}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border)', height: '400px' }}>
                <div style={{ height: '240px', background: '#F5F5F5' }} className="animate-pulse" />
                <div style={{ padding: '16px' }}>
                  <div style={{ width: '60px', height: '10px', background: 'var(--border)', borderRadius: '4px', marginBottom: '12px' }} className="animate-pulse" />
                  <div style={{ width: '100%', height: '18px', background: 'var(--border)', borderRadius: '4px', marginBottom: '8px' }} className="animate-pulse" />
                  <div style={{ width: '80%', height: '18px', background: 'var(--border)', borderRadius: '4px', marginBottom: '16px' }} className="animate-pulse" />
                  <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <div key={s} style={{ width: '12px', height: '12px', background: 'var(--border)', borderRadius: '50%' }} className="animate-pulse" />
                    ))}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ width: '80px', height: '24px', background: 'var(--border)', borderRadius: '4px' }} className="animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: .5; }
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
}
