import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../utils/translations';
import { soundFX } from '../utils/audio';

const StoreContext = createContext();

export function StoreProvider({ children }) {
  // Theme & Language & Currency
  const [theme, setTheme] = useState(() => localStorage.getItem('sr_theme') || 'dark');
  const [language, setLanguage] = useState(() => localStorage.getItem('sr_lang') || 'en'); // 'en' or 'km'
  const [currency, setCurrency] = useState(() => localStorage.getItem('sr_curr') || 'USD'); // 'USD' or 'KHR'
  const exchangeRate = 4100; // 1 USD = 4,100 KHR

  // Store profile settings
  const [settings, setSettings] = useState({
    store_name: 'SR SHOP',
    store_tagline: 'ត្រូវការ គ្រឿងអេឡិចត្រូនិក និងសម្ភារៈប្រើប្រាស់ប្រចាំថ្ងៃនាំចូលផ្ទាល់ (Direct Imported Quality Electronics & Everyday Essentials)',
    store_address: 'បុរីពិភពថ្មីកំបូល 3, ភូមិថ្មី, សង្កាត់កំបូល, ខណ្ឌកំបូល, រាជធានីភ្នំពេញ (Borey Piphup Thmey Kamboul 3, Phnom Penh)',
    store_phone: '098 33 47 55',
    store_email: 'contact@srmacshop.com',
    store_website: 'srmacshop.com',
    store_facebook: 'https://www.facebook.com/SRonlines.shop/',
    store_messenger: 'https://m.me/SRonlines.shop',
    store_telegram: 'https://t.me/SIYEANLONG',
    store_telegram_handle: '@SIYEANLONG',
    store_whatsapp: '+85598334755',
    store_currency: '$',
    free_shipping_threshold: '30',
    announcement_text: '🎉 SR SHOP - គ្រឿងអេឡិចត្រូនិកគុណភាពខ្ពស់នាំចូលផ្ទាល់ពីប្រទេសចិន | ទំនាក់ទំនង: 098 33 47 55 | ដឹកជញ្ជូនរហ័សទូទាំងប្រទេស',
    store_banner_image: '/sr-shop-banner.jpg'
  });

  // Products & Categories & Slides
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [slides, setSlides] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [isLoadingSlides, setIsLoadingSlides] = useState(true);

  // Filters & Navigation
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBadgeFilter, setSelectedBadgeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [currentView, setCurrentView] = useState('shop'); // 'shop', 'checkout', 'tracking', 'wishlist', 'admin'

  // Cart & Wishlist & Compare
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('sr_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('sr_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [comparedProducts, setComparedProducts] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('sr_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [activeTrackingNumber, setActiveTrackingNumber] = useState('SR-98421');
  const [recentOrders, setRecentOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('sr_recent_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const addRecentOrder = (order) => {
    setRecentOrders(prev => {
      const updated = [order, ...prev.filter(o => o.id !== order.id)].slice(0, 10);
      localStorage.setItem('sr_recent_orders', JSON.stringify(updated));
      return updated;
    });
    if (order.order_number) {
      setActiveTrackingNumber(order.order_number);
    }
  };

  const [toasts, setToasts] = useState([]);

  // Toast Notification
  const showToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Translation Helper
  const t = (key) => {
    const langDict = translations[language] || translations.en;
    return langDict[key] || translations.en[key] || key;
  };

  // Price Formatter Helper
  const formatPrice = (amountInUSD) => {
    const num = Number(amountInUSD) || 0;
    if (currency === 'KHR') {
      const khrVal = Math.round(num * exchangeRate);
      return `៛${khrVal.toLocaleString()}`;
    }
    return `$${num.toFixed(2)}`;
  };

  // Toggle Theme
  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('sr_theme', next);
    document.documentElement.setAttribute('data-theme', next);
  };

  // Toggle Language
  const toggleLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('sr_lang', lang);
    soundFX.playPop();
  };

  // Toggle Currency
  const toggleCurrency = (curr) => {
    setCurrency(curr);
    localStorage.setItem('sr_curr', curr);
    soundFX.playPop();
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Save Cart & Wishlist
  useEffect(() => {
    localStorage.setItem('sr_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('sr_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Initial Data Fetch
  useEffect(() => {
    fetchSettings();
    fetchCategories();
    fetchProducts();
    fetchSlides();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (data.success && data.settings) {
        setSettings(prev => ({ ...prev, ...data.settings }));
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (data.success && data.categories) {
        setCategories(data.categories);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchProducts = async () => {
    setIsLoadingProducts(true);
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data.success && data.products) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const fetchSlides = async (includeInactive = false) => {
    setIsLoadingSlides(true);
    try {
      const url = includeInactive ? '/api/slides?all=true' : '/api/slides';
      const res = await fetch(url);
      const data = await res.json();
      if (data.success && data.slides) {
        setSlides(data.slides);
      }
    } catch (err) {
      console.error('Error fetching slides:', err);
    } finally {
      setIsLoadingSlides(false);
    }
  };

  // Cart Operations
  const addToCart = (product, variant = '', quantity = 1) => {
    soundFX.playPop();
    setCart(prev => {
      const existingIdx = prev.findIndex(item => item.product_id === product.id && item.variant === variant);
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += quantity;
        return updated;
      } else {
        return [...prev, {
          product_id: product.id,
          name: product.name,
          price: product.price,
          compare_at_price: product.compare_at_price,
          image: Array.isArray(product.images) ? product.images[0] : product.image,
          variant: variant,
          quantity: quantity,
          cost_price: product.cost_price
        }];
      }
    });

    showToast(`🛒 ${product.name} ${language === 'km' ? 'បានដាក់ក្នុងកន្ត្រក!' : 'added to bag!'}`, 'success');
  };

  const updateCartQty = (productId, variant, newQty) => {
    if (newQty <= 0) {
      removeFromCart(productId, variant);
      return;
    }
    soundFX.playPop();
    setCart(prev => prev.map(item => {
      if (item.product_id === productId && item.variant === variant) {
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (productId, variant) => {
    setCart(prev => prev.filter(item => !(item.product_id === productId && item.variant === variant)));
    showToast(language === 'km' ? 'ទំនិញត្រូវបានដកចេញពីកន្ត្រក' : 'Item removed from bag', 'info');
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // Cart Totals
  const cartSubtotal = cart.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);
  const cartTotalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const freeShippingThreshold = Number(settings.free_shipping_threshold) || 30;
  const isFreeShipping = cartSubtotal >= freeShippingThreshold;

  // Coupon Logic
  const applyCoupon = async (code) => {
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, subtotal: cartSubtotal })
      });
      const data = await res.json();
      if (data.success) {
        setAppliedCoupon(data.coupon);
        soundFX.playSuccess();
        showToast(`🎉 Coupon ${code} applied! Saved $${data.coupon.discount_amount.toFixed(2)}`, 'success');
        return { success: true };
      } else {
        showToast(data.message || 'Invalid coupon', 'error');
        return { success: false, message: data.message };
      }
    } catch (err) {
      showToast('Error validating coupon', 'error');
      return { success: false };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed', 'info');
  };

  // Wishlist Operations
  const toggleWishlist = (product) => {
    soundFX.playPop();
    setWishlist(prev => {
      const exists = prev.some(item => item.id === product.id);
      if (exists) {
        showToast(language === 'km' ? 'បានដកចេញពីទំនិញពេញចិត្ត' : 'Removed from wishlist', 'info');
        return prev.filter(item => item.id !== product.id);
      } else {
        showToast(language === 'km' ? '❤️ បានរក្សាទុកក្នុងទំនិញពេញចិត្ត!' : '❤️ Added to wishlist!', 'success');
        return [...prev, product];
      }
    });
  };

  const isInWishlist = (productId) => wishlist.some(item => item.id === productId);

  // Compare Products
  const toggleCompare = (product) => {
    soundFX.playPop();
    setComparedProducts(prev => {
      if (prev.some(p => p.id === product.id)) {
        return prev.filter(p => p.id !== product.id);
      }
      if (prev.length >= 3) {
        showToast('You can compare up to 3 products at a time', 'info');
        return prev;
      }
      showToast(`Added ${product.name} to comparison`, 'success');
      return [...prev, product];
    });
  };

  // Auth Operations
  const loginUser = (userData) => {
    setUser(userData);
    localStorage.setItem('sr_user', JSON.stringify(userData));
    soundFX.playSuccess();
    showToast(`Welcome back, ${userData.name}!`, 'success');
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem('sr_user');
    showToast('Signed out successfully', 'info');
  };

  return (
    <StoreContext.Provider value={{
      theme,
      toggleTheme,
      language,
      toggleLanguage,
      currency,
      toggleCurrency,
      exchangeRate,
      formatPrice,
      t,
      settings,
      setSettings,
      products,
      setProducts,
      categories,
      isLoadingProducts,
      selectedCategory,
      setSelectedCategory,
      selectedBadgeFilter,
      setSelectedBadgeFilter,
      searchQuery,
      setSearchQuery,
      sortBy,
      setSortBy,
      selectedSort: sortBy,
      setSelectedSort: setSortBy,
      priceRange,
      setPriceRange,
      loading: isLoadingProducts,
      currentView,
      setCurrentView,
      cart,
      addToCart,
      updateCartQty,
      updateCartQuantity: updateCartQty,
      removeFromCart,
      clearCart,
      cartSubtotal,
      cartTotalItems,
      freeShippingThreshold,
      isFreeShipping,
      freeShippingRemaining: Math.max(0, (Number(settings.free_shipping_threshold) || 30) - Math.max(0, cartSubtotal - (appliedCoupon ? Number(appliedCoupon.discount_amount || 0) : 0))),
      discountAmount: appliedCoupon ? Number(appliedCoupon.discount_amount || 0) : 0,
      appliedCoupon,
      applyCoupon,
      removeCoupon,
      wishlist,
      toggleWishlist,
      isInWishlist,
      comparedProducts,
      setComparedProducts,
      toggleCompare,
      isCartOpen,
      setIsCartOpen,
      quickViewProduct,
      setQuickViewProduct,
      user,
      loginUser,
      logoutUser,
      activeTrackingNumber,
      setActiveTrackingNumber,
      recentOrders,
      setRecentOrders,
      addRecentOrder,
      toasts,
      showToast,
      fetchProducts,
      fetchSettings,
      categories,
      setCategories,
      fetchCategories,
      slides,
      setSlides,
      fetchSlides,
      isLoadingSlides
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
