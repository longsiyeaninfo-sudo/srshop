import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ShoppingBag, Eye, Heart, Star, Sparkles, Scale } from 'lucide-react';

export default function ProductCard({ product }) {
  const {
    addToCart,
    toggleWishlist,
    isInWishlist,
    setQuickViewProduct,
    toggleCompare,
    comparedProducts,
    formatPrice,
    t
  } = useStore();

  const isFavorited = isInWishlist(product.id);
  const isCompared = comparedProducts.some(p => p.id === product.id);

  const images = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : ['https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800'];

  const discountPercent = product.compare_at_price && product.compare_at_price > product.price
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : 0;

  return (
    <div
      className="glass-panel"
      style={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        transition: 'transform var(--transition-normal), box-shadow var(--transition-normal), border-color var(--transition-normal)',
        position: 'relative'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.borderColor = 'var(--accent-primary)';
        e.currentTarget.style.boxShadow = 'var(--shadow-glow)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'var(--border-color)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Product Image Area */}
      <div
        onClick={() => setQuickViewProduct(product)}
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '1 / 1',
          overflow: 'hidden',
          cursor: 'pointer',
          background: 'rgba(0,0,0,0.1)'
        }}
      >
        <img
          src={images[0]}
          alt={product.name}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.06)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        />

        {/* Badges */}
        <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {discountPercent > 0 && (
            <span className="badge badge-sale">-{discountPercent}%</span>
          )}
          {product.badge && (
            <span className="badge badge-trending">{product.badge}</span>
          )}
        </div>

        {/* Wishlist & Compare Icons */}
        <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <button
            onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'rgba(15, 23, 42, 0.75)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: isFavorited ? '#ec4899' : '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
            title="Wishlist"
          >
            <Heart size={15} fill={isFavorited ? '#ec4899' : 'none'} />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); toggleCompare(product); }}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: isCompared ? 'var(--accent-primary)' : 'rgba(15, 23, 42, 0.75)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
            title="Compare Specs"
          >
            <Scale size={14} />
          </button>
        </div>
      </div>

      {/* Card Body */}
      <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
        <div>
          {/* Category & Rating */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--accent-primary)', fontWeight: 700, textTransform: 'uppercase' }}>
              {product.category_name || 'Import Essentials'}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.75rem', color: '#f59e0b', fontWeight: 700 }}>
              <Star size={12} fill="#f59e0b" />
              <span>{Number(product.rating || 5).toFixed(1)}</span>
            </div>
          </div>

          {/* Title */}
          <h3
            onClick={() => setQuickViewProduct(product)}
            style={{
              fontSize: '0.92rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              lineHeight: 1.35,
              marginBottom: '0.45rem',
              cursor: 'pointer',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {product.name}
          </h3>

          {/* Price & Savings */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.45rem', marginBottom: '0.85rem' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-primary)' }}>
              {formatPrice(product.price)}
            </span>
            {product.compare_at_price && product.compare_at_price > product.price && (
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                {formatPrice(product.compare_at_price)}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.5rem' }}>
          <button
            onClick={() => addToCart(product)}
            className="btn-primary"
            style={{ padding: '0.55rem', fontSize: '0.84rem' }}
          >
            <ShoppingBag size={15} />
            <span>{t('add_to_bag')}</span>
          </button>

          <button
            onClick={() => setQuickViewProduct(product)}
            className="btn-icon"
            style={{ width: '38px', height: '38px' }}
            title={t('quick_view')}
          >
            <Eye size={16} />
          </button>
        </div>

      </div>

    </div>
  );
}
