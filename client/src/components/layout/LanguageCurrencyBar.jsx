import React from 'react';
import { useStore } from '../../context/StoreContext';
import { TelegramIcon, FacebookIcon } from '../common/Icons';
import { Globe, DollarSign, Sparkles, Phone, ShieldCheck, Zap } from 'lucide-react';

export default function LanguageCurrencyBar() {
  const { language, toggleLanguage, currency, toggleCurrency, settings, t } = useStore();

  return (
    <div style={{
      background: 'linear-gradient(90deg, #090f1d 0%, #111a33 50%, #090f1d 100%)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '0.35rem 0',
      fontSize: '0.78rem',
      color: 'var(--text-secondary)'
    }}>
      <div className="page-wrapper" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        width: '100%'
      }}>
        {/* Right Side: Language & Currency Switchers */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          
          {/* Currency Switcher */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(255, 255, 255, 0.06)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-color)',
            padding: '2px'
          }}>
            <button
              onClick={() => toggleCurrency('USD')}
              style={{
                padding: '0.15rem 0.55rem',
                borderRadius: '4px',
                fontSize: '0.72rem',
                fontWeight: 700,
                background: currency === 'USD' ? 'var(--accent-primary)' : 'transparent',
                color: currency === 'USD' ? '#ffffff' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
            >
              $ USD
            </button>
            <button
              onClick={() => toggleCurrency('KHR')}
              style={{
                padding: '0.15rem 0.55rem',
                borderRadius: '4px',
                fontSize: '0.72rem',
                fontWeight: 700,
                background: currency === 'KHR' ? 'var(--accent-primary)' : 'transparent',
                color: currency === 'KHR' ? '#ffffff' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
            >
              ៛ KHR
            </button>
          </div>

          {/* Language Switcher */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(255, 255, 255, 0.06)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-color)',
            padding: '2px'
          }}>
            <button
              onClick={() => toggleLanguage('km')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                padding: '0.15rem 0.55rem',
                borderRadius: '4px',
                fontSize: '0.72rem',
                fontWeight: 700,
                background: language === 'km' ? 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)' : 'transparent',
                color: language === 'km' ? '#ffffff' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
            >
              <span>🇰🇭</span>
              <span>ខ្មែរ</span>
            </button>
            <button
              onClick={() => toggleLanguage('en')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                padding: '0.15rem 0.55rem',
                borderRadius: '4px',
                fontSize: '0.72rem',
                fontWeight: 700,
                background: language === 'en' ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' : 'transparent',
                color: language === 'en' ? '#ffffff' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
            >
              <span>🇺🇸</span>
              <span>ENG</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
