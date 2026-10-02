import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { ToastProvider } from '@/context/ToastContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'noshop | Sàn Thương Mại Điện Tử',
  description: 'Nền tảng thương mại điện tử noshop - Mua sắm an tâm, sản phẩm chính hãng, giao hàng toàn quốc.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="bg-[#f8f9fa] text-slate-900 min-h-screen flex flex-col font-sans selection:bg-[#f04438] selection:text-white">
        <AuthProvider>
          <CartProvider>
            <ToastProvider>
              <Navbar />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </ToastProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
