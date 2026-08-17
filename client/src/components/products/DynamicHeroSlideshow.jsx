import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { FacebookIcon, TelegramIcon, MessengerIcon } from '../common/Icons';
import TelegramQRModal from '../common/TelegramQRModal';
import {
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Sparkles,
  Zap,
  Phone,
  MapPin,
  QrCode,
  ShieldCheck,
  Truck,
  ArrowRight,
  Flame
} from 'lucide-react';

export default function DynamicHeroSlideshow() {
  const {
    slides,
    settings,
    setQuickViewProduct,
    products,
    formatPrice,
    language,
    t
  } = useStore();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isTelegramModalOpen, setIsTelegramModalOpen] = useState(false);
  const timerRef = useRef(null);

  const activeSlides = Array.isArray(slides) && slides.length > 0
    ? slides
    : [
        {
          id: 'default_1',
          title: '20,000mAh High-Power Car Jump Starter & Emergency Kit',
          title_km: 'ឧបករណ៍បញ្ឆេះអាគុយឡានចល័តកម្លាំងខ្លាំង 20000mAh',
          subtitle: 'Never get stranded! 12V instant engine jump start + emergency tire pump & LED strobe.',
          subtitle_km: 'បញ្ឆេះឡានបានភ្លាមៗដោយខ្លួនឯង ភ្ជាប់ជាមួយពិល LED បន្ទាន់ និងប្រអប់ដែករឹងមាំ។',
          image: '/sr-shop-banner.jpg',
          badge: '🔥 #1 BESTSELLER',
          price: 49.00,
          compare_at_price: 85.00,
          cta_text: 'Shop Now',
          cta_text_km: 'ទិញឥឡូវនេះ',
          product_id: 'sr_prod_1'
        }
      ];

  const autoplaySpeed = Number(settings.slideshow_autoplay_speed) || 5000;
  const isAutoplay = settings.slideshow_is_autoplay !== '0';
  const transitionEffect = settings.slideshow_transition_effect || 'fade';

  // Autoplay rotation loop with pause on hover
  useEffect(() => {
    if (!isAutoplay || isHovered || activeSlides.length <= 1) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % activeSlides.length);
    }, autoplaySpeed);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isAutoplay, isHovered, activeSlides.length, autoplaySpeed]);

  const handlePrev = () => {
    setCurrentIndex(prev => (prev === 0 ? activeSlides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % activeSlides.length);
  };

  const currentSlide = activeSlides[currentIndex] || activeSlides[0];

  const handleSlideClick = () => {
    if (currentSlide.product_id) {
      const matched = products.find(p => p.id === currentSlide.product_id);
      if (matched) {
        setQuickViewProduct(matched);
      } else {
        // Find by name or fallback
        const byName = products.find(p => p.name.toLowerCase().includes(currentSlide.title.toLowerCase().substring(0, 10)));
        if (byName) setQuickViewProduct(byName);
      }
    } else {
      const el = document.getElementById('catalog-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const slideTitle = language === 'km' && currentSlide.title_km ? currentSlide.title_km : currentSlide.title;
  const slideSubtitle = language === 'km' && currentSlide.subtitle_km ? currentSlide.subtitle_km : currentSlide.subtitle;
  const slideCta = language === 'km' && currentSlide.cta_text_km ? currentSlide.cta_text_km : (currentSlide.cta_text || 'Shop Now');

  const discountPercent = currentSlide.compare_at_price && currentSlide.compare_at_price > currentSlide.price
    ? Math.round(((currentSlide.compare_at_price - currentSlide.price) / currentSlide.compare_at_price) * 100)
    : 0;

  return (
    <div style={{ position: 'relative', marginTop: '1rem', marginBottom: '2rem' }}>
      <div className="page-wrapper">
        
        {/* Main Slideshow Frame */}
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            position: 'relative',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            border: '1px solid var(--border-color)',
            background: 'linear-gradient(135deg, #091224 0%, #101c36 100%)',
            boxShadow: 'var(--shadow-lg)',
            minHeight: '380px'
          }}
        >
          
          {/* Slide Content Layer */}
          <div style={{
            position: 'relative',
            width: '100%',
            minHeight: '380px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            alignItems: 'center',
            gap: '2rem',
            padding: '2rem 2.5rem',
            transition: 'opacity 0.4s ease-in-out'
          }}>
            
            {/* Ambient Background Glow Effect */}
            <div style={{
              position: 'absolute',
              top: '-20%',
              right: '-10%',
              width: '400px',
              height: '400px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, rgba(99, 102, 241, 0) 70%)',
              pointerEvents: 'none',
              filter: 'blur(40px)'
            }} />

            {/* Left Side: Text & Offer Details */}
            <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              
              {/* Badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span className="badge badge-sale" style={{ fontSize: '0.78rem', padding: '0.35rem 0.85rem' }}>
                  <Flame size={14} />
                  <span>{currentSlide.badge || 'FEATURED IMPORT'}</span>
                </span>
                <span style={{ fontSize: '0.75rem', color: '#818cf8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Slide {currentIndex + 1} of {activeSlides.length}
                </span>
              </div>

              {/* Title */}
              <h1 style={{
                fontSize: 'clamp(1.5rem, 3.2vw, 2.35rem)',
                fontWeight: 900,
                color: '#ffffff',
                lineHeight: 1.2,
                letterSpacing: '-0.03em'
              }}>
                {slideTitle}
              </h1>

              {/* Subtitle */}
              {slideSubtitle && (
                <p style={{ fontSize: '0.95rem', color: '#94a3b8', lineHeight: 1.5, maxWidth: '520px' }}>
                  {slideSubtitle}
                </p>
              )}

              {/* Price & Savings Tag */}
              {currentSlide.price !== null && currentSlide.price !== undefined && (
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.85rem', marginTop: '0.25rem' }}>
                  <span style={{ fontSize: '2rem', fontWeight: 900, color: '#ffffff', textShadow: '0 0 20px rgba(99, 102, 241, 0.6)' }}>
                    {formatPrice(currentSlide.price)}
                  </span>
                  {currentSlide.compare_at_price && currentSlide.compare_at_price > currentSlide.price && (
                    <>
                      <span style={{ fontSize: '1.15rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                        {formatPrice(currentSlide.compare_at_price)}
                      </span>
                      <span className="badge badge-new" style={{ fontSize: '0.75rem' }}>
                        SAVE {discountPercent}%
                      </span>
                    </>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                <button
                  onClick={handleSlideClick}
                  className="btn-primary"
                  style={{ padding: '0.8rem 1.6rem', fontSize: '0.95rem' }}
                >
                  <ShoppingBag size={17} />
                  <span>{slideCta}</span>
                  <ArrowRight size={16} />
                </button>

                <a
                  href="https://t.me/SIYEANLONG"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                  style={{
                    background: 'rgba(34, 158, 217, 0.15)',
                    borderColor: 'rgba(34, 158, 217, 0.4)',
                    color: '#229ED9',
                    padding: '0.8rem 1.25rem',
                    fontSize: '0.9rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem'
                  }}
                >
                  <TelegramIcon size={16} />
                  <span>Telegram</span>
                </a>
              </div>

            </div>

            {/* Right Side: High-Resolution Featured Image */}
            <div
              onClick={handleSlideClick}
              style={{
                position: 'relative',
                zIndex: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <div style={{
                position: 'relative',
                width: '100%',
                maxWidth: '440px',
                aspectRatio: '4 / 3',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                boxShadow: '0 20px 40px -10px rgba(0,0,0,0.6)',
                border: '1px solid rgba(255, 255, 255, 0.15)'
              }}>
                <img
                  src={currentSlide.image}
                  alt={slideTitle}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    transition: 'transform 0.5s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />

                {/* Subtle Image Tag Overlay */}
                <div style={{
                  position: 'absolute',
                  bottom: '12px',
                  right: '12px',
                  background: 'rgba(15, 23, 42, 0.85)',
                  backdropFilter: 'blur(8px)',
                  padding: '0.35rem 0.75rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.72rem',
                  color: '#ffffff',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}>
                  <Zap size={12} color="#f59e0b" />
                  <span>Factory Direct</span>
                </div>
              </div>
            </div>

          </div>

          {/* Navigation Arrows */}
          {activeSlides.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '16px',
                  transform: 'translateY(-50%)',
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: 'rgba(15, 23, 42, 0.75)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 20,
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--accent-primary)'; e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(15, 23, 42, 0.75)'; e.currentTarget.style.transform = 'translateY(-50%) scale(1)'; }}
                title="Previous Slide"
              >
                <ChevronLeft size={22} />
              </button>

              <button
                onClick={(e) => { e.stopPropagation(); handleNext(); }}
                style={{
                  position: 'absolute',
                  top: '50%',
                  right: '16px',
                  transform: 'translateY(-50%)',
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: 'rgba(15, 23, 42, 0.75)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 20,
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--accent-primary)'; e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(15, 23, 42, 0.75)'; e.currentTarget.style.transform = 'translateY(-50%) scale(1)'; }}
                title="Next Slide"
              >
                <ChevronRight size={22} />
              </button>
            </>
          )}

          {/* Slide Indicators / Navigation Pills */}
          {activeSlides.length > 1 && (
            <div style={{
              position: 'absolute',
              bottom: '16px',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              zIndex: 20,
              background: 'rgba(15, 23, 42, 0.65)',
              backdropFilter: 'blur(8px)',
              padding: '6px 12px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              {activeSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  style={{
                    width: currentIndex === idx ? '24px' : '8px',
                    height: '8px',
                    borderRadius: '4px',
                    background: currentIndex === idx ? 'var(--accent-primary)' : 'rgba(255, 255, 255, 0.3)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease'
                  }}
                  title={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}

        </div>
      </div>

      <TelegramQRModal
        isOpen={isTelegramModalOpen}
        onClose={() => setIsTelegramModalOpen(false)}
      />
    </div>
  );
}
