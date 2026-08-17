import React from 'react';
import { X, ExternalLink, Send, MessageCircle } from 'lucide-react';
import { TelegramIcon } from './Icons';

export default function TelegramQRModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 10000 }}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '380px',
          textAlign: 'center',
          padding: '2rem',
          borderRadius: 'var(--radius-xl)',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '14px',
            right: '14px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: 'none',
            color: 'var(--text-primary)',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <X size={18} />
        </button>

        <div style={{
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #229ED9 0%, #0088cc 100%)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1rem',
          boxShadow: '0 8px 20px rgba(34, 158, 217, 0.35)'
        }}>
          <TelegramIcon size={26} />
        </div>

        <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.35rem', color: 'var(--text-primary)' }}>
          Chat on Telegram
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
          Scan the QR Code with your phone camera or click to chat directly with <strong>@SIYEANLONG</strong>
        </p>

        {/* Telegram QR Image */}
        <div style={{
          background: '#ffffff',
          padding: '0.85rem',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          display: 'inline-block',
          marginBottom: '1.25rem',
          maxWidth: '220px',
          border: '2px solid #229ED9'
        }}>
          <img
            src="/telegram-qr.png"
            alt="Telegram @SIYEANLONG QR Code"
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
              borderRadius: '8px'
            }}
          />
        </div>

        <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#229ED9', marginBottom: '1.25rem' }}>
          @SIYEANLONG
        </div>

        {/* Open Direct Chat Button */}
        <a
          href="https://t.me/SIYEANLONG"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary"
          style={{
            width: '100%',
            padding: '0.75rem',
            background: 'linear-gradient(135deg, #229ED9 0%, #0088cc 100%)',
            boxShadow: '0 4px 15px rgba(34, 158, 217, 0.4)',
            fontSize: '0.92rem'
          }}
        >
          <Send size={16} />
          <span>Open Telegram Chat</span>
          <ExternalLink size={14} />
        </a>
      </div>
    </div>
  );
}
