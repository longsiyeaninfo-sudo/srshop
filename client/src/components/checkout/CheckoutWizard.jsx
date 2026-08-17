import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { soundFX } from '../../utils/audio';
import {
  CreditCard,
  Truck,
  CheckCircle,
  ShieldCheck,
  QrCode,
  ArrowRight,
  Printer,
  ShoppingBag,
  Sparkles,
  Lock,
  Clock,
  Phone,
  MapPin,
  Barcode
} from 'lucide-react';

export default function CheckoutWizard() {
  const {
    cart,
    cartSubtotal,
    appliedCoupon,
    clearCart,
    setCurrentView,
    settings,
    showToast,
    formatPrice,
    t,
    language,
    currency,
    addRecentOrder,
    setActiveTrackingNumber
  } = useStore();

  const [step, setStep] = useState(1); // 1: Address, 2: Payment, 3: Confirmation
  const [formData, setFormData] = useState({
    name: 'Sokha Meng',
    phone: '098 33 47 55',
    address: 'Borey Piphup Thmey Kamboul 3, St. 05, House 12',
    city: 'Phnom Penh',
    notes: 'Please call before delivery'
  });

  const [shippingMethod, setShippingMethod] = useState('Standard Express (1-2 Days)');
  const [shippingCost, setShippingCost] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('KHQR / ABA Pay & Bakong');
  const [cardData, setCardData] = useState({
    number: '•••• •••• •••• 8829',
    name: 'SOKHA MENG',
    expiry: '08/28',
    cvv: '928'
  });

  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [khqrTimer, setKhqrTimer] = useState(180); // 3 minutes
  const [khqrStatus, setKhqrStatus] = useState('waiting'); // 'waiting', 'scanned', 'verified'
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  // Calculations
  const discountAmount = appliedCoupon ? appliedCoupon.discount_amount : 0;
  const taxableAmount = Math.max(0, cartSubtotal - discountAmount);
  const taxAmount = Number((taxableAmount * 0.07).toFixed(2));
  const finalTotal = Number((taxableAmount + taxAmount + shippingCost).toFixed(2));

  // KHQR Timer countdown
  useEffect(() => {
    let timer;
    if (step === 2 && paymentMethod === 'KHQR / ABA Pay & Bakong' && khqrStatus === 'waiting') {
      timer = setInterval(() => {
        setKhqrTimer(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, paymentMethod, khqrStatus]);

  const handleSimulateScanKHQR = () => {
    setKhqrStatus('scanned');
    soundFX.playPop();
    setTimeout(() => {
      setKhqrStatus('verified');
      soundFX.playSuccess();
      showToast(language === 'km' ? '✅ ទទួលបានការទូទាត់ប្រាក់ជោគជ័យតាម KHQR!' : '✅ KHQR Payment Verified!', 'success');
    }, 1500);
  };

  const handleFinalOrder = async () => {
    setIsProcessingOrder(true);
    try {
      const orderPayload = {
        customer_name: formData.name,
        customer_email: 'customer@srmacshop.com',
        customer_phone: formData.phone,
        shipping_address: formData.address,
        city: formData.city,
        country: 'Cambodia',
        shipping_method: shippingMethod,
        shipping_cost: shippingCost,
        payment_method: paymentMethod,
        coupon_code: appliedCoupon ? appliedCoupon.code : null,
        items: cart.map(item => ({
          product_id: item.product_id,
          product_name: item.name,
          variant_info: item.variant || 'Standard',
          quantity: item.quantity
        }))
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      const data = await res.json();
      if (data.success) {
        setConfirmedOrder(data.order);
        addRecentOrder(data.order);
        soundFX.playSuccess();
        clearCart();
        setStep(3);
        showToast('🎉 Order placed successfully!', 'success');
      } else {
        showToast(data.message || 'Error placing order', 'error');
      }
    } catch (err) {
      showToast('Network error processing order', 'error');
    } finally {
      setIsProcessingOrder(false);
    }
  };

  if (cart.length === 0 && step !== 3) {
    return (
      <div className="page-wrapper" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <div className="glass-panel" style={{ maxWidth: '500px', margin: '0 auto', padding: '3rem 2rem', borderRadius: 'var(--radius-xl)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛍️</div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>{t('empty_cart')}</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            {t('direct_factory_desc')}
          </p>
          <button onClick={() => setCurrentView('shop')} className="btn-primary">
            <span>{t('start_shopping')}</span>
          </button>
        </div>
      </div>
    );
  }

  // STEP 3: Order Confirmation & Invoice & Printable Shipping Waybill
  if (step === 3 && confirmedOrder) {
    return (
      <div className="page-wrapper" style={{ padding: '3rem 0', maxWidth: '860px' }}>
        <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-lg)' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)'
            }}>
              <CheckCircle size={36} />
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-primary)' }}>
              {language === 'km' ? 'សូមអរគុណ! ការបញ្ជាទិញជោគជ័យ' : 'Thank You! Order Confirmed'}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.35rem' }}>
              {t('order_number')}: <strong style={{ color: 'var(--accent-primary)', fontSize: '1.1rem' }}>#{confirmedOrder.order_number}</strong>
            </p>
          </div>

          {/* Printable Official Receipt & Shipping Label */}
          <div id="printable-receipt" style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            padding: '2rem',
            marginBottom: '2rem',
            color: 'var(--text-primary)'
          }}>
            
            {/* Store Header & Letterhead */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid var(--border-color)', paddingBottom: '1.25rem', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--accent-primary)', marginBottom: '0.2rem' }}>
                  {settings.store_name || 'SR SHOP'}
                </h3>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', maxWidth: '380px', lineHeight: 1.3 }}>
                  {settings.store_address}
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                  📞 Hotline: <strong>{settings.store_phone || '098 33 47 55'}</strong> • Telegram: <strong>{settings.store_telegram_handle || '@SIYEANLONG'}</strong>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Official Invoice / Receipt
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--accent-primary)', marginTop: '2px' }}>
                  #{confirmedOrder.order_number}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  {new Date(confirmedOrder.created_at || Date.now()).toLocaleString()}
                </div>
                <div style={{ marginTop: '6px' }}>
                  <span style={{
                    display: 'inline-block',
                    padding: '0.25rem 0.65rem',
                    borderRadius: '4px',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    background: 'rgba(16, 185, 129, 0.15)',
                    color: '#10b981',
                    border: '1px solid rgba(16, 185, 129, 0.3)'
                  }}>
                    ✓ PAID & CONFIRMED
                  </span>
                </div>
              </div>
            </div>

            {/* Customer & Shipping Summary */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem', background: 'rgba(0,0,0,0.12)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Customer Name</div>
                <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-primary)', marginTop: '2px' }}>{confirmedOrder.customer_name}</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>📞 {confirmedOrder.customer_phone}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Shipping Destination</div>
                <div style={{ fontSize: '0.88rem', color: 'var(--text-primary)', marginTop: '2px', fontWeight: 600 }}>{confirmedOrder.shipping_address}</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{confirmedOrder.city}, Cambodia</div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Courier & Payment</div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--accent-primary)', marginTop: '2px' }}>{confirmedOrder.shipping_method}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Method: {confirmedOrder.payment_method}</div>
              </div>
            </div>

            {/* Itemized Products Table */}
            {confirmedOrder.items && confirmedOrder.items.length > 0 && (
              <div style={{ marginBottom: '1.5rem', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
                      <th style={{ padding: '0.5rem 0', fontWeight: 700, color: 'var(--text-secondary)' }}>Item Description</th>
                      <th style={{ padding: '0.5rem 0.5rem', textAlign: 'center', fontWeight: 700, color: 'var(--text-secondary)' }}>Qty</th>
                      <th style={{ padding: '0.5rem 0.5rem', textAlign: 'right', fontWeight: 700, color: 'var(--text-secondary)' }}>Unit Price</th>
                      <th style={{ padding: '0.5rem 0', textAlign: 'right', fontWeight: 700, color: 'var(--text-secondary)' }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {confirmedOrder.items.map((it, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '0.65rem 0' }}>
                          <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{it.product_name}</div>
                          {it.variant_info && <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{it.variant_info}</div>}
                        </td>
                        <td style={{ padding: '0.65rem 0.5rem', textAlign: 'center', fontWeight: 600 }}>{it.quantity}</td>
                        <td style={{ padding: '0.65rem 0.5rem', textAlign: 'right' }}>{formatPrice(it.unit_price)}</td>
                        <td style={{ padding: '0.65rem 0', textAlign: 'right', fontWeight: 700 }}>{formatPrice(it.total_price)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Financial Breakdown */}
            <div style={{ borderTop: '2px solid var(--border-color)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.88rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Subtotal:</span>
                <span style={{ fontWeight: 600 }}>{formatPrice(confirmedOrder.subtotal)}</span>
              </div>
              {confirmedOrder.discount_amount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981' }}>
                  <span>Discount ({confirmedOrder.coupon_code || 'Promo'}):</span>
                  <span style={{ fontWeight: 600 }}>-{formatPrice(confirmedOrder.discount_amount)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Shipping:</span>
                <span style={{ fontWeight: 600 }}>
                  {confirmedOrder.shipping_cost === 0 ? 'FREE Express' : formatPrice(confirmedOrder.shipping_cost)}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-primary)', borderTop: '2px solid var(--border-color)', paddingTop: '0.75rem', marginTop: '0.35rem' }}>
                <span>Grand Total:</span>
                <span style={{ color: 'var(--accent-primary)' }}>{formatPrice(confirmedOrder.total_amount)}</span>
              </div>
            </div>

            {/* Receipt Footer Note */}
            <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px dashed var(--border-color)', textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              🙏 Thank you for shopping with <strong>{settings.store_name || 'SR SHOP'}</strong>! For questions, contact us via Telegram <strong>{settings.store_telegram_handle || '@SIYEANLONG'}</strong>.
            </div>

          </div>

          {/* Action Buttons (Hidden during Print) */}
          <div className="no-print" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => window.print()}
              className="btn-secondary"
              style={{ flex: 1, padding: '0.85rem' }}
            >
              <Printer size={16} />
              <span>{t('print_invoice')}</span>
            </button>

            <button
              onClick={() => {
                setActiveTrackingNumber(confirmedOrder.order_number);
                setCurrentView('tracking');
              }}
              className="btn-primary"
              style={{ flex: 1, padding: '0.85rem' }}
            >
              <Truck size={16} />
              <span>{t('track_order')}</span>
            </button>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper" style={{ padding: '2.5rem 0', maxWidth: '1100px' }}>
      
      {/* Checkout Progress Stepper */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: step >= 1 ? 'var(--accent-primary)' : 'var(--text-muted)', fontWeight: 700, fontSize: '0.9rem' }}>
          <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: step >= 1 ? 'var(--accent-primary)' : 'rgba(255,255,255,0.08)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>1</div>
          <span>{t('step_shipping')}</span>
        </div>
        <div style={{ width: '40px', height: '2px', background: step >= 2 ? 'var(--accent-primary)' : 'var(--border-color)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: step >= 2 ? 'var(--accent-primary)' : 'var(--text-muted)', fontWeight: 700, fontSize: '0.9rem' }}>
          <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: step >= 2 ? 'var(--accent-primary)' : 'rgba(255,255,255,0.08)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>2</div>
          <span>{t('step_payment')}</span>
        </div>
      </div>

      {/* Main Checkout Layout Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        
        {/* Left Column: Form Steps */}
        <div>
          {step === 1 && (
            <div className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-xl)' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Truck size={20} color="var(--accent-primary)" />
                <span>{t('step_shipping')}</span>
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>
                    {t('full_name')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>
                    {t('phone_number')} (Telegram / WhatsApp) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>
                    {t('delivery_address')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>
                    {t('city_province')} *
                  </label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                    style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', outline: 'none' }}
                  >
                    <option value="Phnom Penh">រាជធានីភ្នំពេញ (Phnom Penh)</option>
                    <option value="Siem Reap">ខេត្តសៀមរាប (Siem Reap)</option>
                    <option value="Battambang">ខេត្តបាត់ដំបង (Battambang)</option>
                    <option value="Kandal">ខេត្តកណ្តាល (Kandal)</option>
                    <option value="Sihanoukville">ខេត្តព្រះសីហនុ (Sihanoukville)</option>
                    <option value="Kampot">ខេត្តកំពត (Kampot)</option>
                    <option value="Kampong Cham">ខេត្តកំពង់ចាម (Kampong Cham)</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={() => { soundFX.playPop(); setStep(2); }}
                  className="btn-primary"
                  style={{ width: '100%', padding: '0.85rem', marginTop: '0.5rem' }}
                >
                  <span>Continue to Payment</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-xl)' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Lock size={20} color="var(--accent-primary)" />
                <span>{t('step_payment')}</span>
              </h3>

              {/* Payment Method Selector Pills */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                {[
                  { id: 'KHQR / ABA Pay & Bakong', title: t('payment_khqr'), badge: '⚡ INSTANT SCAN' },
                  { id: 'Credit Card', title: t('payment_card'), badge: 'VISA / MASTER' },
                  { id: 'Cash on Delivery', title: t('payment_cod'), badge: 'PAY AT DOOR' }
                ].map(opt => (
                  <div
                    key={opt.id}
                    onClick={() => { soundFX.playPop(); setPaymentMethod(opt.id); }}
                    style={{
                      padding: '1rem',
                      borderRadius: 'var(--radius-md)',
                      background: paymentMethod === opt.id ? 'rgba(99, 102, 241, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                      border: `1px solid ${paymentMethod === opt.id ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: `2px solid ${paymentMethod === opt.id ? 'var(--accent-primary)' : 'var(--text-muted)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {paymentMethod === opt.id && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-primary)' }} />}
                      </div>
                      <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>{opt.title}</span>
                    </div>
                    <span style={{ fontSize: '0.68rem', fontWeight: 800, padding: '0.2rem 0.5rem', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.08)', color: 'var(--accent-primary)' }}>
                      {opt.badge}
                    </span>
                  </div>
                ))}
              </div>

              {/* KHQR Interactive Scan Simulator */}
              {paymentMethod === 'KHQR / ABA Pay & Bakong' && (
                <div style={{
                  background: 'linear-gradient(135deg, #0e172e 0%, #162447 100%)',
                  border: '2px solid #229ED9',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.5rem',
                  textAlign: 'center',
                  marginBottom: '1.5rem'
                }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#e11d48', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.35rem' }}>
                    KHQR • ABA / BAKONG UNIVERSAL PAY
                  </div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.25rem' }}>
                    {t('scan_khqr_title')}
                  </h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                    {t('scan_khqr_subtitle')}
                  </p>

                  {/* Dynamic QR Box */}
                  <div style={{
                    background: '#ffffff',
                    padding: '1rem',
                    borderRadius: '12px',
                    display: 'inline-block',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
                    marginBottom: '1rem'
                  }}>
                    <img
                      src="/telegram-qr.png"
                      alt="KHQR Scan Code"
                      style={{ width: '160px', height: '160px', objectFit: 'contain', display: 'block' }}
                    />
                  </div>

                  <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#22c55e', marginBottom: '0.5rem' }}>
                    {formatPrice(finalTotal)}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    <Clock size={14} color="#f59e0b" />
                    <span>{t('khqr_time_left')} <strong>{Math.floor(khqrTimer / 60)}:{(khqrTimer % 60).toString().padStart(2, '0')}</strong></span>
                  </div>

                  {/* Simulator Trigger */}
                  <button
                    type="button"
                    onClick={handleSimulateScanKHQR}
                    style={{
                      padding: '0.6rem 1.25rem',
                      borderRadius: 'var(--radius-md)',
                      background: khqrStatus === 'verified' ? '#10b981' : 'rgba(34, 158, 217, 0.25)',
                      border: '1px solid #229ED9',
                      color: '#ffffff',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {khqrStatus === 'verified' ? t('payment_confirmed') : '📱 Click to Simulate Mobile Banking App Scan'}
                  </button>
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="btn-secondary"
                  style={{ flex: 1 }}
                >
                  Back
                </button>

                <button
                  type="button"
                  onClick={handleFinalOrder}
                  disabled={isProcessingOrder}
                  className="btn-primary"
                  style={{ flex: 2, padding: '0.85rem' }}
                >
                  <span>{isProcessingOrder ? 'Processing...' : t('place_order')} • {formatPrice(finalTotal)}</span>
                  <ArrowRight size={16} />
                </button>
              </div>

            </div>
          )}
        </div>

        {/* Right Column: Order Summary Card */}
        <div>
          <div className="glass-panel" style={{ padding: '1.75rem', borderRadius: 'var(--radius-xl)', position: 'sticky', top: '90px' }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              {t('your_cart')} ({cart.length})
            </h4>

            {/* Items List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', maxHeight: '280px', overflowY: 'auto', marginBottom: '1.25rem' }}>
              {cart.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <img src={item.image} alt="" style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border-color)' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.84rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Qty: {item.quantity} {item.variant ? `• ${item.variant}` : ''}</div>
                  </div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                    {formatPrice(Number(item.price) * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            {/* Financial Summary */}
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>{t('subtotal')}:</span>
                <span>{formatPrice(cartSubtotal)}</span>
              </div>
              {appliedCoupon && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981' }}>
                  <span>{t('discount')} ({appliedCoupon.code}):</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>{t('shipping')}:</span>
                <span style={{ color: shippingCost === 0 ? '#10b981' : 'inherit', fontWeight: 700 }}>
                  {shippingCost === 0 ? t('free') : formatPrice(shippingCost)}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-primary)', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', marginTop: '0.25rem' }}>
                <span>{t('total')}:</span>
                <span style={{ color: 'var(--accent-primary)' }}>{formatPrice(finalTotal)}</span>
              </div>
            </div>

            <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <ShieldCheck size={16} color="#10b981" />
              <span>256-Bit SSL Encrypted & Verified Direct Sourcing</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
