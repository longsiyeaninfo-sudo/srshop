import React from 'react';
import { useStore } from '../../context/StoreContext';
import ProductCard from '../products/ProductCard';
import { Heart, ShoppingBag, ArrowLeft } from 'lucide-react';

export default function WishlistPage() {
  const { wishlist, setCurrentView } = useStore();

  return (
    <div className="page-wrapper" style={{ padding: '3rem 0', minHeight: '60vh' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(236, 72, 153, 0.15)', color: '#ec4899', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Heart size={22} fill="#ec4899" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 900 }}>Saved Wishlist ({wishlist.length})</h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Your favorite imported gadgets and essentials saved for later.</p>
          </div>
        </div>

        <button
          onClick={() => setCurrentView('shop')}
          className="btn-secondary btn-sm"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <ArrowLeft size={14} />
          <span>Back to Store</span>
        </button>
      </div>

      {wishlist.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem', borderRadius: 'var(--radius-xl)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>💖</div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.5rem' }}>Your wishlist is empty</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Tap the heart icon on any product to save it here for later.</p>
          <button onClick={() => setCurrentView('shop')} className="btn-primary">
            <span>Explore Catalog</span>
          </button>
        </div>
      ) : (
        <div className="product-grid">
          {wishlist.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

    </div>
  );
}
