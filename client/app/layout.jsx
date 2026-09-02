import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import { ChatProvider } from '../context/ChatContext';
import { WishlistProvider } from '../context/WishlistContext';
import { CompareProvider } from '../context/CompareContext';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import CompareFloatingBar from '../components/search/CompareFloatingBar';

export const metadata = {
  title: 'Vehicle-Hub (AutoHub) — Premier Vehicle Marketplace',
  description: 'Buy, sell, compare, and discuss vehicles in real-time with Supabase database backing.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
        <AuthProvider>
          <ChatProvider>
            <WishlistProvider>
              <CompareProvider>
                <Navbar />
                <main className="flex-1">
                  {children}
                </main>
                <CompareFloatingBar />
                <Footer />
              </CompareProvider>
            </WishlistProvider>
          </ChatProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
