import React from 'react';
import { useStore } from '../../context/StoreContext';
import { X, Check, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';

export default function ProductComparisonModal({ isOpen, onClose }) {
  const { comparedProducts, setComparedProducts, addToCart, formatPrice, t, language } = useStore();

  if (!isOpen || comparedProducts.length === 0) return null;

  // Extract all unique spec keys across compared products
  const allSpecKeys = Array.from(
    new Set(
      comparedProducts.flatMap(p => {
        let specsObj = {};
        if (typeof p.specs === 'string') {
          try { specsObj = JSON.parse(p.specs); } catch {}
        } else if (typeof p.specs === 'object' && p.specs !== null) {
          specsObj = p.specs;
        }
        return Object.keys(specsObj);
      })
    )
  );

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 10000 }}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '1050px',
          padding: '2rem',
          borderRadius: 'var(--radius-xl)',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {language === 'km' ? 'ប្រៀបធៀបលក្ខណៈបច្ចេកទេសផលិតផល' : 'Side-by-Side Product Comparison'}
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Comparing {comparedProducts.length} items
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={() => setComparedProducts([])}
              style={{ fontSize: '0.8rem', color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer' }}
            >
              <Trash2 size={14} />
              <span>Clear All</span>
            </button>

            <button
              onClick={onClose}
              style={{
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
          </div>
        </div>

        {/* Comparison Table Grid */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
            <thead>
              <tr>
                <th style={{ padding: '1rem', width: '25%', background: 'rgba(255, 255, 255, 0.02)', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Feature</th>
                {comparedProducts.map(p => (
                  <th key={p.id} style={{ padding: '1rem', width: `${75 / comparedProducts.length}%`, verticalAlign: 'top' }}>
                    <div style={{ position: 'relative' }}>
                      <img
                        src={Array.isArray(p.images) ? p.images[0] : p.image}
                        alt={p.name}
                        style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '10px', marginBottom: '0.75rem', border: '1px solid var(--border-color)' }}
                      />
                      <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>{p.name}</div>
                      <div style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--accent-primary)', marginBottom: '0.75rem' }}>{formatPrice(p.price)}</div>
                      <button
                        onClick={() => { addToCart(p); onClose(); }}
                        className="btn-primary btn-sm"
                        style={{ width: '100%' }}
                      >
                        <ShoppingBag size={14} />
                        <span>{t('add_to_bag')}</span>
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Category */}
              <tr style={{ borderTop: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 700, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Category</td>
                {comparedProducts.map(p => (
                  <td key={p.id} style={{ padding: '0.75rem 1rem', fontSize: '0.85rem' }}>{p.category_name || 'Import Gear'}</td>
                ))}
              </tr>

              {/* Rating */}
              <tr style={{ borderTop: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 700, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Rating</td>
                {comparedProducts.map(p => (
                  <td key={p.id} style={{ padding: '0.75rem 1rem', fontSize: '0.85rem', color: '#f59e0b', fontWeight: 700 }}>
                    ★ {Number(p.rating || 5).toFixed(1)} ({p.review_count || 1} reviews)
                  </td>
                ))}
              </tr>

              {/* Specs Rows */}
              {allSpecKeys.map((key, kIdx) => (
                <tr key={kIdx} style={{ borderTop: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 700, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{key}</td>
                  {comparedProducts.map(p => {
                    let specsObj = {};
                    if (typeof p.specs === 'string') {
                      try { specsObj = JSON.parse(p.specs); } catch {}
                    } else if (typeof p.specs === 'object' && p.specs !== null) {
                      specsObj = p.specs;
                    }
                    const val = specsObj[key] || '—';
                    return (
                      <td key={p.id} style={{ padding: '0.75rem 1rem', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                        {val}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
