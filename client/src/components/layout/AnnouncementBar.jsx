import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Truck, Sparkles, MessageCircle, ArrowRight } from 'lucide-react';

export default function AnnouncementBar() {
  const { settings, freeShippingRemaining, cartSubtotal, discountAmount } = useStore();

  const isFreeShipping = (cartSubtotal - discountAmount) >= Number(settings.free_shipping_threshold || 50);

  return (
    <div style={{
      background: 'linear-gradient(90deg, #4f46e5 0%, #7c3aed 50%, #06b6d4 100%)',
      color: '#ffffff',
      fontSize: '0.82rem',
      fontWeight: 600,
      padding: '0.45rem 1rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'relative',
      zIndex: 40,
      boxShadow: '0 2px 10px rgba(0,0,0,0.15)'
    }}>
      <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', flexWrap: 'wrap', gap: '0.5rem' }}>
        
        {/* Announcement Text */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={14} />
          <span>{settings.announcement_text || 'Direct Factory Imports • Best Price Guarantee at SR SHOP'}</span>
        </div>

        {/* Free shipping threshold dynamic indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.78rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(0,0,0,0.2)', padding: '0.2rem 0.65rem', borderRadius: '20px' }}>
            <Truck size={13} />
            {cartSubtotal === 0 ? (
              <span>Free Shipping over {settings.store_currency || '$'}{settings.free_shipping_threshold || 50}</span>
            ) : isFreeShipping ? (
              <span style={{ color: '#86efac', fontWeight: 700 }}>🎉 You qualified for FREE Delivery!</span>
            ) : (
              <span>Add {settings.store_currency || '$'}{freeShippingRemaining.toFixed(2)} more for <strong>FREE Shipping</strong></span>
            )}
          </div>

          {/* Direct Facebook / Social channel badge */}
          {settings.store_facebook && (
            <a
              href={settings.store_facebook}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                color: '#ffffff',
                background: 'rgba(255, 255, 255, 0.15)',
                padding: '0.2rem 0.6rem',
                borderRadius: '12px',
                transition: 'background 0.2s',
                textDecoration: 'none'
              }}
            >
              <span>Visit our Facebook Page</span>
              <ArrowRight size={12} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
