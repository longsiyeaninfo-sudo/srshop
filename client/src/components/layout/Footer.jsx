import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { FacebookIcon, MessengerIcon, TelegramIcon } from '../common/Icons';
import TelegramQRModal from '../common/TelegramQRModal';
import {
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  ArrowRight,
  Sparkles,
  QrCode
} from 'lucide-react';

export default function Footer() {
  const { settings, setSelectedCategory, setCurrentView, showToast } = useStore();
  const [emailInput, setEmailInput] = useState('');
  const [isTelegramModalOpen, setIsTelegramModalOpen] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    showToast('🎉 Thank you for subscribing to SR SHOP VIP insider deals!', 'success');
    setEmailInput('');
  };

  return (
    <footer style={{
      background: 'var(--bg-secondary)',
      borderTop: '1px solid var(--border-color)',
      marginTop: '4rem',
      paddingTop: '3.5rem',
      paddingBottom: '2rem',
      color: 'var(--text-secondary)'
    }}>
      <div className="page-wrapper">
        
        {/* Value Propositions / Trust Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.5rem',
          paddingBottom: '2.5rem',
          borderBottom: '1px solid var(--border-color)',
          marginBottom: '3rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
            <div style={{ padding: '0.75rem', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-primary)' }}>
              <Truck size={24} />
            </div>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>Direct Factory Sourcing</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Wholesale pricing on high demand trending goods.</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
            <div style={{ padding: '0.75rem', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)' }}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>Quality Inspected</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Every unit pre-tested prior to dispatch.</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
            <div style={{ padding: '0.75rem', borderRadius: '12px', background: 'rgba(236, 72, 153, 0.1)', color: '#ec4899' }}>
              <RotateCcw size={24} />
            </div>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>30-Day Guarantee</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Hassle-free replacement or full refund.</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
            <div style={{ padding: '0.75rem', borderRadius: '12px', background: 'rgba(34, 158, 217, 0.1)', color: '#229ED9' }}>
              <Headphones size={24} />
            </div>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>Telegram & Facebook Support</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Chat directly on Telegram @SIYEANLONG.</div>
            </div>
          </div>
        </div>

        {/* Main Footer Columns */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '2.5rem',
          marginBottom: '3rem'
        }}>
          
          {/* Brand & Address Column */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              {settings.store_logo_url ? (
                <img
                  src={settings.store_logo_url}
                  alt={settings.store_name || 'SR SHOP'}
                  style={{ height: '36px', maxWidth: '120px', objectFit: 'contain' }}
                />
              ) : (
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: 900,
                  fontSize: '1rem'
                }}>
                  SR
                </div>
              )}
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>{settings.store_name || 'SR SHOP'}</span>
            </div>
            
            <p style={{ fontSize: '0.86rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              {settings.store_tagline || 'Direct Imported Quality Products & Trending Essentials sourced from top manufacturers.'}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.84rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <MapPin size={16} color="var(--accent-primary)" style={{ marginTop: '2px', flexShrink: 0 }} />
                <span>{settings.store_address || 'បុរីពិភពថ្មីកំបូល 3, រាជធានីភ្នំពេញ'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={16} color="var(--success)" style={{ flexShrink: 0 }} />
                <span>Hotline: <strong>{settings.store_phone || '098 33 47 55'}</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={16} color="var(--accent-primary)" style={{ flexShrink: 0 }} />
                <span>{settings.store_email || 'contact@srmacshop.com'}</span>
              </div>
            </div>

            {/* Social Links */}
            <div style={{ display: 'flex', gap: '0.65rem', marginTop: '1.25rem' }}>
              {/* Telegram Button */}
              <a
                href="https://t.me/SIYEANLONG"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-icon"
                style={{ background: 'rgba(34, 158, 217, 0.2)', color: '#229ED9', borderColor: 'rgba(34, 158, 217, 0.4)' }}
                title="Telegram @SIYEANLONG"
              >
                <TelegramIcon size={18} />
              </a>

              {settings.store_facebook && (
                <a
                  href={settings.store_facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-icon"
                  style={{ background: 'rgba(24, 119, 242, 0.2)', color: '#1877f2', borderColor: 'rgba(24, 119, 242, 0.4)' }}
                  title="SR SHOP Facebook Page"
                >
                  <FacebookIcon size={18} />
                </a>
              )}

              {settings.store_messenger && (
                <a
                  href={settings.store_messenger}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-icon"
                  style={{ background: 'rgba(0, 132, 255, 0.2)', color: '#0084ff', borderColor: 'rgba(0, 132, 255, 0.4)' }}
                  title="Direct Chat on Messenger"
                >
                  <MessengerIcon size={18} />
                </a>
              )}
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: '1.2rem', fontSize: '1rem' }}>Product Categories</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.7rem', fontSize: '0.88rem' }}>
              <li onClick={() => { setSelectedCategory('auto-accessories'); setCurrentView('shop'); }} style={{ cursor: 'pointer', transition: 'color 0.2s' }}>
                🚗 Car Jump Starters & Pumps
              </li>
              <li onClick={() => { setSelectedCategory('hardware-tools'); setCurrentView('shop'); }} style={{ cursor: 'pointer', transition: 'color 0.2s' }}>
                🛠️ Hardware Tool Kits
              </li>
              <li onClick={() => { setSelectedCategory('smart-electronics'); setCurrentView('shop'); }} style={{ cursor: 'pointer', transition: 'color 0.2s' }}>
                ⚡ GPS Trackers & Fast Chargers
              </li>
              <li onClick={() => { setSelectedCategory('home-lifestyle'); setCurrentView('shop'); }} style={{ cursor: 'pointer', transition: 'color 0.2s' }}>
                ✨ Home & Hair Styling Gadgets
              </li>
              <li onClick={() => { setSelectedCategory('all'); setCurrentView('shop'); }} style={{ cursor: 'pointer', color: 'var(--accent-primary)', fontWeight: 600 }}>
                View All Catalog →
              </li>
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: '1.2rem', fontSize: '1rem' }}>Customer Care</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.7rem', fontSize: '0.88rem' }}>
              <li onClick={() => setCurrentView('tracking')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                📦 Track My Order
              </li>
              <li>
                <a
                  href="https://t.me/SIYEANLONG"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#229ED9', fontWeight: 600 }}
                >
                  <TelegramIcon size={15} />
                  <span>Telegram: @SIYEANLONG</span>
                </a>
              </li>
              <li onClick={() => showToast('Fast dispatch across all provinces in Cambodia.', 'info')} style={{ cursor: 'pointer' }}>
                🚚 Delivery via J&T / Virak Buntham
              </li>
              <li onClick={() => setCurrentView('admin')} style={{ cursor: 'pointer', color: 'var(--accent-primary)' }}>
                ⚙️ Store Owner Portal
              </li>
            </ul>
          </div>

          {/* Newsletter Subscribe */}
          <div>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.75rem', fontSize: '1rem' }}>VIP Deals</h4>
            <p style={{ fontSize: '0.84rem', lineHeight: 1.5, marginBottom: '1rem' }}>
              Get instant alerts for new factory shipments, secret flash sales & coupon codes.
            </p>
            <form onSubmit={handleSubscribe} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Enter your email..."
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  padding: '0.65rem 0.9rem',
                  borderRadius: 'var(--radius-md)',
                  outline: 'none',
                  fontSize: '0.85rem'
                }}
              />
              <button type="submit" className="btn-primary" style={{ padding: '0.65rem 1rem', fontSize: '0.85rem' }}>
                <span>Get VIP Discounts</span>
                <ArrowRight size={14} />
              </button>
            </form>
          </div>

        </div>

        {/* Bottom copyright */}
        <div style={{
          borderTop: '1px solid var(--border-color)',
          paddingTop: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.8rem',
          color: 'var(--text-muted)'
        }}>
          <div>
            © {new Date().getFullYear()} <strong>{settings.store_name || 'SR SHOP'}</strong>. All rights reserved. Direct Factory Import Platform.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Supplier Verification</span>
          </div>
        </div>

      </div>

      <TelegramQRModal
        isOpen={isTelegramModalOpen}
        onClose={() => setIsTelegramModalOpen(false)}
      />
    </footer>
  );
}
