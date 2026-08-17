import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import DynamicHeroSlideshow from './components/products/DynamicHeroSlideshow';
import CategoryBar from './components/products/CategoryBar';
import ProductGrid from './components/products/ProductGrid';
import ProductDetailModal from './components/products/ProductDetailModal';
import ProductComparisonModal from './components/products/ProductComparisonModal';
import CartDrawer from './components/cart/CartDrawer';
import CheckoutWizard from './components/checkout/CheckoutWizard';
import OrderTracking from './components/orders/OrderTracking';
import WishlistPage from './components/wishlist/WishlistPage';
import AdminDashboard from './components/admin/AdminDashboard';
import AuthModal from './components/auth/AuthModal';
import ToastContainer from './components/common/ToastContainer';
import FloatingContactDock from './components/common/FloatingContactDock';
import SocialProofToasts from './components/common/SocialProofToasts';
import TelegramQRModal from './components/common/TelegramQRModal';
import { Scale } from 'lucide-react';

function MainStoreApp() {
  const { currentView, comparedProducts } = useStore();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isTelegramModalOpen, setIsTelegramModalOpen] = useState(false);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Navigation with Integrated Currency, Language & Theme Selectors */}
      <Navbar onOpenAuth={() => setIsAuthOpen(true)} />

      {/* Main View Router */}
      <main style={{ flex: 1 }}>
        {currentView === 'shop' && (
          <div className="animate-fade-in">
            <DynamicHeroSlideshow />
            <div className="page-wrapper">
              <CategoryBar />
              <ProductGrid />
            </div>
          </div>
        )}

        {currentView === 'checkout' && (
          <div className="animate-fade-in page-wrapper">
            <CheckoutWizard />
          </div>
        )}

        {currentView === 'tracking' && (
          <div className="animate-fade-in page-wrapper">
            <OrderTracking />
          </div>
        )}

        {currentView === 'wishlist' && (
          <div className="animate-fade-in page-wrapper">
            <WishlistPage />
          </div>
        )}

        {currentView === 'admin' && (
          <div className="animate-fade-in page-wrapper">
            <AdminDashboard />
          </div>
        )}
      </main>

      {/* Compare Floating Pill */}
      {comparedProducts.length > 0 && (
        <div
          onClick={() => setIsCompareModalOpen(true)}
          style={{
            position: 'fixed',
            bottom: '24px',
            left: '24px',
            zIndex: 9000,
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            color: '#ffffff',
            padding: '0.65rem 1.1rem',
            borderRadius: 'var(--radius-full)',
            boxShadow: '0 8px 25px rgba(99, 102, 241, 0.5)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: 800,
            fontSize: '0.85rem',
            cursor: 'pointer',
            border: '1px solid rgba(255,255,255,0.2)'
          }}
        >
          <Scale size={16} />
          <span>Compare ({comparedProducts.length})</span>
        </div>
      )}

      {/* Global Overlays & Modals */}
      <ProductDetailModal />
      <ProductComparisonModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
      />
      <CartDrawer />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <ToastContainer />
      <FloatingContactDock />
      <SocialProofToasts />
      <TelegramQRModal
        isOpen={isTelegramModalOpen}
        onClose={() => setIsTelegramModalOpen(false)}
      />

      {/* Store Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <MainStoreApp />
    </StoreProvider>
  );
}
