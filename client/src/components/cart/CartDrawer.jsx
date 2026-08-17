import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  Tag,
  Truck,
  ShieldCheck
} from 'lucide-react';

export default function CartDrawer() {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    updateCartQty,
    removeFromCart,
    cartSubtotal,
    cartTotalItems,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    freeShippingThreshold,
    setCurrentView,
    settings,
    formatPrice
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  if (!isCartOpen) return null;

  const discountAmount = appliedCoupon ? Number(appliedCoupon.discount_amount || 0) : 0;
  const freeThreshold = Number(freeShippingThreshold) || 30;
  const netSubtotal = Math.max(0, cartSubtotal - discountAmount);
  const isFreeShipping = netSubtotal >= freeThreshold;
  const freeShippingRemaining = Math.max(0, freeThreshold - netSubtotal);
  const progressPercent = Math.min(100, Math.max(0, (netSubtotal / freeThreshold) * 100));
  const estimatedTax = Number((netSubtotal * 0.07).toFixed(2));
  const totalWithTax = netSubtotal + estimatedTax;

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setIsApplyingCoupon(true);
    await applyCoupon(couponInput.trim());
    setIsApplyingCoupon(false);
  };

  const handleGoToCheckout = () => {
    setIsCartOpen(false);
    setCurrentView('checkout');
  };

  return (
    <div className="modal-overlay" onClick={() => setIsCartOpen(false)} style={{ justifyContent: 'flex-end', padding: 0 }}>
      <div
        className="animate-slide-right"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '440px',
          height: '100vh',
          background: 'var(--bg-secondary)',
          borderLeft: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-lg)',
          position: 'relative',
          zIndex: 1000
        }}
      >
        {/* Drawer Header */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <ShoppingBag size={20} color="var(--accent-primary)" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Shopping Bag ({cartTotalItems})</h3>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="btn-icon"
            style={{ width: '34px', height: '34px' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Free Shipping Meter */}
        <div style={{ padding: '0.85rem 1.5rem', background: 'rgba(99, 102, 241, 0.08)', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.4rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Truck size={14} color="var(--accent-primary)" />
              {isFreeShipping ? (
                <span style={{ color: 'var(--success)' }}>🎉 Free Express Shipping Unlocked!</span>
              ) : (
                <span>Add <strong>{formatPrice(freeShippingRemaining)}</strong> more for <strong>FREE Shipping</strong></span>
              )}
            </div>
            <span>{Math.round(progressPercent)}%</span>
          </div>

          <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{
              width: `${progressPercent}%`,
              height: '100%',
              background: 'var(--accent-gradient)',
              transition: 'width 0.4s ease'
            }} />
          </div>
        </div>

        {/* Items List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', margin: 'auto', padding: '2rem 1rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🛍️</div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Your shopping bag is empty</h4>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>Explore our direct factory import arrivals and save up to 50%!</p>
              <button onClick={() => setIsCartOpen(false)} className="btn-primary btn-sm">
                <span>Start Shopping</span>
              </button>
            </div>
          ) : (
            cart.map((item, idx) => (
              <div
                key={item.cartKey || item.id || idx}
                style={{
                  display: 'flex',
                  gap: '0.9rem',
                  padding: '0.85rem',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)'
                }}
              >
                <img
                  src={item.image || 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=200'}
                  alt={item.name}
                  style={{ width: '68px', height: '68px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                />

                <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '190px' }}>
                        {item.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.cartKey)}
                        style={{ color: 'var(--text-muted)', padding: '2px', cursor: 'pointer' }}
                        title="Remove item"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    {item.variant && (
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        {item.variant}
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                    {/* Stepper */}
                    <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                      <button
                        onClick={() => updateCartQty(item.cartKey, item.quantity - 1)}
                        style={{ padding: '0.2rem 0.45rem', color: 'var(--text-primary)', cursor: 'pointer' }}
                      >
                        <Minus size={12} />
                      </button>
                      <span style={{ minWidth: '24px', textAlign: 'center', fontSize: '0.8rem', fontWeight: 700 }}>{item.quantity}</span>
                      <button
                        onClick={() => updateCartQty(item.cartKey, item.quantity + 1)}
                        style={{ padding: '0.2rem 0.45rem', color: 'var(--text-primary)', cursor: 'pointer' }}
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Promo Coupon & Checkout Footer */}
        {cart.length > 0 && (
          <div style={{ padding: '1.25rem 1.5rem', background: 'var(--bg-card)', borderTop: '1px solid var(--border-color)' }}>
            
            {/* Coupon Code Section */}
            {appliedCoupon ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '0.45rem 0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', fontSize: '0.8rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--success)', fontWeight: 700 }}>
                  <Tag size={14} />
                  <span>Coupon "{appliedCoupon.code}" applied (-{formatPrice(discountAmount)})</span>
                </div>
                <button onClick={removeCoupon} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>
                  <X size={14} />
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <input
                  type="text"
                  placeholder="Promo code (e.g. SRSHOP10)"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  style={{
                    flex: 1,
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.45rem 0.75rem',
                    color: 'var(--text-primary)',
                    outline: 'none',
                    fontSize: '0.82rem'
                  }}
                />
                <button
                  type="submit"
                  disabled={isApplyingCoupon}
                  className="btn-secondary btn-sm"
                  style={{ padding: '0.45rem 0.85rem' }}
                >
                  <span>Apply</span>
                </button>
              </form>
            )}

            {/* Price Calculations */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Subtotal:</span>
                <span>{formatPrice(cartSubtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--success)', fontWeight: 600 }}>
                  <span>Discount:</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Estimated Tax (7%):</span>
                <span>{formatPrice(estimatedTax)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Shipping:</span>
                <span>{isFreeShipping ? <strong style={{ color: 'var(--success)' }}>FREE</strong> : formatPrice(4.99)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', borderTop: '1px solid var(--border-color)', paddingTop: '0.6rem', marginTop: '0.2rem' }}>
                <span>Total:</span>
                <span className="gradient-text">{formatPrice(totalWithTax + (isFreeShipping ? 0 : 4.99))}</span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              onClick={handleGoToCheckout}
              className="btn-primary"
              style={{ width: '100%', padding: '0.85rem', fontSize: '0.95rem' }}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
