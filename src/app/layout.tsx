import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/cart/CartDrawer';

import { AuthProvider } from '@/context/AuthContext';

import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'B-FRESH TRADING LTD | Premium Furniture Online',
  description: 'Shop premium handcrafted furniture from B-FRESH TRADING LTD. Sofas, beds, dining sets, wardrobes, and home decor — delivered across South Africa.',
  keywords: 'furniture, sofas, beds, dining tables, wardrobes, home decor, South Africa',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Toaster position="bottom-right" toastOptions={{ style: { fontFamily: 'Inter, sans-serif', fontSize: '14px' } }} />
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <Header />
              <main>{children}</main>
              <Footer />
              <CartDrawer />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
