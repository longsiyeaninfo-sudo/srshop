import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { FacebookIcon, TelegramIcon } from '../common/Icons';
import TelegramQRModal from '../common/TelegramQRModal';
import {
  ShoppingBag,
  Heart,
  Search,
  Moon,
  Sun,
  Truck,
  ShieldCheck,
  User,
  SlidersHorizontal,
  X,
  PackageCheck,
  ChevronDown,
  QrCode,
  Globe,
  DollarSign,
  Check
} from 'lucide-react';

export default function Navbar({ onOpenAuth }) {
  const {
    theme,
    toggleTheme,
    language,
    toggleLanguage,
    currency,
    toggleCurrency,
    settings,
    cartTotalItems,
    cartSubtotal,
    setIsCartOpen,
    wishlist,
    searchQuery,
    setSearchQuery,
    categories,
    selectedCategory,
    setSelectedCategory,
    user,
    logoutUser,
    currentView,
    setCurrentView,
    products,
    setQuickViewProduct
  } = useStore();

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCurrencyMenu, setShowCurrencyMenu] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [isTelegramModalOpen, setIsTelegramModalOpen] = useState(false);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('[data-dropdown]')) {
        setShowCurrencyMenu(false);
        setShowLanguageMenu(false);
        setShowUserMenu(false);
        setShowCategoryMenu(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Filtered live search suggestions
  const searchSuggestions = searchQuery.trim()
    ? products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 4)
    : [];

  return (
    <header className="glass-nav" style={{ position: 'sticky', top: 0, zIndex: 100, transition: 'all 0.3s' }}>
      <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 0', gap: '1.25rem' }}>
        
        {/* Brand Logo: SR SHOP */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div
            onClick={() => { setCurrentView('shop'); setSelectedCategory('all'); setSearchQuery(''); }}
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', textDecoration: 'none' }}
          >
            {settings.store_logo_url ? (
              <img
                src={settings.store_logo_url}
                alt={settings.store_name || 'SR SHOP'}
                style={{ height: '42px', maxWidth: '140px', objectFit: 'contain' }}
              />
            ) : (
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)',
                color: '#ffffff',
                fontWeight: 900,
                fontSize: '1.25rem',
                letterSpacing: '-0.05em'
              }}>
                SR
              </div>
            )}
            <div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1 }}>
                <span className="gradient-text">{settings.store_name || 'SR SHOP'}</span>
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {settings.store_tagline || 'Import Store'}
              </div>
            </div>
          </div>

          {/* Quick Categories dropdown */}
          <div style={{ position: 'relative' }} data-dropdown="category">
            <button
              onClick={() => setShowCategoryMenu(prev => !prev)}
              style={{
                display: 'none',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.5rem 0.9rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
              className="d-md-flex"
            >
              <span>Categories</span>
              <ChevronDown size={14} />
            </button>

            {showCategoryMenu && (
              <div
                style={{
                  position: 'absolute',
                  top: '115%',
                  left: 0,
                  width: '230px',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-lg)',
                  padding: '0.5rem',
                  zIndex: 200
                }}
              >
                <div
                  onClick={() => { setSelectedCategory('all'); setCurrentView('shop'); setShowCategoryMenu(false); }}
                  style={{
                    padding: '0.6rem 0.8rem',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: selectedCategory === 'all' ? 700 : 500,
                    color: selectedCategory === 'all' ? 'var(--accent-primary)' : 'var(--text-primary)',
                    background: selectedCategory === 'all' ? 'rgba(99, 102, 241, 0.1)' : 'transparent'
                  }}
                >
                  ⚡ All Products
                </div>
                {categories.map(cat => (
                  <div
                    key={cat.id}
                    onClick={() => { setSelectedCategory(cat.slug); setCurrentView('shop'); setShowCategoryMenu(false); }}
                    style={{
                      padding: '0.6rem 0.8rem',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      fontWeight: selectedCategory === cat.slug ? 700 : 500,
                      color: selectedCategory === cat.slug ? 'var(--accent-primary)' : 'var(--text-primary)',
                      background: selectedCategory === cat.slug ? 'rgba(99, 102, 241, 0.1)' : 'transparent'
                    }}
                  >
                    {cat.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Live Search Bar */}
        <div style={{ flex: 1, maxWidth: '440px', position: 'relative' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: 'var(--bg-card)',
            border: `1px solid ${isSearchFocused ? 'var(--accent-primary)' : 'var(--border-color)'}`,
            borderRadius: 'var(--radius-full)',
            padding: '0.45rem 1rem',
            boxShadow: isSearchFocused ? '0 0 15px rgba(99, 102, 241, 0.25)' : 'none',
            transition: 'all 0.2s'
          }}>
            <Search size={16} color="var(--text-muted)" style={{ marginRight: '0.6rem', flexShrink: 0 }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              placeholder="Search imported gadgets, tools, car accessories..."
              style={{
                background: 'none',
                border: 'none',
                outline: 'none',
                color: 'var(--text-primary)',
                width: '100%',
                fontSize: '0.88rem'
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', cursor: 'pointer' }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Autocomplete Dropdown Preview */}
          {isSearchFocused && searchSuggestions.length > 0 && (
            <div style={{
              position: 'absolute',
              top: '115%',
              left: 0,
              right: 0,
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-lg)',
              padding: '0.5rem',
              zIndex: 300
            }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', padding: '0.35rem 0.65rem', textTransform: 'uppercase', fontWeight: 700 }}>
                Instant Matches
              </div>
              {searchSuggestions.map(item => (
                <div
                  key={item.id}
                  onClick={() => {
                    setQuickViewProduct(item);
                    setIsSearchFocused(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.5rem 0.65rem',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    transition: 'background 0.15s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <img
                    src={item.images[0]}
                    alt={item.name}
                    style={{ width: '38px', height: '38px', objectFit: 'cover', borderRadius: '6px' }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 700 }}>
                      ${Number(item.price).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Controls & Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          
          {/* 1. Currency Dropdown: Active Currency Symbol Trigger */}
          <div style={{ position: 'relative' }} data-dropdown="currency">
            <button
              onClick={() => {
                setShowCurrencyMenu(prev => !prev);
                setShowLanguageMenu(false);
                setShowUserMenu(false);
              }}
              className="btn-icon"
              title={`Active Currency: ${currency === 'USD' ? '$' : '៛'} (Click to change)`}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-md)',
                background: showCurrencyMenu ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                borderColor: showCurrencyMenu ? 'var(--accent-primary)' : 'var(--border-color)',
                fontSize: '1rem',
                fontWeight: 900,
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {currency === 'USD' ? '$' : '៛'}
            </button>

            {showCurrencyMenu && (
              <div
                className="animate-fade-in"
                style={{
                  position: 'absolute',
                  top: '115%',
                  right: 0,
                  minWidth: '85px',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                  padding: '0.35rem',
                  zIndex: 300,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem'
                }}
              >
                <div
                  onClick={() => { toggleCurrency('USD'); setShowCurrencyMenu(false); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.45rem 0.65rem',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    background: currency === 'USD' ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                    color: currency === 'USD' ? 'var(--accent-primary)' : 'var(--text-primary)',
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    transition: 'all 0.15s'
                  }}
                  title="USD ($)"
                >
                  <span>$</span>
                  {currency === 'USD' && <Check size={14} color="var(--accent-primary)" />}
                </div>

                <div
                  onClick={() => { toggleCurrency('KHR'); setShowCurrencyMenu(false); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.45rem 0.65rem',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    background: currency === 'KHR' ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                    color: currency === 'KHR' ? 'var(--accent-primary)' : 'var(--text-primary)',
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    transition: 'all 0.15s'
                  }}
                  title="KHR (៛)"
                >
                  <span>៛</span>
                  {currency === 'KHR' && <Check size={14} color="var(--accent-primary)" />}
                </div>
              </div>
            )}
          </div>

          {/* 2. Language Dropdown: Active Flag Logo Trigger */}
          <div style={{ position: 'relative' }} data-dropdown="language">
            <button
              onClick={() => {
                setShowLanguageMenu(prev => !prev);
                setShowCurrencyMenu(false);
                setShowUserMenu(false);
              }}
              className="btn-icon"
              title={`Active Language: ${language === 'km' ? '🇰🇭' : language === 'zh' ? '🇨🇳' : '🇺🇸'} (Click to change)`}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-md)',
                background: showLanguageMenu ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                borderColor: showLanguageMenu ? 'var(--accent-primary)' : 'var(--border-color)',
                fontSize: '1.15rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {language === 'km' ? '🇰🇭' : language === 'zh' ? '🇨🇳' : '🇺🇸'}
            </button>

            {showLanguageMenu && (
              <div
                className="animate-fade-in"
                style={{
                  position: 'absolute',
                  top: '115%',
                  right: 0,
                  minWidth: '85px',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                  padding: '0.35rem',
                  zIndex: 300,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem'
                }}
              >
                {/* 🇰🇭 Khmer */}
                <div
                  onClick={() => { toggleLanguage('km'); setShowLanguageMenu(false); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.45rem 0.6rem',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    background: language === 'km' ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                    fontSize: '1.15rem',
                    transition: 'all 0.15s'
                  }}
                  title="ភាសាខ្មែរ"
                >
                  <span>🇰🇭</span>
                  {language === 'km' && <Check size={14} color="var(--accent-primary)" />}
                </div>

                {/* 🇺🇸 English */}
                <div
                  onClick={() => { toggleLanguage('en'); setShowLanguageMenu(false); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.45rem 0.6rem',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    background: language === 'en' ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                    fontSize: '1.15rem',
                    transition: 'all 0.15s'
                  }}
                  title="English"
                >
                  <span>🇺🇸</span>
                  {language === 'en' && <Check size={14} color="var(--accent-primary)" />}
                </div>

                {/* 🇨🇳 Chinese */}
                <div
                  onClick={() => { toggleLanguage('zh'); setShowLanguageMenu(false); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.45rem 0.6rem',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    background: language === 'zh' ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                    fontSize: '1.15rem',
                    transition: 'all 0.15s'
                  }}
                  title="中文"
                >
                  <span>🇨🇳</span>
                  {language === 'zh' && <Check size={14} color="var(--accent-primary)" />}
                </div>
              </div>
            )}
          </div>

          {/* Day / Night Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="btn-icon"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="#6366f1" />}
          </button>

          {/* Order / Track Orders Icon Button */}
          <button
            onClick={() => setCurrentView('tracking')}
            className="btn-icon"
            style={{
              background: currentView === 'tracking' ? 'rgba(99, 102, 241, 0.2)' : undefined,
              borderColor: currentView === 'tracking' ? 'var(--accent-primary)' : undefined,
              color: currentView === 'tracking' ? 'var(--accent-primary)' : 'var(--text-primary)'
            }}
            title="Track Order / My Orders"
          >
            <PackageCheck size={18} />
          </button>

          {/* User Account / Admin Portal */}
          <div style={{ position: 'relative' }} data-dropdown="user">
            <button
              onClick={() => setShowUserMenu(prev => !prev)}
              className="btn-icon"
              style={{
                background: user?.role === 'admin' ? 'rgba(99, 102, 241, 0.2)' : undefined,
                borderColor: user?.role === 'admin' ? 'var(--accent-primary)' : undefined
              }}
              title={user ? `${user.name} (${user.role})` : 'Account'}
            >
              <User size={18} />
            </button>

            {showUserMenu && (
              <div style={{
                position: 'absolute',
                top: '115%',
                right: 0,
                width: '210px',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-lg)',
                padding: '0.6rem',
                zIndex: 250
              }}>
                {user ? (
                  <>
                    <div style={{ padding: '0.4rem 0.6rem', borderBottom: '1px solid var(--border-color)', marginBottom: '0.4rem' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{user.name}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{user.email}</div>
                      {user.role === 'admin' && (
                        <span style={{ fontSize: '0.65rem', background: 'rgba(99, 102, 241, 0.2)', color: 'var(--accent-primary)', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 700, marginTop: '4px', display: 'inline-block' }}>
                          STORE OWNER / ADMIN
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => { setCurrentView('admin'); setShowUserMenu(false); }}
                      style={{ width: '100%', textAlign: 'left', padding: '0.5rem 0.6rem', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', fontWeight: 600, color: 'var(--accent-primary)', background: 'rgba(99, 102, 241, 0.08)', marginBottom: '4px', cursor: 'pointer' }}
                    >
                      📊 Store Admin Dashboard
                    </button>

                    <button
                      onClick={() => { setCurrentView('tracking'); setShowUserMenu(false); }}
                      style={{ width: '100%', textAlign: 'left', padding: '0.5rem 0.6rem', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', color: 'var(--text-primary)', cursor: 'pointer' }}
                    >
                      📦 My Orders & Tracking
                    </button>

                    <button
                      onClick={() => { logoutUser(); setShowUserMenu(false); }}
                      style={{ width: '100%', textAlign: 'left', padding: '0.5rem 0.6rem', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', color: 'var(--danger)', cursor: 'pointer' }}
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => { onOpenAuth(); setShowUserMenu(false); }}
                      style={{ width: '100%', textAlign: 'left', padding: '0.5rem 0.6rem', borderRadius: 'var(--radius-sm)', fontSize: '0.84rem', fontWeight: 600, color: 'var(--accent-primary)', background: 'rgba(99, 102, 241, 0.1)', marginBottom: '4px', cursor: 'pointer' }}
                    >
                      🔑 Sign In / Register
                    </button>
                    <button
                      onClick={() => { setCurrentView('admin'); setShowUserMenu(false); }}
                      style={{ width: '100%', textAlign: 'left', padding: '0.5rem 0.6rem', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', color: 'var(--text-secondary)', cursor: 'pointer' }}
                    >
                      🛠️ Open Store Admin
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Cart Bag Drawer Trigger (Icon-Only with Badge) */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="btn-icon"
            style={{
              position: 'relative',
              background: cartTotalItems > 0 ? 'rgba(99, 102, 241, 0.18)' : undefined,
              borderColor: cartTotalItems > 0 ? 'var(--accent-primary)' : undefined,
              color: cartTotalItems > 0 ? 'var(--accent-primary)' : 'var(--text-primary)'
            }}
            title={`Shopping Bag (${cartTotalItems} items)`}
          >
            <ShoppingBag size={18} />
            {cartTotalItems > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: 'var(--accent-primary)',
                color: '#ffffff',
                fontSize: '0.65rem',
                fontWeight: 900,
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(99, 102, 241, 0.5)'
              }}>
                {cartTotalItems}
              </span>
            )}
          </button>

        </div>
      </div>

      {/* Telegram QR Code Modal */}
      <TelegramQRModal
        isOpen={isTelegramModalOpen}
        onClose={() => setIsTelegramModalOpen(false)}
      />
    </header>
  );
}
