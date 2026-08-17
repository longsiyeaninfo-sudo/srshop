import React, { useState } from 'react';
import { TelegramIcon, MessengerIcon, FacebookIcon } from './Icons';
import TelegramQRModal from './TelegramQRModal';
import { MessageCircle, Phone, Sparkles, X, ChevronUp } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export default function FloatingContactDock() {
  const { settings } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isTelegramModalOpen, setIsTelegramModalOpen] = useState(false);

  return (
    <>
      {/* Floating Action Button & Menu */}
      <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9000, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.75rem' }}>
        
        {/* Expanded Quick Options: Clean Icon-Only Triggers */}
        {isOpen && (
          <div className="animate-fade-in" style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: '30px',
            padding: '0.45rem 0.55rem',
            boxShadow: '0 12px 35px rgba(0,0,0,0.45)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.55rem',
            backdropFilter: 'blur(12px)'
          }}>
            {/* Telegram @SIYEANLONG Icon Button */}
            <a
              href="https://t.me/SIYEANLONG"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: 'rgba(34, 158, 217, 0.15)',
                border: '1px solid rgba(34, 158, 217, 0.4)',
                color: '#229ED9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: '0 4px 12px rgba(34, 158, 217, 0.2)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px) scale(1.08)';
                e.currentTarget.style.background = '#229ED9';
                e.currentTarget.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.background = 'rgba(34, 158, 217, 0.15)';
                e.currentTarget.style.color = '#229ED9';
              }}
              title="Chat on Telegram (@SIYEANLONG)"
            >
              <TelegramIcon size={22} />
            </a>

            {/* Facebook Messenger Icon Button */}
            <a
              href={settings.store_messenger || 'https://m.me/SRonlines.shop'}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: 'rgba(0, 132, 255, 0.15)',
                border: '1px solid rgba(0, 132, 255, 0.4)',
                color: '#0084ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: '0 4px 12px rgba(0, 132, 255, 0.2)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px) scale(1.08)';
                e.currentTarget.style.background = '#0084ff';
                e.currentTarget.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.background = 'rgba(0, 132, 255, 0.15)';
                e.currentTarget.style.color = '#0084ff';
              }}
              title="Open Facebook Messenger"
            >
              <MessengerIcon size={22} />
            </a>

            {/* Direct Phone Call Icon Button */}
            <a
              href={`tel:${settings.store_phone || '098334755'}`}
              onClick={() => setIsOpen(false)}
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                color: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px) scale(1.08)';
                e.currentTarget.style.background = '#10b981';
                e.currentTarget.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.background = 'rgba(16, 185, 129, 0.15)';
                e.currentTarget.style.color = '#10b981';
              }}
              title={`Call Hotline: ${settings.store_phone || '098 33 47 55'}`}
            >
              <Phone size={20} />
            </a>
          </div>
        )}

        {/* Main Floating Trigger Button */}
        <button
          onClick={() => setIsOpen(prev => !prev)}
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #6366f1 0%, #229ED9 100%)',
            color: '#ffffff',
            boxShadow: '0 8px 25px rgba(99, 102, 241, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          title="Contact SR SHOP on Telegram / Messenger"
        >
          {isOpen ? <X size={24} /> : <MessageCircle size={26} />}
        </button>

      </div>

      {/* Telegram QR Modal */}
      <TelegramQRModal
        isOpen={isTelegramModalOpen}
        onClose={() => setIsTelegramModalOpen(false)}
      />
    </>
  );
}
