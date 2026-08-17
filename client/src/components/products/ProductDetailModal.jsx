import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { FacebookIcon, MessengerIcon, TelegramIcon } from '../common/Icons';
import TelegramQRModal from '../common/TelegramQRModal';
import {
  X,
  Star,
  ShoppingBag,
  Heart,
  Truck,
  ShieldCheck,
  Check,
  Plus,
  Minus,
  RotateCcw,
  Sparkles,
  Share2,
  QrCode
} from 'lucide-react';

export default function ProductDetailModal() {
  const {
    quickViewProduct,
    setQuickViewProduct,
    addToCart,
    toggleWishlist,
    isInWishlist,
    settings,
    showToast
  } = useStore();

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('specs'); // 'specs' or 'reviews'
  const [reviewsList, setReviewsList] = useState([]);
  const [newReview, setNewReview] = useState({ name: '', rating: 5, comment: '' });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [isTelegramModalOpen, setIsTelegramModalOpen] = useState(false);

  useEffect(() => {
    if (quickViewProduct) {
      setActiveImageIdx(0);
      setQuantity(1);
      setActiveTab('specs');

      // Initialize default variants
      const defaults = {};
      if (Array.isArray(quickViewProduct.variants)) {
        quickViewProduct.variants.forEach(v => {
          if (v.options && v.options.length > 0) {
            defaults[v.name] = v.options[0];
          }
        });
      }
      setSelectedVariants(defaults);

      // Fetch reviews and extra details
      fetch(`/api/products/${quickViewProduct.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.reviews) {
            setReviewsList(data.reviews);
          }
        })
        .catch(err => console.error(err));
    }
  }, [quickViewProduct]);

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const isFavorited = isInWishlist(product.id);
  const images = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : ['https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800'];

  const discountPercent = product.compare_at_price && product.compare_at_price > product.price
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : 0;

  const variantString = Object.entries(selectedVariants)
    .map(([k, v]) => `${k}: ${v}`)
    .join(' / ');

  const handleAddToCart = () => {
    addToCart(product, variantString, quantity);
    setQuickViewProduct(null);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newReview.name.trim() || !newReview.comment.trim()) return;

    setIsSubmittingReview(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: product.id,
          user_name: newReview.name,
          rating: newReview.rating,
          comment: newReview.comment
        })
      });
      const data = await res.json();
      if (data.success) {
        setReviewsList(prev => [data.review, ...prev]);
        setNewReview({ name: '', rating: 5, comment: '' });
        showToast('🎉 Review submitted successfully!', 'success');
      }
    } catch (err) {
      showToast('Error submitting review', 'error');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const orderText = encodeURIComponent(`Hello SR SHOP! I want to order "${product.name}" (${variantString || 'Standard'}) - $${product.price}`);
  const facebookOrderUrl = `${settings.store_messenger || 'https://m.me/SRonlines.shop'}?text=${orderText}`;
  const telegramOrderUrl = `https://t.me/SIYEANLONG?text=${orderText}`;

  return (
    <div className="modal-overlay" onClick={() => setQuickViewProduct(null)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '960px' }}>
        
        {/* Close Button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.08)',
            color: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 20
          }}
        >
          <X size={20} />
        </button>

        {/* Modal Layout Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem',
          padding: '2rem'
        }}>
          
          {/* Left Column: Image Gallery */}
          <div>
            {/* Main Active Image */}
            <div style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '1/1',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              background: 'rgba(0,0,0,0.15)',
              border: '1px solid var(--border-color)',
              marginBottom: '1rem'
            }}>
              <img
                src={images[activeImageIdx] || images[0]}
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />

              {product.badge && (
                <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
                  <span className="badge badge-sale">{product.badge}</span>
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: '0.65rem', overflowX: 'auto' }}>
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    style={{
                      width: '68px',
                      height: '68px',
                      borderRadius: 'var(--radius-sm)',
                      overflow: 'hidden',
                      border: `2px solid ${activeImageIdx === idx ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                      cursor: 'pointer',
                      opacity: activeImageIdx === idx ? 1 : 0.6,
                      transition: 'all 0.2s'
                    }}
                  >
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            )}

            {/* Trust guarantees bar */}
            <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={16} color="#10b981" />
                <span>Direct factory imported & quality certified</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Truck size={16} color="var(--accent-primary)" />
                <span>Fast local dispatch with online tracking number</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <RotateCcw size={16} color="#ec4899" />
                <span>30-day replacement & money-back guarantee</span>
              </div>
            </div>
          </div>

          {/* Right Column: Details & Variant Selection */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            
            <div>
              {/* Category & Ratings */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--accent-primary)', fontWeight: 700, textTransform: 'uppercase' }}>
                  {product.category_name || 'Import Essentials'}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', color: '#f59e0b', fontWeight: 700 }}>
                  <Star size={15} fill="#f59e0b" />
                  <span>{Number(product.rating || 5).toFixed(1)}</span>
                  <span style={{ color: 'var(--text-muted)' }}>({product.review_count || 1} reviews)</span>
                </div>
              </div>

              {/* Title */}
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.3, marginBottom: '0.85rem' }}>
                {product.name}
              </h2>

              {/* Price & Savings */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '1.25rem', padding: '0.75rem 1rem', background: 'rgba(255, 255, 255, 0.04)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                  ${Number(product.price).toFixed(2)}
                </span>
                {product.compare_at_price && product.compare_at_price > product.price && (
                  <>
                    <span style={{ fontSize: '1.05rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                      ${Number(product.compare_at_price).toFixed(2)}
                    </span>
                    <span style={{ background: '#10b981', color: '#fff', fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)' }}>
                      SAVE {discountPercent}%
                    </span>
                  </>
                )}
              </div>

              {/* Description */}
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                {product.description || product.short_description}
              </p>

              {/* Variants Selector */}
              {Array.isArray(product.variants) && product.variants.map((variant, vIdx) => (
                <div key={vIdx} style={{ marginBottom: '1.25rem' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Select {variant.name}:</span>
                    <span style={{ color: 'var(--accent-primary)' }}>{selectedVariants[variant.name]}</span>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {variant.options.map((opt, oIdx) => {
                      const isSelected = selectedVariants[variant.name] === opt;
                      return (
                        <button
                          key={oIdx}
                          onClick={() => setSelectedVariants(prev => ({ ...prev, [variant.name]: opt }))}
                          style={{
                            padding: '0.45rem 0.85rem',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.82rem',
                            fontWeight: isSelected ? 700 : 500,
                            background: isSelected ? 'var(--accent-primary)' : 'rgba(255, 255, 255, 0.05)',
                            color: isSelected ? '#ffffff' : 'var(--text-primary)',
                            border: `1px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                            cursor: 'pointer',
                            transition: 'all 0.15s'
                          }}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Quantity & Stock */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>Quantity:</div>
                <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255, 255, 255, 0.06)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    style={{ padding: '0.4rem 0.75rem', color: 'var(--text-primary)', cursor: 'pointer' }}
                  >
                    <Minus size={14} />
                  </button>
                  <span style={{ minWidth: '32px', textAlign: 'center', fontWeight: 700, fontSize: '0.9rem' }}>{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => q + 1)}
                    style={{ padding: '0.4rem 0.75rem', color: 'var(--text-primary)', cursor: 'pointer' }}
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#10b981', fontSize: '0.8rem', fontWeight: 600 }}>
                  <Check size={14} />
                  <span>{product.stock || 45} in stock (Ready to Ship)</span>
                </div>
              </div>
            </div>

            {/* Action CTAs */}
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <button
                  onClick={handleAddToCart}
                  className="btn-primary"
                  style={{ padding: '0.85rem 1.5rem', fontSize: '0.95rem' }}
                >
                  <ShoppingBag size={18} />
                  <span>Add to Shopping Bag • ${(Number(product.price) * quantity).toFixed(2)}</span>
                </button>

                <button
                  onClick={() => toggleWishlist(product)}
                  className="btn-icon"
                  style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)' }}
                  title="Wishlist"
                >
                  <Heart size={20} color={isFavorited ? '#ec4899' : 'currentColor'} fill={isFavorited ? '#ec4899' : 'none'} />
                </button>
              </div>

              {/* Direct Social Order Buttons: Telegram & Facebook */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                <a
                  href={telegramOrderUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: 'linear-gradient(135deg, #229ED9 0%, #0088cc 100%)',
                    color: '#ffffff',
                    fontWeight: 600,
                    padding: '0.7rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.45rem',
                    fontSize: '0.82rem',
                    boxShadow: '0 4px 12px rgba(34, 158, 217, 0.3)'
                  }}
                >
                  <TelegramIcon size={16} />
                  <span>Order via Telegram</span>
                </a>

                <a
                  href={facebookOrderUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-facebook"
                  style={{ padding: '0.7rem 0.85rem', fontSize: '0.82rem' }}
                >
                  <MessengerIcon size={16} />
                  <span>Order via Messenger</span>
                </a>
              </div>
            </div>

          </div>

        </div>

        {/* Tabbed Section: Specs vs Reviews */}
        <div style={{ borderTop: '1px solid var(--border-color)', padding: '1.5rem 2rem' }}>
          
          <div style={{ display: 'flex', gap: '1.5rem', borderBottom: '1px solid var(--border-color)', marginBottom: '1.25rem' }}>
            <button
              onClick={() => setActiveTab('specs')}
              style={{
                paddingBottom: '0.75rem',
                fontSize: '0.9rem',
                fontWeight: 700,
                color: activeTab === 'specs' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                borderBottom: `2px solid ${activeTab === 'specs' ? 'var(--accent-primary)' : 'transparent'}`,
                cursor: 'pointer'
              }}
            >
              Product Specifications
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              style={{
                paddingBottom: '0.75rem',
                fontSize: '0.9rem',
                fontWeight: 700,
                color: activeTab === 'reviews' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                borderBottom: `2px solid ${activeTab === 'reviews' ? 'var(--accent-primary)' : 'transparent'}`,
                cursor: 'pointer'
              }}
            >
              Customer Reviews ({reviewsList.length})
            </button>
          </div>

          {activeTab === 'specs' ? (
            /* Specs Table */
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.85rem' }}>
              {product.specs && Object.entries(product.specs).map(([key, val], idx) => (
                <div key={idx} style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.65rem 0.9rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>{key}</div>
                  <div style={{ fontSize: '0.88rem', color: 'var(--text-primary)', fontWeight: 600, marginTop: '2px' }}>{val}</div>
                </div>
              ))}
            </div>
          ) : (
            /* Reviews List & Submission */
            <div>
              {/* Submit Review Form */}
              <form onSubmit={handleReviewSubmit} style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '0.9rem', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>Write a Verified Review</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px', gap: '0.75rem', marginBottom: '0.6rem' }}>
                  <input
                    type="text"
                    required
                    placeholder="Your Name (e.g. Sarah M.)"
                    value={newReview.name}
                    onChange={(e) => setNewReview(prev => ({ ...prev, name: e.target.value }))}
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '0.5rem 0.8rem', borderRadius: 'var(--radius-sm)', outline: 'none', fontSize: '0.85rem' }}
                  />
                  <select
                    value={newReview.rating}
                    onChange={(e) => setNewReview(prev => ({ ...prev, rating: Number(e.target.value) }))}
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: '#f59e0b', fontWeight: 700, padding: '0.5rem', borderRadius: 'var(--radius-sm)', outline: 'none', fontSize: '0.85rem' }}
                  >
                    <option value={5}>★★★★★ (5)</option>
                    <option value={4}>★★★★☆ (4)</option>
                    <option value={3}>★★★☆☆ (3)</option>
                  </select>
                </div>
                <textarea
                  required
                  rows={2}
                  placeholder="Share your experience with this imported product..."
                  value={newReview.comment}
                  onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                  style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '0.5rem 0.8rem', borderRadius: 'var(--radius-sm)', outline: 'none', fontSize: '0.85rem', marginBottom: '0.6rem' }}
                />
                <button type="submit" disabled={isSubmittingReview} className="btn-primary btn-sm">
                  <span>{isSubmittingReview ? 'Submitting...' : 'Post Review'}</span>
                </button>
              </form>

              {/* Review Items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {reviewsList.length === 0 ? (
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Be the first verified customer to review this product!</div>
                ) : (
                  reviewsList.map(r => (
                    <div key={r.id} style={{ padding: '0.75rem 1rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                        <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)' }}>{r.user_name}</div>
                        <div style={{ display: 'flex', gap: '2px', color: '#f59e0b' }}>
                          {[...Array(r.rating)].map((_, i) => <Star key={i} size={12} fill="#f59e0b" />)}
                        </div>
                      </div>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{r.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

        </div>

      </div>

      <TelegramQRModal
        isOpen={isTelegramModalOpen}
        onClose={() => setIsTelegramModalOpen(false)}
      />
    </div>
  );
}
