import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { ShoppingBag, CheckCircle, Sparkles, X } from 'lucide-react';

const buyerLocations = [
  'Phnom Penh (Kamboul)',
  'Phnom Penh (Toul Kork)',
  'Phnom Penh (Sen Sok)',
  'Phnom Penh (Chbar Ampov)',
  'Siem Reap Province',
  'Battambang Province',
  'Kandal Province',
  'Sihanoukville'
];

const buyerNames = ['Sokha R.', 'Dara C.', 'Vannak M.', 'Sothea K.', 'Meng Ly', 'Pisey N.', 'Chanrith S.', 'Borey T.'];

export default function SocialProofToasts() {
  const { products, setQuickViewProduct, language, formatPrice } = useStore();
  const [currentAlert, setCurrentAlert] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!products || products.length === 0) return;

    // Trigger random social proof alert periodically
    const interval = setInterval(() => {
      const randomProduct = products[Math.floor(Math.random() * products.length)];
      const randomName = buyerNames[Math.floor(Math.random() * buyerNames.length)];
      const randomLocation = buyerLocations[Math.floor(Math.random() * buyerLocations.length)];
      const randomMins = Math.floor(Math.random() * 8) + 1;

      setCurrentAlert({
        product: randomProduct,
        buyer: randomName,
        location: randomLocation,
        minsAgo: randomMins
      });
      setIsVisible(true);

      // Hide after 5 seconds
      setTimeout(() => {
        setIsVisible(false);
      }, 5000);
    }, 14000); // every 14 seconds

    return () => clearInterval(interval);
  }, [products]);

  if (!currentAlert || !isVisible) return null;

  return (
    <div
      className="animate-slide-right"
      style={{
        position: 'fixed',
        bottom: '88px',
        left: '20px',
        zIndex: 8000,
        background: 'var(--bg-secondary)',
        border: '1px solid rgba(99, 102, 241, 0.4)',
        borderRadius: 'var(--radius-lg)',
        padding: '0.75rem 1rem',
        boxShadow: '0 12px 30px rgba(0,0,0,0.45)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.85rem',
        maxWidth: '360px',
        cursor: 'pointer',
        backdropFilter: 'blur(16px)'
      }}
      onClick={() => setQuickViewProduct(currentAlert.product)}
    >
      {/* Product Thumbnail */}
      <img
        src={Array.isArray(currentAlert.product.images) ? currentAlert.product.images[0] : currentAlert.product.image}
        alt=""
        style={{ width: '46px', height: '46px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border-color)', flexShrink: 0 }}
      />

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.72rem', color: '#10b981', fontWeight: 800 }}>
          <CheckCircle size={12} />
          <span>{currentAlert.buyer} ({currentAlert.location})</span>
        </div>
        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '1px' }}>
          {language === 'km' ? 'ទើបតែកុម្ម៉ង់ទិញ' : 'Just purchased'} {currentAlert.product.name}
        </div>
        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '1px' }}>
          {currentAlert.minsAgo} {language === 'km' ? 'នាទីមុន' : 'mins ago'} • <strong style={{ color: 'var(--accent-primary)' }}>{formatPrice(currentAlert.product.price)}</strong>
        </div>
      </div>

      {/* Close button */}
      <button
        onClick={(e) => { e.stopPropagation(); setIsVisible(false); }}
        style={{ color: 'var(--text-muted)', padding: '2px', cursor: 'pointer' }}
      >
        <X size={14} />
      </button>
    </div>
  );
}
