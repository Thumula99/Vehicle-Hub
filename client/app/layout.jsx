import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import { ChatProvider } from '../context/ChatContext';
import { WishlistProvider } from '../context/WishlistContext';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

export const metadata = {
  title: 'Vehicle-Hub (AutoHub) — Premier Vehicle Marketplace',
  description: 'Buy, sell, compare, and discuss vehicles in real-time across Sri Lanka.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
        <AuthProvider>
          <ChatProvider>
            <WishlistProvider>
              <Navbar />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </WishlistProvider>
          </ChatProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
