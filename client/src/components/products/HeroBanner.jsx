import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { FacebookIcon, MessengerIcon, TelegramIcon } from '../common/Icons';
import TelegramQRModal from '../common/TelegramQRModal';
import { Sparkles, ShoppingBag, ArrowRight, ShieldCheck, Zap, Phone, MapPin, QrCode } from 'lucide-react';

export default function HeroBanner() {
  const { settings } = useStore();
  const [isTelegramModalOpen, setIsTelegramModalOpen] = useState(false);

  return (
    <div style={{ position: 'relative', marginTop: '1.25rem', marginBottom: '2rem' }}>
      <div className="page-wrapper">
        
        {/* Official Store Banner Showcase Card */}
        <div style={{
          position: 'relative',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          border: '1px solid var(--border-color)',
          background: 'linear-gradient(135deg, #091224 0%, #111d38 100%)',
          boxShadow: 'var(--shadow-lg)',
          marginBottom: '1.5rem'
        }}>
          
          {/* Real Banner Image with Responsive Fit */}
          <div style={{ position: 'relative', width: '100%', maxHeight: '340px', overflow: 'hidden' }}>
            <img
              src="/sr-shop-banner.jpg"
              alt="SR SHOP Official Banner"
              style={{
                width: '100%',
                height: '100%',
                maxHeight: '340px',
                objectFit: 'cover',
                display: 'block'
              }}
            />
            
            {/* Ambient Gradient Overlay on Bottom */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(9, 18, 36, 0.95) 0%, rgba(9, 18, 36, 0.2) 60%, transparent 100%)'
            }} />

            {/* Quick Tag Badge */}
            <div style={{
              position: 'absolute',
              top: '16px',
              left: '16px',
              background: 'rgba(15, 23, 42, 0.85)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#ffffff',
              padding: '0.4rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.75rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}>
              <Zap size={14} color="#f59e0b" />
              <span>OFFICIAL STORE • {settings.store_name || 'SR SHOP'}</span>
            </div>
          </div>

          {/* Banner Store Highlights Bar */}
          <div style={{
            padding: '1.25rem 1.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.25rem',
            background: 'var(--bg-secondary)',
            borderTop: '1px solid var(--border-color)'
          }}>
            
            {/* Address & Hotline */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.86rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                <MapPin size={16} color="var(--accent-primary)" style={{ flexShrink: 0 }} />
                <span>{settings.store_address || 'បុរីពិភពថ្មីកំបូល 3, រាជធានីភ្នំពេញ'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <Phone size={15} color="var(--success)" style={{ flexShrink: 0 }} />
                <span>Hotline: <strong style={{ color: 'var(--text-primary)' }}>{settings.store_phone || '098 33 47 55'}</strong></span>
              </div>
            </div>

            {/* Quick Action CTAs */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              
              {/* Telegram @SIYEANLONG Button */}
              <button
                onClick={() => setIsTelegramModalOpen(true)}
                className="btn-secondary btn-sm"
                style={{
                  background: 'rgba(34, 158, 217, 0.12)',
                  borderColor: 'rgba(34, 158, 217, 0.35)',
                  color: '#229ED9',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem'
                }}
              >
                <TelegramIcon size={16} />
                <span>Telegram: @SIYEANLONG</span>
                <QrCode size={14} />
              </button>

              {/* Facebook Page Button */}
              {settings.store_facebook && (
                <a
                  href={settings.store_facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-facebook btn-sm"
                >
                  <FacebookIcon size={15} />
                  <span>Facebook Page</span>
                </a>
              )}

              {/* Shop All Items Button */}
              <button
                onClick={() => {
                  const el = document.getElementById('catalog-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="btn-primary btn-sm"
              >
                <ShoppingBag size={15} />
                <span>Shop All Items</span>
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* Telegram QR Modal */}
      <TelegramQRModal
        isOpen={isTelegramModalOpen}
        onClose={() => setIsTelegramModalOpen(false)}
      />
    </div>
  );
}
