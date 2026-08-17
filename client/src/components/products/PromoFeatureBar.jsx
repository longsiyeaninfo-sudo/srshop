import React from 'react';
import { Truck, ShieldCheck, Zap, Headphones, Sparkles, Award, MapPin } from 'lucide-react';
import { TelegramIcon } from '../common/Icons';

export default function PromoFeatureBar({ onOpenTelegram }) {
  const features = [
    {
      icon: <Zap size={22} color="#818cf8" />,
      title: 'Direct Factory Sourcing',
      desc: 'Sourced directly from top manufacturers',
      bg: 'rgba(99, 102, 241, 0.1)',
      border: 'rgba(99, 102, 241, 0.25)'
    },
    {
      icon: <ShieldCheck size={22} color="#10b981" />,
      title: '100% Quality Tested',
      desc: 'Pre-inspected before local dispatch',
      bg: 'rgba(16, 185, 129, 0.1)',
      border: 'rgba(16, 185, 129, 0.25)'
    },
    {
      icon: <Truck size={22} color="#f59e0b" />,
      title: 'Fast Nationwide Delivery',
      desc: 'Phnom Penh & all 25 provinces',
      bg: 'rgba(245, 158, 11, 0.1)',
      border: 'rgba(245, 158, 11, 0.25)'
    },
    {
      icon: <TelegramIcon size={22} color="#229ED9" />,
      title: 'Telegram: @SIYEANLONG',
      desc: '1-on-1 chat & instant KHQR orders',
      bg: 'rgba(34, 158, 217, 0.1)',
      border: 'rgba(34, 158, 217, 0.25)',
      onClick: () => window.open('https://t.me/SIYEANLONG', '_blank', 'noopener,noreferrer')
    }
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: '1rem',
      marginBottom: '2rem'
    }}>
      {features.map((f, idx) => (
        <div
          key={idx}
          onClick={f.onClick}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '1rem 1.25rem',
            borderRadius: 'var(--radius-lg)',
            background: f.bg,
            border: `1px solid ${f.border}`,
            cursor: f.onClick ? 'pointer' : 'default',
            transition: 'transform 0.2s, box-shadow 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = 'var(--shadow-md)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'var(--bg-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: 'var(--shadow-sm)'
          }}>
            {f.icon}
          </div>
          <div>
            <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-primary)' }}>{f.title}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{f.desc}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
