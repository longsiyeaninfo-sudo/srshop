import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  PackageCheck,
  Search,
  CheckCircle2,
  Clock,
  Truck,
  MapPin,
  Printer,
  ShoppingBag,
  ExternalLink,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';

export default function OrderTracking() {
  const { activeTrackingNumber, setActiveTrackingNumber, setCurrentView, showToast, formatPrice, recentOrders } = useStore();
  const [orderQuery, setOrderQuery] = useState(activeTrackingNumber || 'SR-98421');
  const [trackedOrder, setTrackedOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchTracking = async (queryNum) => {
    if (!queryNum || !queryNum.trim()) return;
    setIsLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch(`/api/orders/track/${encodeURIComponent(queryNum.trim())}`);
      const data = await res.json();
      if (data.success && data.order) {
        setTrackedOrder(data.order);
      } else {
        setErrorMsg(data.message || 'Order not found. Check your order number and try again.');
        setTrackedOrder(null);
      }
    } catch (err) {
      setErrorMsg('Failed to fetch tracking data');
      setTrackedOrder(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const target = activeTrackingNumber || orderQuery || 'SR-98421';
    setOrderQuery(target);
    fetchTracking(target);
  }, [activeTrackingNumber]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchTracking(orderQuery);
  };

  return (
    <div className="page-wrapper" style={{ padding: '3rem 1.5rem', maxWidth: '850px', margin: '0 auto' }}>
      
      {/* Search Bar Header */}
      <div className="no-print" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-primary)', padding: '0.4rem 1rem', borderRadius: 'var(--radius-full)', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.75rem' }}>
          <PackageCheck size={16} />
          <span>Real-time Parcel Tracking</span>
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.5rem' }}>Track Your Delivery</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', maxWidth: '480px', margin: '0 auto 1.5rem' }}>
          Enter your <strong>SR SHOP Order Number</strong> (e.g. <code>SR-98421</code>) or carrier tracking number to view real-time delivery status.
        </p>

        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.65rem', maxWidth: '520px', margin: '0 auto' }}>
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '0.65rem 1rem'
          }}>
            <Search size={18} color="var(--text-muted)" style={{ marginRight: '0.65rem' }} />
            <input
              type="text"
              placeholder="e.g. SR-98421 or SR-TRK-8492039401"
              value={orderQuery}
              onChange={(e) => setOrderQuery(e.target.value)}
              style={{ background: 'none', border: 'none', outline: 'none', color: 'var(--text-primary)', width: '100%', fontSize: '0.9rem' }}
            />
          </div>
          <button type="submit" disabled={isLoading} className="btn-primary">
            <span>{isLoading ? 'Tracking...' : 'Track'}</span>
          </button>
        </form>

        {/* Quick Sample Order Pills */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1.25rem' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Quick Select Order:</span>
          {Array.from(new Set(['SR-98421', 'SR-98422', 'SR-98423', ...(recentOrders || []).map(o => o.order_number)])).slice(0, 6).map(num => (
            <button
              key={num}
              type="button"
              onClick={() => {
                setOrderQuery(num);
                fetchTracking(num);
              }}
              style={{
                fontSize: '0.76rem',
                fontWeight: 700,
                padding: '0.3rem 0.75rem',
                borderRadius: 'var(--radius-full)',
                background: orderQuery === num ? 'var(--accent-primary)' : 'rgba(255,255,255,0.06)',
                color: orderQuery === num ? '#ffffff' : 'var(--text-secondary)',
                border: `1px solid ${orderQuery === num ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
            >
              #{num}
            </button>
          ))}
        </div>

        {errorMsg && (
          <div style={{ marginTop: '1rem', color: 'var(--danger)', fontSize: '0.85rem', fontWeight: 600 }}>
            {errorMsg}
          </div>
        )}
      </div>

      {/* Tracked Order Details */}
      {trackedOrder && (
        <div id="printable-receipt" className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-lg)' }}>
          
          {/* Top Status Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Order Number</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--accent-primary)', marginTop: '2px' }}>
                #{trackedOrder.order_number}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Placed on {new Date(trackedOrder.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.4rem 0.85rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.85rem',
                fontWeight: 800,
                background: trackedOrder.status === 'Delivered' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(99, 102, 241, 0.2)',
                color: trackedOrder.status === 'Delivered' ? 'var(--success)' : 'var(--accent-primary)',
                border: `1px solid ${trackedOrder.status === 'Delivered' ? 'rgba(16, 185, 129, 0.4)' : 'rgba(99, 102, 241, 0.4)'}`
              }}>
                <Clock size={14} />
                <span>Status: {trackedOrder.status}</span>
              </div>

              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                Carrier: <strong>{trackedOrder.tracking_carrier}</strong> ({trackedOrder.tracking_number})
              </div>
            </div>
          </div>

          {/* Timeline Stages */}
          <div style={{ marginBottom: '2.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Delivery Progress</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', position: 'relative', paddingLeft: '1rem' }}>
              
              {/* Connecting line */}
              <div style={{
                position: 'absolute',
                top: '12px',
                bottom: '12px',
                left: '23px',
                width: '2px',
                background: 'var(--border-color)',
                zIndex: 1
              }} />

              {trackedOrder.timeline?.map((stage, idx) => (
                <div key={stage.key} style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem', position: 'relative', zIndex: 2 }}>
                  <div style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    background: stage.completed ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                    border: `2px solid ${stage.completed ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow: stage.completed ? '0 0 12px rgba(99, 102, 241, 0.4)' : 'none'
                  }}>
                    {stage.completed ? <CheckCircle2 size={15} /> : <span style={{ fontSize: '0.7rem' }}>{idx + 1}</span>}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.92rem', fontWeight: stage.completed ? 700 : 500, color: stage.completed ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                      {stage.label}
                    </div>
                    {stage.timestamp && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {stage.timestamp}
                      </div>
                    )}
                  </div>
                </div>
              ))}

            </div>
          </div>

          {/* Destination & Order Items */}
          <div style={{ background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-md)', padding: '1.25rem', border: '1px solid var(--border-color)', marginBottom: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
              <MapPin size={16} color="var(--accent-primary)" />
              <span>Destination: {trackedOrder.customer_name} ({trackedOrder.shipping_address}, {trackedOrder.city})</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
              {trackedOrder.items?.map(it => (
                <div key={it.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <img src={it.product_image} alt="" style={{ width: '38px', height: '38px', objectFit: 'cover', borderRadius: '6px' }} />
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{it.product_name}</div>
                      {it.variant_info && <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{it.variant_info}</div>}
                    </div>
                  </div>
                  <div style={{ fontWeight: 700 }}>
                    Qty: {it.quantity} • {formatPrice(it.total_price)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons (Hidden during Print) */}
          <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
            <button
              onClick={() => window.print()}
              className="btn-secondary btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.55rem 1rem' }}
            >
              <Printer size={14} />
              <span>Print Invoice Receipt</span>
            </button>

            <button
              onClick={() => setCurrentView('shop')}
              className="btn-primary btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.55rem 1rem' }}
            >
              <ShoppingBag size={14} />
              <span>Continue Shopping</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
