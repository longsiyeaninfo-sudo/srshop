import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  TrendingUp,
  DollarSign,
  Package,
  ShoppingCart,
  AlertTriangle,
  Settings,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  Clock,
  Sparkles,
  Search,
  Printer,
  Copy,
  Check,
  Send,
  Eye,
  BarChart3,
  Bot,
  Sliders,
  ArrowUp,
  ArrowDown,
  Film,
  Users,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Upload,
  Image as ImageIcon,
  Palette,
  Key,
  Lock,
  UserCheck,
  Globe,
  Phone,
  MapPin,
  X,
  ChevronRight,
  Menu,
  FileText,
  Filter,
  ExternalLink,
  Layers,
  ArrowRight,
  Maximize2,
  Grid,
  List,
  ArrowUpDown,
  Tag,
  Percent,
  PackagePlus,
  AlertCircle,
  RefreshCw,
  Box,
  Truck
} from 'lucide-react';
import { TelegramIcon, FacebookIcon, MessengerIcon } from '../common/Icons';

export default function AdminDashboard() {
  const {
    settings,
    setSettings,
    products,
    setProducts,
    categories,
    setCategories,
    fetchCategories,
    fetchProducts,
    fetchSettings,
    slides,
    fetchSlides,
    showToast,
    formatPrice,
    t,
    language,
    user
  } = useStore();

  // Role Session: 'admin', 'manager', 'staff'
  const [currentRole, setCurrentRole] = useState(user?.role || 'admin');
  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics', 'products', 'orders', 'slideshow', 'ai-copy', 'staff', 'branding'
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Data States
  const [analytics, setAnalytics] = useState(null);
  const [orders, setOrders] = useState([]);
  const [adminSlides, setAdminSlides] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Inventory Management State & Filters
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');
  const [productStockFilter, setProductStockFilter] = useState('all'); // 'all', 'in_stock', 'low_stock', 'out_of_stock'
  const [productSort, setProductSort] = useState('newest'); // 'newest', 'price-low', 'price-high', 'stock-low', 'stock-high', 'margin-high'
  const [productViewMode, setProductViewMode] = useState('table'); // 'table', 'grid'

  // Dynamic Catalog / Category Management Modal State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    slug: '',
    icon: '📦',
    description: '',
    display_order: 0
  });
  const [isCategorySaving, setIsCategorySaving] = useState(false);

  // Product Image File Browser & Drag-and-Drop Upload State
  const [productImageMode, setProductImageMode] = useState('upload'); // 'upload', 'url'
  const [isUploadingProductImage, setIsUploadingProductImage] = useState(false);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const productImageInputRef = useRef(null);

  // Orders Filter
  const [orderStatusFilter, setOrderStatusFilter] = useState('all'); // 'all', 'Processing', 'Shipped', 'Delivered', 'Cancelled'
  const [orderSearch, setOrderSearch] = useState('');

  // Modals
  const [selectedWaybillOrder, setSelectedWaybillOrder] = useState(null);

  // Product Add / Edit Modal State & Wizard
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productFormStep, setProductFormStep] = useState(1); // 1: Identity, 2: Media, 3: Pricing, 4: Stock
  const [productFormViewMode, setProductFormViewMode] = useState('wizard'); // 'wizard', 'single'
  const [categorySearchQuery, setCategorySearchQuery] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    category_id: categories[0]?.id || 'cat_auto',
    description: '',
    short_description: '',
    cost_price: '',
    price: '',
    compare_at_price: '',
    stock: 20,
    badge: '🔥 HOT IMPORT',
    image: '',
    supplier_info: ''
  });

  // Staff Modal State
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [staffForm, setStaffForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'staff',
    password: '',
    avatar: ''
  });

  // Branding & Logo State
  const [brandingForm, setBrandingForm] = useState({
    store_name: settings.store_name || 'SR SHOP',
    store_tagline: settings.store_tagline || '',
    store_logo_url: settings.store_logo_url || '',
    store_phone: settings.store_phone || '098 33 47 55',
    store_email: settings.store_email || 'contact@srmacshop.com',
    store_address: settings.store_address || 'បុរីពិភពថ្មីកំបូល 3, រាជធានីភ្នំពេញ',
    store_facebook: settings.store_facebook || 'https://web.facebook.com/SRonlines.shop/',
    store_messenger: settings.store_messenger || 'https://m.me/SRonlines.shop',
    store_telegram: 'https://t.me/SIYEANLONG'
  });
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const logoInputRef = useRef(null);

  // Slideshow States
  const [isSlideModalOpen, setIsSlideModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState(null);
  const [slideForm, setSlideForm] = useState({
    title: '',
    title_km: '',
    subtitle: '',
    subtitle_km: '',
    image: '',
    badge: '🔥 HOT IMPORT',
    price: '',
    compare_at_price: '',
    cta_text: 'Shop Now',
    cta_text_km: 'ទិញឥឡូវនេះ',
    product_id: '',
    display_order: 0
  });

  const [slideshowSettings, setSlideshowSettings] = useState({
    autoplay_speed: settings.slideshow_autoplay_speed || '5000',
    transition_effect: settings.slideshow_transition_effect || 'fade',
    is_autoplay: settings.slideshow_is_autoplay !== '0'
  });

  // AI Copy Generator State
  const [selectedProductForAI, setSelectedProductForAI] = useState(products[0]?.id || '');
  const [aiPlatform, setAiPlatform] = useState('facebook'); // 'facebook', 'tiktok', 'telegram'
  const [aiTone, setAiTone] = useState('urgent'); // 'urgent', 'quality', 'casual'
  const [generatedAICopy, setGeneratedAICopy] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  // Interactive Chart Tooltip State
  const [activeChartPoint, setActiveChartPoint] = useState(null);

  useEffect(() => {
    fetchAnalyticsData();
    fetchOrdersData();
    loadAdminSlides();
    fetchStaffList();
  }, []);

  useEffect(() => {
    setBrandingForm(prev => ({
      ...prev,
      store_name: settings.store_name || prev.store_name,
      store_tagline: settings.store_tagline || prev.store_tagline,
      store_logo_url: settings.store_logo_url || prev.store_logo_url,
      store_phone: settings.store_phone || prev.store_phone,
      store_email: settings.store_email || prev.store_email,
      store_address: settings.store_address || prev.store_address,
      store_facebook: settings.store_facebook || prev.store_facebook,
      store_messenger: settings.store_messenger || prev.store_messenger
    }));
  }, [settings]);

  // Adjust active tab if restricted for switched role
  useEffect(() => {
    if (currentRole === 'staff' && (activeTab === 'analytics' || activeTab === 'staff' || activeTab === 'branding' || activeTab === 'slideshow')) {
      setActiveTab('orders');
    } else if (currentRole === 'manager' && (activeTab === 'analytics' || activeTab === 'staff' || activeTab === 'branding')) {
      setActiveTab('products');
    }
  }, [currentRole]);

  const fetchStaffList = async () => {
    try {
      const res = await fetch('/api/staff');
      const data = await res.json();
      if (data.success && data.staff) {
        setStaffList(data.staff);
      }
    } catch (err) {
      console.error('Error fetching staff list:', err);
    }
  };

  const loadAdminSlides = async () => {
    try {
      const res = await fetch('/api/slides?all=true');
      const data = await res.json();
      if (data.success && data.slides) {
        setAdminSlides(data.slides);
      }
    } catch (err) {
      console.error('Error fetching admin slides:', err);
    }
  };

  const fetchAnalyticsData = async () => {
    try {
      const res = await fetch('/api/analytics');
      const data = await res.json();
      if (data.success) {
        setAnalytics(data);
      }
    } catch (err) {
      console.error('Error fetching analytics:', err);
    }
  };

  const fetchOrdersData = async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  };

  // Dynamic Category / Catalog Handlers
  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) {
      showToast('Category name is required', 'error');
      return;
    }
    setIsCategorySaving(true);
    try {
      const url = editingCategory ? `/api/categories/${editingCategory.id}` : '/api/categories';
      const method = editingCategory ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryForm)
      });
      const data = await res.json();
      if (data.success) {
        showToast(editingCategory ? 'Category updated successfully!' : '🎉 New Catalog category created!', 'success');
        setEditingCategory(null);
        setCategoryForm({ name: '', slug: '', icon: '📦', description: '', display_order: 0 });
        fetchCategories();
        fetchProducts();
      } else {
        showToast(data.message || 'Error saving category', 'error');
      }
    } catch (err) {
      showToast('Network error saving category', 'error');
    } finally {
      setIsCategorySaving(false);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this catalog category? Products will be safely reassigned.')) return;
    try {
      const res = await fetch(`/api/categories/${categoryId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast('Catalog category deleted successfully', 'info');
        fetchCategories();
        fetchProducts();
      } else {
        showToast(data.message || 'Error deleting category', 'error');
      }
    } catch (err) {
      showToast('Network error deleting category', 'error');
    }
  };

  // Product Image File Browser & Drag-and-Drop Upload Handler
  const handleProductImageUpload = async (inputOrFile) => {
    let file = null;
    if (inputOrFile instanceof File) {
      file = inputOrFile;
    } else if (inputOrFile?.target?.files?.[0]) {
      file = inputOrFile.target.files[0];
    }
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (PNG, JPG, WEBP, SVG)', 'error');
      return;
    }

    setIsUploadingProductImage(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success && data.url) {
        setProductForm(prev => ({ ...prev, image: data.url }));
        showToast('✨ Product image uploaded directly from computer!', 'success');
      } else {
        showToast(data.message || 'Image upload failed', 'error');
      }
    } catch (err) {
      showToast('Error uploading product image', 'error');
    } finally {
      setIsUploadingProductImage(false);
    }
  };

  // Product CRUD Operations with Zero-Latency Optimistic UI Sync
  const handleSaveProduct = async (e) => {
    if (e) e.preventDefault();
    if (!productForm.name || !productForm.price) {
      showToast('Product name and retail price are required', 'error');
      return;
    }

    try {
      const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const payload = {
        ...productForm,
        images: [productForm.image || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800']
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        showToast(editingProduct ? '✨ Product details updated!' : '🎉 New product added to inventory!', 'success');
        
        // Optimistic State Update: instantly reflect in catalog without page reload
        if (data.product) {
          const categoryObj = categories.find(c => c.id === data.product.category_id);
          const enrichedProduct = {
            ...data.product,
            category_name: categoryObj?.name || 'Import Gear',
            category_slug: categoryObj?.slug || 'all'
          };
          if (editingProduct) {
            setProducts(prev => prev.map(p => p.id === data.product.id ? { ...p, ...enrichedProduct } : p));
          } else {
            setProducts(prev => [enrichedProduct, ...prev]);
          }
        }

        setIsProductModalOpen(false);
        setEditingProduct(null);
        setProductFormStep(1);
        fetchProducts(); // background sync
      } else {
        showToast(data.message || 'Error saving product', 'error');
      }
    } catch (err) {
      showToast('Network error saving product', 'error');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to remove this product from the catalog?')) return;
    try {
      const res = await fetch(`/api/products/${productId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast('Product removed from inventory', 'info');
        fetchProducts();
      }
    } catch (err) {
      showToast('Error deleting product', 'error');
    }
  };

  const handleQuickStockUpdate = async (productId, delta) => {
    const target = products.find(p => p.id === productId);
    if (!target) return;
    const newStock = Math.max(0, (target.stock || 0) + delta);

    // Optimistic UI update
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, stock: newStock } : p));

    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock: newStock })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Stock updated: ${target.name} (${newStock} units)`, 'success');
      } else {
        // Rollback on failure
        fetchProducts();
        showToast('Failed to sync stock update', 'error');
      }
    } catch (err) {
      fetchProducts();
      showToast('Error updating stock', 'error');
    }
  };

  // Staff Management Handlers
  const handleSaveStaff = async (e) => {
    e.preventDefault();
    try {
      const url = editingStaff ? `/api/staff/${editingStaff.id}` : '/api/staff';
      const method = editingStaff ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(staffForm)
      });

      const data = await res.json();
      if (data.success) {
        showToast(editingStaff ? 'Staff profile updated!' : 'New staff member added!', 'success');
        setIsStaffModalOpen(false);
        setEditingStaff(null);
        fetchStaffList();
      } else {
        showToast(data.message || 'Error saving staff member', 'error');
      }
    } catch (err) {
      showToast('Network error saving staff', 'error');
    }
  };

  const handleDeleteStaff = async (staffId) => {
    if (!window.confirm('Are you sure you want to remove this staff member?')) return;
    try {
      const res = await fetch(`/api/staff/${staffId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast('Staff member removed successfully', 'info');
        fetchStaffList();
      } else {
        showToast(data.message || 'Cannot delete staff member', 'error');
      }
    } catch (err) {
      showToast('Error deleting staff member', 'error');
    }
  };

  const handleToggleStaffStatus = async (staff) => {
    try {
      const res = await fetch(`/api/staff/${staff.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !staff.is_active })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Staff member ${staff.is_active ? 'deactivated' : 'activated'}`, 'info');
        fetchStaffList();
      }
    } catch (err) {
      showToast('Error updating status', 'error');
    }
  };

  // Branding & Logo Upload Handlers
  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploadingLogo(true);
    const formData = new FormData();
    formData.append('logo', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success && data.url) {
        setBrandingForm(prev => ({ ...prev, store_logo_url: data.url }));
        showToast('Logo uploaded! Click "Save Branding" to apply.', 'success');
      } else {
        showToast(data.message || 'Error uploading logo', 'error');
      }
    } catch (err) {
      showToast('Upload error', 'error');
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleSaveBranding = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(brandingForm)
      });
      const data = await res.json();
      if (data.success) {
        setSettings(prev => ({ ...prev, ...brandingForm }));
        showToast('✨ Store Branding & Logo updated live!', 'success');
      } else {
        showToast('Failed to update branding', 'error');
      }
    } catch (err) {
      showToast('Error saving branding', 'error');
    }
  };

  // Order Status Handler
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Order status updated to: ${newStatus}`, 'success');
        fetchOrdersData();
        fetchAnalyticsData();
      }
    } catch (err) {
      showToast('Error updating order status', 'error');
    }
  };

  // Slideshow Handlers
  const handleSelectProductForSlide = (productId) => {
    const prod = products.find(p => p.id === productId);
    if (!prod) return;

    setSlideForm(prev => ({
      ...prev,
      product_id: prod.id,
      title: prod.name,
      title_km: prod.name,
      subtitle: prod.short_description || prod.description,
      subtitle_km: prod.description,
      image: Array.isArray(prod.images) ? prod.images[0] : prod.image,
      price: prod.price,
      compare_at_price: prod.compare_at_price || '',
      badge: prod.badge || '🔥 FEATURED ITEM'
    }));
  };

  const handleSaveSlide = async (e) => {
    e.preventDefault();
    if (!slideForm.title || !slideForm.image) {
      showToast('Title and image are required', 'error');
      return;
    }

    try {
      const url = editingSlide ? `/api/slides/${editingSlide.id}` : '/api/slides';
      const method = editingSlide ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(slideForm)
      });

      const data = await res.json();
      if (data.success) {
        showToast(editingSlide ? 'Slide updated successfully!' : 'Slide added successfully!', 'success');
        setIsSlideModalOpen(false);
        setEditingSlide(null);
        loadAdminSlides();
        fetchSlides();
      } else {
        showToast(data.message || 'Error saving slide', 'error');
      }
    } catch (err) {
      showToast('Network error saving slide', 'error');
    }
  };

  const handleDeleteSlide = async (slideId) => {
    if (!window.confirm('Are you sure you want to remove this slide?')) return;
    try {
      const res = await fetch(`/api/slides/${slideId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast('Slide deleted successfully', 'info');
        loadAdminSlides();
        fetchSlides();
      }
    } catch (err) {
      showToast('Error deleting slide', 'error');
    }
  };

  const handleMoveSlide = async (index, direction) => {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= adminSlides.length) return;

    const newSlides = [...adminSlides];
    const temp = newSlides[index];
    newSlides[index] = newSlides[targetIdx];
    newSlides[targetIdx] = temp;

    setAdminSlides(newSlides);

    try {
      const slideIds = newSlides.map(s => s.id);
      await fetch('/api/slides/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slideIds })
      });
      fetchSlides();
      showToast('Slides reordered successfully', 'success');
    } catch (err) {
      showToast('Error saving new slide order', 'error');
    }
  };

  const handleSaveSlideshowSettings = async () => {
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slideshow_autoplay_speed: slideshowSettings.autoplay_speed,
          slideshow_transition_effect: slideshowSettings.transition_effect,
          slideshow_is_autoplay: slideshowSettings.is_autoplay ? '1' : '0'
        })
      });
      const data = await res.json();
      if (data.success) {
        setSettings(prev => ({ ...prev, ...data.settings }));
        showToast('⚙️ Slideshow rotation settings updated!', 'success');
      }
    } catch (err) {
      showToast('Error updating settings', 'error');
    }
  };

  // AI Copy Generator
  const handleGenerateAICopy = () => {
    const prod = products.find(p => p.id === selectedProductForAI) || products[0];
    if (!prod) return;

    if (aiPlatform === 'facebook') {
      const copy = language === 'km'
        ? `🔥 ប្រូម៉ូសិនពិសេសពី SR SHOP! នាំចូលផ្ទាល់ពីរោងចក្រ គុណភាពល្អឥតខ្ចោះ 💯\n\n⭐ ${prod.name}\n👉 ${prod.description || prod.short_description}\n\n💥 តម្លៃពិសេសត្រឹមតែ៖ $${prod.price} (ពីមុន $${prod.compare_at_price || (prod.price * 1.5).toFixed(2)})\n🚚 ដឹកជញ្ជូនរហ័សទូទាំង 25 ខេត្ត/ក្រុង\n\n📲 ទំនាក់ទំនងកុម្ម៉ង់ទិញឥឡូវនេះ៖\n• តេឡេក្រាម៖ @SIYEANLONG\n• ទូរស័ព្ទ៖ ${settings.store_phone || '098 33 47 55'}\n• ទីតាំង៖ ${settings.store_address}\n#SRSHOP #គ្រឿងអេឡិចត្រូនិក #ទំនិញគុណភាព`
        : `🔥 HOT FACTORY IMPORT DEALS AT SR SHOP! 💯\n\n⭐ ${prod.name}\n👉 ${prod.description || prod.short_description}\n\n💥 Special Promo Price: $${prod.price} (Was $${prod.compare_at_price || (prod.price * 1.5).toFixed(2)})\n🚚 Fast Express Delivery Across Cambodia\n\n📲 Order Now via Direct Chat:\n• Telegram: @SIYEANLONG\n• Phone: ${settings.store_phone || '098 33 47 55'}\n• Address: ${settings.store_address}\n#SRSHOP #CambodiaShopping #DirectImports`;
      setGeneratedAICopy(copy);
    } else if (aiPlatform === 'tiktok') {
      const copy = language === 'km'
        ? `⚡ របស់ល្អត្រូវតែមាន! ${prod.name} នាំចូលផ្ទាល់ពីចិន តម្លៃត្រឹមតែ $${prod.price} ប៉ុណ្ណោះ! 🤩 ចុចឆាតតាមតេឡេក្រាម @SIYEANLONG ឬខល 098 33 47 55 ដឹកដល់ផ្ទះ! #SRSHOP #cambodiatiktok #viralproduct`
        : `⚡ MUST-HAVE DEAL! ${prod.name} direct factory price only $${prod.price}! 🤩 Tap to chat on Telegram @SIYEANLONG or call 098 33 47 55! #SRSHOP #viralgadgets #tiktokmademebuyit`;
      setGeneratedAICopy(copy);
    } else {
      // Telegram Broadcast
      const copy = `📢 ដំណឹងពិសេសពី SR SHOP!\n\n📦 ទំនិញទើបមកដល់ថ្មី: ${prod.name}\n💰 តម្លៃពិសេស: $${prod.price} (សន្សំបាន $${((prod.compare_at_price || prod.price * 1.4) - prod.price).toFixed(2)})\n✅ ធានាគុណភាព 100% នាំចូលពីរោងចក្រផ្ទាល់\n\n👉 កុម្ម៉ង់ទិញភ្លាមៗ: ឆាតមកកាន់ @SIYEANLONG ឬខល ${settings.store_phone || '098 33 47 55'}`;
      setGeneratedAICopy(copy);
    }
    showToast('✨ AI Viral Copy Generated!', 'success');
  };

  const handleCopyAIText = () => {
    if (!generatedAICopy) return;
    navigator.clipboard.writeText(generatedAICopy);
    setIsCopied(true);
    showToast('Copied to clipboard!', 'success');
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Inventory Valuation Metrics
  const totalSKUs = products.length;
  const totalInventoryValue = products.reduce((acc, p) => acc + ((Number(p.price) || 0) * (Number(p.stock) || 0)), 0);
  const totalCostValue = products.reduce((acc, p) => acc + ((Number(p.cost_price) || 0) * (Number(p.stock) || 0)), 0);
  const inStockCount = products.filter(p => (Number(p.stock) || 0) > 10).length;
  const lowStockCount = products.filter(p => (Number(p.stock) || 0) > 0 && (Number(p.stock) || 0) <= 10).length;
  const outOfStockCount = products.filter(p => (Number(p.stock) || 0) === 0).length;

  // Filtered & Sorted Products
  const filteredProducts = products
    .filter(p => {
      const q = productSearch.toLowerCase().trim();
      const matchesSearch = !q || p.name.toLowerCase().includes(q) || (p.description && p.description.toLowerCase().includes(q)) || (p.supplier_info && p.supplier_info.toLowerCase().includes(q));
      const matchesCategory = productCategoryFilter === 'all' || p.category_id === productCategoryFilter || p.category_slug === productCategoryFilter;
      const matchesStock = productStockFilter === 'all'
        ? true
        : productStockFilter === 'in_stock'
          ? (Number(p.stock) || 0) > 10
          : productStockFilter === 'low_stock'
            ? (Number(p.stock) || 0) > 0 && (Number(p.stock) || 0) <= 10
            : (Number(p.stock) || 0) === 0;

      return matchesSearch && matchesCategory && matchesStock;
    })
    .sort((a, b) => {
      if (productSort === 'price-low') return (Number(a.price) || 0) - (Number(b.price) || 0);
      if (productSort === 'price-high') return (Number(b.price) || 0) - (Number(a.price) || 0);
      if (productSort === 'stock-low') return (Number(a.stock) || 0) - (Number(b.stock) || 0);
      if (productSort === 'stock-high') return (Number(b.stock) || 0) - (Number(a.stock) || 0);
      if (productSort === 'margin-high') {
        const marginA = ((Number(a.price) - Number(a.cost_price || 0)) / (Number(a.price) || 1));
        const marginB = ((Number(b.price) - Number(b.cost_price || 0)) / (Number(b.price) || 1));
        return marginB - marginA;
      }
      return 0; // default newest/id order
    });

  // Filtered Orders
  const filteredOrders = orders.filter(o => {
    const matchesStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
    const matchesSearch = o.order_number.toLowerCase().includes(orderSearch.toLowerCase()) || o.customer_name.toLowerCase().includes(orderSearch.toLowerCase()) || (o.customer_phone && o.customer_phone.includes(orderSearch));
    return matchesStatus && matchesSearch;
  });

  const m = analytics ? analytics.metrics : { totalRevenue: 0, totalCost: 0, totalProfit: 0, profitMargin: 0, orderCount: 0 };

  // Role permissions config
  const navItems = [
    { id: 'analytics', label: 'Financial KPIs & Profits', icon: <TrendingUp size={18} />, allowed: ['admin'], badge: 'CONFIDENTIAL' },
    { id: 'products', label: 'Inventory & Catalog', icon: <Package size={18} />, allowed: ['admin', 'manager', 'staff'], count: products.length },
    { id: 'orders', label: 'Orders & Waybills', icon: <ShoppingCart size={18} />, allowed: ['admin', 'manager', 'staff'], count: orders.length },
    { id: 'slideshow', label: 'Slideshow Manager', icon: <Film size={18} />, allowed: ['admin', 'manager'], count: adminSlides.length },
    { id: 'ai-copy', label: 'AI Copywriter', icon: <Bot size={18} />, allowed: ['admin', 'manager'] },
    { id: 'staff', label: 'Staff & Team (RBAC)', icon: <Users size={18} />, allowed: ['admin'], count: staffList.length },
    { id: 'branding', label: 'Store Branding & Logo', icon: <Palette size={18} />, allowed: ['admin'] }
  ];

  const filteredNav = navItems.filter(item => item.allowed.includes(currentRole));

  // Chart Data Points (Simulated 7-Day Trend)
  const chartPoints = [
    { day: 'Mon', rev: 110, cost: 45, profit: 65, x: 50, yRev: 115, yCost: 140 },
    { day: 'Tue', rev: 145, cost: 58, profit: 87, x: 150, yRev: 95, yCost: 130 },
    { day: 'Wed', rev: 180, cost: 72, profit: 108, x: 250, yRev: 75, yCost: 115 },
    { day: 'Thu', rev: 210, cost: 84, profit: 126, x: 350, yRev: 55, yCost: 100 },
    { day: 'Fri', rev: 260, cost: 102, profit: 158, x: 450, yRev: 40, yCost: 85 },
    { day: 'Sat', rev: 310, cost: 118, profit: 192, x: 550, yRev: 30, yCost: 75 },
    { day: 'Sun', rev: 380, cost: 140, profit: 240, x: 650, yRev: 20, yCost: 65 }
  ];

  // Quick Preset Badge Options
  const badgePresets = ['🔥 #1 BESTSELLER', '⚡ FLASH DEAL', '✨ FACTORY DIRECT', '🚗 TOP AUTO GEAR', '🛠️ PRO HARDWARE', '⚡ SMART TECH'];

  return (
    <div style={{ display: 'flex', minHeight: '85vh', gap: '1.5rem', padding: '1.5rem 0' }}>
      
      {/* 🧭 MODERN EXECUTIVE SIDEBAR */}
      <aside style={{
        width: isSidebarCollapsed ? '75px' : '280px',
        flexShrink: 0,
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-xl)',
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'width 0.25s ease'
      }}>
        
        <div>
          {/* Brand Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
            {!isSidebarCollapsed && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                {settings.store_logo_url ? (
                  <img src={settings.store_logo_url} alt="Store Logo" style={{ height: '32px', maxWidth: '90px', objectFit: 'contain' }} />
                ) : (
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#fff', fontSize: '0.85rem' }}>
                    SR
                  </div>
                )}
                <div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 900, color: 'var(--text-primary)' }}>{settings.store_name || 'SR SHOP'}</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--accent-primary)', fontWeight: 700 }}>RESELLER PORTAL</div>
                </div>
              </div>
            )}

            <button
              onClick={() => setIsSidebarCollapsed(prev => !prev)}
              className="btn-icon"
              style={{ width: '28px', height: '28px', margin: isSidebarCollapsed ? '0 auto' : '0' }}
              title="Toggle Sidebar"
            >
              <Menu size={15} />
            </button>
          </div>

          {/* Current Active Staff Profile Card */}
          {!isSidebarCollapsed && (
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              padding: '0.75rem',
              marginBottom: '1.25rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'var(--accent-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  overflow: 'hidden'
                }}>
                  {currentRole === 'admin' ? '👑' : currentRole === 'manager' ? '👔' : '👷'}
                </div>
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {currentRole === 'admin' ? 'Siyean Long (Owner)' : currentRole === 'manager' ? 'Dara Rath (Manager)' : 'Bopha Pich (Staff)'}
                  </div>
                  <span style={{
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    color: currentRole === 'admin' ? '#10b981' : currentRole === 'manager' ? '#818cf8' : '#f59e0b'
                  }}>
                    ● {currentRole.toUpperCase()} ACCESS
                  </span>
                </div>
              </div>

              {/* Role Simulation Switcher */}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.45rem', marginTop: '0.35rem' }}>
                <label style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>
                  Simulate Role Permissions:
                </label>
                <select
                  value={currentRole}
                  onChange={(e) => {
                    const r = e.target.value;
                    setCurrentRole(r);
                    showToast(`Switched view to ${r.toUpperCase()} perspective`, 'info');
                  }}
                  style={{
                    width: '100%',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-primary)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '0.3rem 0.5rem',
                    borderRadius: '4px',
                    outline: 'none'
                  }}
                >
                  <option value="admin">👑 Store Owner (Admin)</option>
                  <option value="manager">👔 Store Manager</option>
                  <option value="staff">👷 Fulfillment Staff</option>
                </select>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {filteredNav.map(item => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: isSidebarCollapsed ? 'center' : 'space-between',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    background: isActive ? 'var(--accent-primary)' : 'transparent',
                    color: isActive ? '#ffffff' : 'var(--text-secondary)',
                    border: 'none',
                    fontWeight: isActive ? 800 : 600,
                    fontSize: '0.84rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  title={item.label}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    {item.icon}
                    {!isSidebarCollapsed && <span>{item.label}</span>}
                  </div>

                  {!isSidebarCollapsed && (
                    <>
                      {item.badge && (
                        <span style={{ fontSize: '0.62rem', background: 'rgba(255,255,255,0.2)', padding: '2px 6px', borderRadius: '4px', fontWeight: 800 }}>
                          {item.badge}
                        </span>
                      )}
                      {item.count !== undefined && (
                        <span style={{ fontSize: '0.72rem', background: isActive ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.06)', padding: '2px 7px', borderRadius: 'var(--radius-full)' }}>
                          {item.count}
                        </span>
                      )}
                    </>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {!isSidebarCollapsed && (
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.85rem', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            <div>SR SHOP Reseller Suite</div>
            <div style={{ color: 'var(--accent-primary)', marginTop: '2px' }}>Hotline: {settings.store_phone || '098 33 47 55'}</div>
          </div>
        )}

      </aside>

      {/* 🖥️ MAIN WORKSPACE */}
      <main style={{ flex: 1, minWidth: 0 }}>
        
        {/* Top Header Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.5rem',
          padding: '1rem 1.5rem',
          background: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-color)'
        }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--text-primary)' }}>
              {navItems.find(n => n.id === activeTab)?.label || 'Reseller Workspace'}
            </h2>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Executive Management • {settings.store_name} ({settings.store_phone})
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span className="badge badge-sale" style={{ fontSize: '0.75rem' }}>
              ● LIVE CLOUD DB
            </span>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
          </div>
        </div>

        {/* 1. FINANCIAL KPIS & PROFIT CHARTS (Admin Only) */}
        {activeTab === 'analytics' && currentRole === 'admin' && (
          <div className="animate-fade-in">
            
            {/* Luminous Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
              
              <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', borderLeft: '4px solid #6366f1' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800 }}>Gross Retail Inflow</div>
                <div style={{ fontSize: '1.85rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '0.35rem' }}>{formatPrice(m.totalRevenue)}</div>
                <div style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '0.25rem' }}>↑ Inflow from verified customer orders</div>
              </div>

              <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', borderLeft: '4px solid #f59e0b' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800 }}>China Sourcing COGS</div>
                <div style={{ fontSize: '1.85rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '0.35rem' }}>{formatPrice(m.totalCost)}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Wholesale China Factory Costs</div>
              </div>

              <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', borderLeft: '4px solid #10b981' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800 }}>Net Gross Profit</div>
                <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#10b981', marginTop: '0.35rem' }}>+{formatPrice(m.totalProfit)}</div>
                <div style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '0.25rem' }}>Realized Net Reseller Margin</div>
              </div>

              <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', borderLeft: '4px solid #06b6d4' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800 }}>Average Margin %</div>
                <div style={{ fontSize: '1.85rem', fontWeight: 900, color: 'var(--accent-secondary)', marginTop: '0.35rem' }}>{m.profitMargin}%</div>
                <div style={{ fontSize: '0.75rem', color: '#06b6d4', marginTop: '0.25rem' }}>Markup percentage</div>
              </div>

            </div>

            {/* Interactive SVG Trend Chart & Category Breakdown */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              
              {/* SVG Trend Visualizer */}
              <div className="glass-panel" style={{ padding: '1.75rem', borderRadius: 'var(--radius-xl)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>📈 7-Day Revenue & Profit Trajectory</h3>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Hover data points to inspect daily performance</div>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.78rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--accent-primary)', fontWeight: 700 }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-primary)' }} /> Revenue
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#10b981', fontWeight: 700 }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} /> Net Profit
                    </span>
                  </div>
                </div>

                <div style={{ width: '100%', height: '170px', position: 'relative' }}>
                  <svg viewBox="0 0 700 160" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                    <defs>
                      <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6366f1" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    <line x1="30" y1="30" x2="670" y2="30" stroke="rgba(255,255,255,0.05)" strokeDasharray="4" />
                    <line x1="30" y1="80" x2="670" y2="80" stroke="rgba(255,255,255,0.05)" strokeDasharray="4" />
                    <line x1="30" y1="130" x2="670" y2="130" stroke="rgba(255,255,255,0.05)" strokeDasharray="4" />

                    <path d="M 50 115 Q 150 95, 250 75 T 450 40 T 650 20 L 650 150 L 50 150 Z" fill="url(#revGrad)" />
                    <path d="M 50 115 Q 150 95, 250 75 T 450 40 T 650 20" fill="none" stroke="#6366f1" strokeWidth="3" />
                    <path d="M 50 135 Q 150 115, 250 95 T 450 65 T 650 45" fill="none" stroke="#10b981" strokeWidth="3" />

                    {chartPoints.map((pt, idx) => (
                      <g
                        key={idx}
                        onMouseEnter={() => setActiveChartPoint(pt)}
                        onMouseLeave={() => setActiveChartPoint(null)}
                        style={{ cursor: 'pointer' }}
                      >
                        <circle cx={pt.x} cy={pt.yRev} r="6" fill="#6366f1" stroke="#ffffff" strokeWidth="2" />
                        <text x={pt.x} y="155" fill="var(--text-muted)" fontSize="11" textAnchor="middle">{pt.day}</text>
                      </g>
                    ))}
                  </svg>

                  {/* Interactive Tooltip on Hover */}
                  {activeChartPoint && (
                    <div style={{
                      position: 'absolute',
                      top: '10px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: 'rgba(15, 23, 42, 0.95)',
                      border: '1px solid var(--accent-primary)',
                      padding: '0.4rem 0.8rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.75rem',
                      display: 'flex',
                      gap: '0.85rem',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
                      zIndex: 10
                    }}>
                      <span><strong>{activeChartPoint.day}</strong></span>
                      <span style={{ color: 'var(--accent-primary)' }}>Rev: ${activeChartPoint.rev}</span>
                      <span style={{ color: '#10b981' }}>Profit: +${activeChartPoint.profit}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Category Margin Breakdown */}
              <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-xl)' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '1rem' }}>🏆 Category Profit Margins</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {[
                    { name: '🚗 Auto Accessories', margin: 68, color: '#6366f1' },
                    { name: '🛠️ Hardware Tools', margin: 62, color: '#10b981' },
                    { name: '⚡ Smart Electronics', margin: 59, color: '#06b6d4' },
                    { name: '✨ Home & Lifestyle', margin: 55, color: '#f59e0b' }
                  ].map((cat, idx) => (
                    <div key={idx}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '3px' }}>
                        <span style={{ fontWeight: 600 }}>{cat.name}</span>
                        <span style={{ fontWeight: 800, color: cat.color }}>{cat.margin}% margin</span>
                      </div>
                      <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${cat.margin}%`, height: '100%', background: cat.color, borderRadius: '3px' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* 2. INVENTORY & PRODUCT CATALOG MANAGEMENT (COMPLETELY REDESIGNED) */}
        {activeTab === 'products' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Real-time Inventory Valuation & Metrics Ribbon */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div className="glass-panel" style={{ padding: '1.1rem 1.25rem', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', gap: '0.85rem', borderLeft: '4px solid var(--accent-primary)' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)' }}>
                  <Box size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Active Catalog SKUs</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1.1 }}>{totalSKUs} Items</div>
                </div>
              </div>

              <div className="glass-panel" style={{ padding: '1.1rem 1.25rem', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', gap: '0.85rem', borderLeft: '4px solid #10b981' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                  <DollarSign size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Inventory Valuation (Retail)</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#10b981', lineHeight: 1.1 }}>{formatPrice(totalInventoryValue)}</div>
                </div>
              </div>

              {currentRole === 'admin' && (
                <div className="glass-panel" style={{ padding: '1.1rem 1.25rem', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', gap: '0.85rem', borderLeft: '4px solid #f59e0b' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b' }}>
                    <Truck size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>China Wholesale COGS</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1.1 }}>{formatPrice(totalCostValue)}</div>
                  </div>
                </div>
              )}

              <div className="glass-panel" style={{ padding: '1.1rem 1.25rem', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', gap: '0.85rem', borderLeft: '4px solid #06b6d4' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(6, 182, 212, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#06b6d4' }}>
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Stock Health Ratio</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
                    <span style={{ color: '#10b981' }}>{inStockCount} In Stock</span> • <span style={{ color: '#f59e0b' }}>{lowStockCount} Low</span> • <span style={{ color: '#ef4444' }}>{outOfStockCount} Out</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Interactive Catalog Board */}
            <div className="glass-panel" style={{ padding: '1.75rem', borderRadius: 'var(--radius-xl)' }}>
              
              {/* Header & Primary CTA */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Package size={22} color="var(--accent-primary)" />
                    <span>Inventory & Product Catalog</span>
                  </h3>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    Manage pricing, factory sourcing costs, stock allocations, and supplier origin tracking.
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {/* View Mode Toggle */}
                  <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', padding: '3px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                    <button
                      onClick={() => setProductViewMode('table')}
                      style={{
                        padding: '0.35rem 0.65rem',
                        borderRadius: 'var(--radius-sm)',
                        background: productViewMode === 'table' ? 'var(--accent-primary)' : 'transparent',
                        color: productViewMode === 'table' ? '#fff' : 'var(--text-muted)',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        fontSize: '0.78rem',
                        fontWeight: 700
                      }}
                      title="Compact Table Grid"
                    >
                      <List size={14} />
                      <span>Table</span>
                    </button>
                    <button
                      onClick={() => setProductViewMode('grid')}
                      style={{
                        padding: '0.35rem 0.65rem',
                        borderRadius: 'var(--radius-sm)',
                        background: productViewMode === 'grid' ? 'var(--accent-primary)' : 'transparent',
                        color: productViewMode === 'grid' ? '#fff' : 'var(--text-muted)',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        fontSize: '0.78rem',
                        fontWeight: 700
                      }}
                      title="Card Gallery View"
                    >
                      <Grid size={14} />
                      <span>Cards</span>
                    </button>
                  </div>

                  {(currentRole === 'admin' || currentRole === 'manager') && (
                    <div style={{ display: 'flex', gap: '0.65rem' }}>
                      <button
                        onClick={() => {
                          setEditingCategory(null);
                          setCategoryForm({ name: '', slug: '', icon: '📦', description: '', display_order: categories.length + 1 });
                          setIsCategoryModalOpen(true);
                        }}
                        className="btn-secondary"
                        style={{ padding: '0.65rem 1.15rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}
                        title="Manage Categories & Catalogs"
                      >
                        <Layers size={16} color="var(--accent-primary)" />
                        <span>Manage Catalogs</span>
                      </button>

                      <button
                        onClick={() => {
                          setEditingProduct(null);
                          setProductForm({
                            name: '',
                            category_id: categories[0]?.id || 'cat_auto',
                            description: '',
                            short_description: '',
                            cost_price: '',
                            price: '',
                            compare_at_price: '',
                            stock: 20,
                            badge: '🔥 HOT IMPORT',
                            image: '',
                            supplier_info: ''
                          });
                          setIsProductModalOpen(true);
                        }}
                        className="btn-primary"
                        style={{ padding: '0.65rem 1.25rem', fontSize: '0.85rem' }}
                      >
                        <Plus size={16} />
                        <span>Add New Product</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Dynamic Filter & Sorter Toolbar */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
                
                {/* Search Bar & Sorter Controls */}
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  
                  {/* Search Input */}
                  <div style={{ position: 'relative', flex: '1 1 260px' }}>
                    <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="text"
                      placeholder="Search by product name, SKU, or supplier..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      style={{
                        width: '100%',
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-primary)',
                        padding: '0.55rem 0.85rem 0.55rem 2.2rem',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.84rem',
                        outline: 'none'
                      }}
                    />
                    {productSearch && (
                      <button
                        onClick={() => setProductSearch('')}
                        style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                      >
                        <X size={13} />
                      </button>
                    )}
                  </div>

                  {/* Stock Status Selector */}
                  <select
                    value={productStockFilter}
                    onChange={(e) => setProductStockFilter(e.target.value)}
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-primary)',
                      padding: '0.55rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      outline: 'none'
                    }}
                  >
                    <option value="all">📦 All Stock Levels</option>
                    <option value="in_stock">🟢 In Stock (&gt;10)</option>
                    <option value="low_stock">🟡 Low Stock Alert (1-10)</option>
                    <option value="out_of_stock">🔴 Out of Stock (0)</option>
                  </select>

                  {/* Dynamic Sorting */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '0.2rem 0.65rem' }}>
                    <ArrowUpDown size={14} color="var(--text-muted)" />
                    <select
                      value={productSort}
                      onChange={(e) => setProductSort(e.target.value)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-primary)',
                        padding: '0.35rem 0',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        outline: 'none'
                      }}
                    >
                      <option value="newest">Sort: Newest First</option>
                      <option value="price-low">Sort: Price (Low → High)</option>
                      <option value="price-high">Sort: Price (High → Low)</option>
                      <option value="stock-low">Sort: Stock (Low → High)</option>
                      <option value="stock-high">Sort: Stock (High → Low)</option>
                      {currentRole === 'admin' && <option value="margin-high">Sort: Margin % (Highest)</option>}
                    </select>
                  </div>

                </div>

                {/* Category Horizontal Filter Pills */}
                <div style={{ display: 'flex', gap: '0.45rem', overflowX: 'auto', paddingBottom: '2px' }}>
                  <button
                    onClick={() => setProductCategoryFilter('all')}
                    style={{
                      padding: '0.35rem 0.8rem',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      background: productCategoryFilter === 'all' ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)',
                      color: productCategoryFilter === 'all' ? '#fff' : 'var(--text-secondary)',
                      border: '1px solid',
                      borderColor: productCategoryFilter === 'all' ? 'var(--accent-primary)' : 'var(--border-color)',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    All Categories ({products.length})
                  </button>

                  {categories.map(c => {
                    const count = products.filter(p => p.category_id === c.id || p.category_slug === c.slug).length;
                    const isSelected = productCategoryFilter === c.id || productCategoryFilter === c.slug;
                    return (
                      <button
                        key={c.id}
                        onClick={() => setProductCategoryFilter(c.id)}
                        style={{
                          padding: '0.35rem 0.8rem',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          background: isSelected ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)',
                          color: isSelected ? '#fff' : 'var(--text-secondary)',
                          border: '1px solid',
                          borderColor: isSelected ? 'var(--accent-primary)' : 'var(--border-color)',
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {c.name} ({count})
                      </button>
                    );
                  })}
                </div>

              </div>

              {/* No Results Fallback */}
              {filteredProducts.length === 0 && (
                <div style={{ textAlign: 'center', padding: '3.5rem 1rem', background: 'rgba(255,255,255,0.01)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border-color)' }}>
                  <Package size={36} color="var(--text-muted)" style={{ margin: '0 auto 0.75rem auto' }} />
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>No Products Found Matching Query</div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.25rem', maxWidth: '380px', margin: '0.25rem auto 1.25rem auto' }}>
                    Try changing your category filter, adjusting search keywords, or clearing stock health filters.
                  </p>
                  <button
                    onClick={() => { setProductSearch(''); setProductCategoryFilter('all'); setProductStockFilter('all'); }}
                    className="btn-secondary btn-sm"
                  >
                    Reset All Filters
                  </button>
                </div>
              )}

              {/* VIEW MODE 1: COMPACT DATA TABLE GRID */}
              {filteredProducts.length > 0 && productViewMode === 'table' && (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.76rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        <th style={{ padding: '0.85rem 1rem' }}>Product Item</th>
                        <th style={{ padding: '0.85rem 1rem' }}>Category</th>
                        {currentRole === 'admin' && <th style={{ padding: '0.85rem 1rem' }}>Wholesale COGS</th>}
                        <th style={{ padding: '0.85rem 1rem' }}>Retail Price</th>
                        {currentRole === 'admin' && <th style={{ padding: '0.85rem 1rem' }}>Gross Margin</th>}
                        <th style={{ padding: '0.85rem 1rem' }}>Stock Status</th>
                        <th style={{ padding: '0.85rem 1rem' }}>Quick Stock</th>
                        {(currentRole === 'admin' || currentRole === 'manager') && <th style={{ padding: '0.85rem 1rem' }}>Actions</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map(p => {
                        const isLowStock = p.stock > 0 && p.stock <= 10;
                        const isOutOfStock = p.stock === 0;
                        const unitProfit = Number(p.price) - Number(p.cost_price || 0);
                        const marginPct = ((unitProfit / (Number(p.price) || 1)) * 100).toFixed(1);

                        return (
                          <tr
                            key={p.id}
                            style={{
                              borderBottom: '1px solid var(--border-color)',
                              fontSize: '0.85rem',
                              transition: 'background 0.15s ease'
                            }}
                            className="table-row-hover"
                          >
                            {/* Product Info */}
                            <td style={{ padding: '0.85rem 1rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{ position: 'relative', width: '42px', height: '42px', flexShrink: 0 }}>
                                  <img
                                    src={Array.isArray(p.images) ? p.images[0] : p.image}
                                    alt=""
                                    style={{
                                      width: '100%',
                                      height: '100%',
                                      objectFit: 'cover',
                                      borderRadius: '8px',
                                      border: '1px solid var(--border-color)'
                                    }}
                                  />
                                </div>
                                <div style={{ minWidth: 0 }}>
                                  <div style={{ fontWeight: 800, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '240px' }}>
                                    {p.name}
                                  </div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '2px' }}>
                                    {p.badge && (
                                      <span className="badge badge-sale" style={{ fontSize: '0.62rem', padding: '1px 5px' }}>
                                        {p.badge}
                                      </span>
                                    )}
                                    {p.supplier_info && (
                                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '140px' }}>
                                        🏭 {p.supplier_info}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Category */}
                            <td style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
                              <span style={{ background: 'rgba(255,255,255,0.04)', padding: '0.25rem 0.55rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                                {p.category_name || 'Import Gear'}
                              </span>
                            </td>

                            {/* Wholesale COGS */}
                            {currentRole === 'admin' && (
                              <td style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                                {formatPrice(p.cost_price)}
                              </td>
                            )}

                            {/* Retail Price */}
                            <td style={{ padding: '0.85rem 1rem' }}>
                              <div style={{ fontWeight: 800, color: 'var(--accent-primary)', fontSize: '0.92rem' }}>
                                {formatPrice(p.price)}
                              </div>
                              {p.compare_at_price && (
                                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                                  {formatPrice(p.compare_at_price)}
                                </div>
                              )}
                            </td>

                            {/* Margin % */}
                            {currentRole === 'admin' && (
                              <td style={{ padding: '0.85rem 1rem' }}>
                                <span style={{
                                  fontSize: '0.75rem',
                                  fontWeight: 800,
                                  color: marginPct >= 40 ? '#10b981' : marginPct >= 20 ? '#f59e0b' : '#ef4444'
                                }}>
                                  +{formatPrice(unitProfit)} ({marginPct}%)
                                </span>
                              </td>
                            )}

                            {/* Stock Health Status */}
                            <td style={{ padding: '0.85rem 1rem' }}>
                              {isOutOfStock ? (
                                <span style={{ fontSize: '0.72rem', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '0.2rem 0.55rem', borderRadius: 'var(--radius-full)', fontWeight: 800 }}>
                                  🔴 Out of Stock
                                </span>
                              ) : isLowStock ? (
                                <span style={{ fontSize: '0.72rem', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '0.2rem 0.55rem', borderRadius: 'var(--radius-full)', fontWeight: 800 }}>
                                  🟡 Low: {p.stock} Left
                                </span>
                              ) : (
                                <span style={{ fontSize: '0.72rem', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '0.2rem 0.55rem', borderRadius: 'var(--radius-full)', fontWeight: 800 }}>
                                  🟢 In Stock ({p.stock})
                                </span>
                              )}
                            </td>

                            {/* Quick Stepper */}
                            <td style={{ padding: '0.85rem 1rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                <button
                                  onClick={() => handleQuickStockUpdate(p.id, -5)}
                                  className="btn-icon"
                                  style={{ width: '26px', height: '26px', fontSize: '0.74rem', fontWeight: 800 }}
                                  title="Decrease by 5 units"
                                >
                                  -5
                                </button>
                                <span style={{ fontWeight: 900, minWidth: '32px', textAlign: 'center', fontSize: '0.86rem' }}>
                                  {p.stock}
                                </span>
                                <button
                                  onClick={() => handleQuickStockUpdate(p.id, 5)}
                                  className="btn-icon"
                                  style={{ width: '26px', height: '26px', fontSize: '0.74rem', fontWeight: 800 }}
                                  title="Increase by 5 units"
                                >
                                  +5
                                </button>
                              </div>
                            </td>

                            {/* Action Buttons */}
                            {(currentRole === 'admin' || currentRole === 'manager') && (
                              <td style={{ padding: '0.85rem 1rem' }}>
                                <div style={{ display: 'flex', gap: '0.45rem' }}>
                                  <button
                                    onClick={() => {
                                      setEditingProduct(p);
                                      setProductForm({
                                        name: p.name,
                                        category_id: p.category_id,
                                        description: p.description || '',
                                        short_description: p.short_description || '',
                                        cost_price: p.cost_price || '',
                                        price: p.price,
                                        compare_at_price: p.compare_at_price || '',
                                        stock: p.stock,
                                        badge: p.badge || '',
                                        image: Array.isArray(p.images) ? p.images[0] : p.image,
                                        supplier_info: p.supplier_info || ''
                                      });
                                      setIsProductModalOpen(true);
                                    }}
                                    className="btn-icon"
                                    style={{ width: '30px', height: '30px' }}
                                    title="Edit Product"
                                  >
                                    <Edit2 size={13} />
                                  </button>

                                  {currentRole === 'admin' && (
                                    <button
                                      onClick={() => handleDeleteProduct(p.id)}
                                      className="btn-icon"
                                      style={{ width: '30px', height: '30px', color: 'var(--danger)' }}
                                      title="Delete Product"
                                    >
                                      <Trash2 size={13} />
                                    </button>
                                  )}
                                </div>
                              </td>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* VIEW MODE 2: CARD GALLERY VIEW */}
              {filteredProducts.length > 0 && productViewMode === 'grid' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem' }}>
                  {filteredProducts.map(p => {
                    const isLowStock = p.stock > 0 && p.stock <= 10;
                    const isOutOfStock = p.stock === 0;

                    return (
                      <div
                        key={p.id}
                        style={{
                          background: 'var(--bg-secondary)',
                          border: '1px solid var(--border-color)',
                          borderRadius: 'var(--radius-lg)',
                          overflow: 'hidden',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          transition: 'transform 0.2s ease, border-color 0.2s ease'
                        }}
                      >
                        <div>
                          {/* Card Image */}
                          <div style={{ position: 'relative', height: '140px', background: 'rgba(0,0,0,0.2)' }}>
                            <img
                              src={Array.isArray(p.images) ? p.images[0] : p.image}
                              alt=""
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            {p.badge && (
                              <div style={{ position: 'absolute', top: '8px', left: '8px' }}>
                                <span className="badge badge-sale" style={{ fontSize: '0.65rem' }}>{p.badge}</span>
                              </div>
                            )}
                            <div style={{ position: 'absolute', bottom: '8px', right: '8px' }}>
                              {isOutOfStock ? (
                                <span style={{ fontSize: '0.65rem', background: '#ef4444', color: '#fff', padding: '2px 6px', borderRadius: '4px', fontWeight: 800 }}>Out of Stock</span>
                              ) : isLowStock ? (
                                <span style={{ fontSize: '0.65rem', background: '#f59e0b', color: '#000', padding: '2px 6px', borderRadius: '4px', fontWeight: 800 }}>Low: {p.stock} Left</span>
                              ) : (
                                <span style={{ fontSize: '0.65rem', background: '#10b981', color: '#fff', padding: '2px 6px', borderRadius: '4px', fontWeight: 800 }}>In Stock ({p.stock})</span>
                              )}
                            </div>
                          </div>

                          {/* Card Content */}
                          <div style={{ padding: '1rem' }}>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                              {p.category_name || 'Import Gear'}
                            </div>
                            <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '0.92rem', margin: '3px 0 0.5rem 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                              {p.name}
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '0.5rem' }}>
                              <div>
                                <span style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--accent-primary)' }}>{formatPrice(p.price)}</span>
                                {p.compare_at_price && (
                                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textDecoration: 'line-through', marginLeft: '6px' }}>{formatPrice(p.compare_at_price)}</span>
                                )}
                              </div>
                              {currentRole === 'admin' && p.cost_price && (
                                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Cost: ${p.cost_price}</span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Card Stepper & Actions Footer */}
                        <div style={{ padding: '0.75rem 1rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.01)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <button onClick={() => handleQuickStockUpdate(p.id, -5)} className="btn-icon" style={{ width: '24px', height: '24px', fontSize: '0.7rem' }}>-5</button>
                            <span style={{ fontWeight: 800, fontSize: '0.8rem', minWidth: '24px', textAlign: 'center' }}>{p.stock}</span>
                            <button onClick={() => handleQuickStockUpdate(p.id, 5)} className="btn-icon" style={{ width: '24px', height: '24px', fontSize: '0.7rem' }}>+5</button>
                          </div>

                          <div style={{ display: 'flex', gap: '0.35rem' }}>
                            <button
                              onClick={() => {
                                setEditingProduct(p);
                                setProductForm({
                                  name: p.name,
                                  category_id: p.category_id,
                                  description: p.description || '',
                                  short_description: p.short_description || '',
                                  cost_price: p.cost_price || '',
                                  price: p.price,
                                  compare_at_price: p.compare_at_price || '',
                                  stock: p.stock,
                                  badge: p.badge || '',
                                  image: Array.isArray(p.images) ? p.images[0] : p.image,
                                  supplier_info: p.supplier_info || ''
                                });
                                setIsProductModalOpen(true);
                              }}
                              className="btn-icon"
                              style={{ width: '28px', height: '28px' }}
                            >
                              <Edit2 size={13} />
                            </button>
                            {currentRole === 'admin' && (
                              <button onClick={() => handleDeleteProduct(p.id)} className="btn-icon" style={{ width: '28px', height: '28px', color: 'var(--danger)' }}>
                                <Trash2 size={13} />
                              </button>
                            )}
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}

            </div>

            {/* COMPLETELY REVAMPED ADD / EDIT PRODUCT STUDIO */}
            {isProductModalOpen && (
              <div className="modal-overlay" onClick={() => setIsProductModalOpen(false)}>
                <div
                  className="modal-content animate-fade-in"
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    maxWidth: '820px',
                    padding: '2.25rem',
                    maxHeight: '92vh',
                    overflowY: 'auto',
                    borderRadius: 'var(--radius-xl)',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-secondary)',
                    boxShadow: '0 25px 60px -12px rgba(0, 0, 0, 0.85)'
                  }}
                >
                  
                  {/* Modal Header & View Mode Switcher */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        background: 'rgba(99, 102, 241, 0.15)',
                        border: '1px solid rgba(99, 102, 241, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--accent-primary)'
                      }}>
                        <PackagePlus size={22} />
                      </div>
                      <div>
                        <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                          {editingProduct ? 'Edit Imported Product' : 'Add New Imported Product'}
                        </h3>
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                          Standardized China factory sourcing, dynamic category assignment & live profit engine
                        </p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      {/* View Mode Toggle: Wizard vs Single Page */}
                      <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', padding: '2px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                        <button
                          type="button"
                          onClick={() => setProductFormViewMode('wizard')}
                          style={{
                            padding: '0.3rem 0.6rem',
                            borderRadius: '4px',
                            background: productFormViewMode === 'wizard' ? 'var(--accent-primary)' : 'transparent',
                            color: productFormViewMode === 'wizard' ? '#fff' : 'var(--text-muted)',
                            border: 'none',
                            fontSize: '0.74rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          Step Wizard
                        </button>
                        <button
                          type="button"
                          onClick={() => setProductFormViewMode('single')}
                          style={{
                            padding: '0.3rem 0.6rem',
                            borderRadius: '4px',
                            background: productFormViewMode === 'single' ? 'var(--accent-primary)' : 'transparent',
                            color: productFormViewMode === 'single' ? '#fff' : 'var(--text-muted)',
                            border: 'none',
                            fontSize: '0.74rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          All Sections
                        </button>
                      </div>

                      <button
                        onClick={() => setIsProductModalOpen(false)}
                        className="btn-icon"
                        style={{ width: '34px', height: '34px' }}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Interactive Stepper Navigation Bar (Wizard Mode) */}
                  {productFormViewMode === 'wizard' && (
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(4, 1fr)',
                      gap: '0.5rem',
                      marginBottom: '1.5rem',
                      background: 'rgba(255,255,255,0.02)',
                      padding: '0.5rem',
                      borderRadius: 'var(--radius-lg)',
                      border: '1px solid var(--border-color)'
                    }}>
                      {[
                        { step: 1, label: '1. Identity', icon: <Tag size={14} />, isComplete: Boolean(productForm.name && productForm.category_id) },
                        { step: 2, label: '2. Media Asset', icon: <ImageIcon size={14} />, isComplete: Boolean(productForm.image) },
                        { step: 3, label: '3. Pricing & Margin', icon: <DollarSign size={14} />, isComplete: Boolean(productForm.price) },
                        { step: 4, label: '4. Stock & Logistics', icon: <Truck size={14} />, isComplete: Boolean(productForm.stock !== '') }
                      ].map(s => {
                        const isActive = productFormStep === s.step;
                        return (
                          <button
                            key={s.step}
                            type="button"
                            onClick={() => setProductFormStep(s.step)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '0.45rem',
                              padding: '0.6rem 0.5rem',
                              borderRadius: 'var(--radius-md)',
                              background: isActive ? 'var(--accent-primary)' : 'rgba(255,255,255,0.03)',
                              color: isActive ? '#fff' : s.isComplete ? 'var(--text-primary)' : 'var(--text-muted)',
                              border: isActive ? '1px solid var(--accent-primary)' : '1px solid var(--border-color)',
                              fontSize: '0.78rem',
                              fontWeight: isActive ? 800 : 600,
                              cursor: 'pointer',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            {s.isComplete && !isActive ? <Check size={13} color="#10b981" /> : s.icon}
                            <span>{s.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  <form onSubmit={handleSaveProduct} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    
                    {/* SECTION 1: PRODUCT IDENTITY & CATEGORY */}
                    {(productFormViewMode === 'single' || productFormStep === 1) && (
                      <div className="animate-fade-in" style={{
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-lg)',
                        padding: '1.35rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1.1rem'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.84rem', fontWeight: 800, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          <Tag size={16} />
                          <span>1. Product Identity & Category Assignment</span>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                          <div>
                            <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.35rem', color: 'var(--text-primary)' }}>
                              Product Title / Name *
                            </label>
                            <input
                              type="text"
                              required
                              value={productForm.name}
                              onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                              placeholder="e.g. 20,000mAh High-Power Car Jump Starter Kit"
                              style={{
                                width: '100%',
                                background: 'var(--bg-card)',
                                border: '1px solid var(--border-color)',
                                color: 'var(--text-primary)',
                                padding: '0.65rem 0.85rem',
                                borderRadius: 'var(--radius-md)',
                                fontSize: '0.88rem',
                                outline: 'none'
                              }}
                            />
                          </div>

                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                                Dynamic Category *
                              </label>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingCategory(null);
                                  setCategoryForm({ name: '', slug: '', icon: '📦', description: '', display_order: categories.length + 1 });
                                  setIsCategoryModalOpen(true);
                                }}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: 'var(--accent-primary)',
                                  fontSize: '0.74rem',
                                  fontWeight: 800,
                                  cursor: 'pointer',
                                  padding: 0
                                }}
                              >
                                + New Catalog
                              </button>
                            </div>
                            <select
                              value={productForm.category_id}
                              onChange={(e) => setProductForm(prev => ({ ...prev, category_id: e.target.value }))}
                              style={{
                                width: '100%',
                                background: 'var(--bg-card)',
                                border: '1px solid var(--border-color)',
                                color: 'var(--text-primary)',
                                padding: '0.65rem 0.85rem',
                                borderRadius: 'var(--radius-md)',
                                fontSize: '0.86rem',
                                outline: 'none'
                              }}
                            >
                              {categories.map(c => (
                                <option key={c.id} value={c.id}>
                                  {c.icon ? `${c.icon} ` : ''}{c.name} ({products.filter(p => p.category_id === c.id || p.category_slug === c.slug).length} items)
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Promotional Badge Tag & Presets */}
                        <div>
                          <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.35rem', color: 'var(--text-primary)' }}>
                            Promotional Badge Tag
                          </label>
                          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                            <input
                              type="text"
                              value={productForm.badge}
                              onChange={(e) => setProductForm(prev => ({ ...prev, badge: e.target.value }))}
                              placeholder="🔥 #1 BESTSELLER"
                              style={{
                                flex: '1 1 200px',
                                background: 'var(--bg-card)',
                                border: '1px solid var(--border-color)',
                                color: 'var(--text-primary)',
                                padding: '0.55rem 0.85rem',
                                borderRadius: 'var(--radius-md)',
                                fontSize: '0.84rem',
                                outline: 'none'
                              }}
                            />
                            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                              {badgePresets.map((preset, idx) => (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => setProductForm(prev => ({ ...prev, badge: preset }))}
                                  style={{
                                    padding: '0.3rem 0.6rem',
                                    borderRadius: 'var(--radius-sm)',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid var(--border-color)',
                                    color: 'var(--text-secondary)',
                                    fontSize: '0.72rem',
                                    fontWeight: 700,
                                    cursor: 'pointer'
                                  }}
                                >
                                  {preset}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* SECTION 2: MEDIA ASSET & DRAG-AND-DROP UPLOADER */}
                    {(productFormViewMode === 'single' || productFormStep === 2) && (
                      <div className="animate-fade-in" style={{
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-lg)',
                        padding: '1.35rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1.1rem'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.84rem', fontWeight: 800, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            <ImageIcon size={16} />
                            <span>2. Product Image & Visual Asset</span>
                          </div>

                          {/* Toggle Mode: Upload vs URL */}
                          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', padding: '2px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                            <button
                              type="button"
                              onClick={() => setProductImageMode('upload')}
                              style={{
                                padding: '0.25rem 0.65rem',
                                borderRadius: '4px',
                                background: productImageMode === 'upload' ? 'var(--accent-primary)' : 'transparent',
                                color: productImageMode === 'upload' ? '#fff' : 'var(--text-muted)',
                                border: 'none',
                                fontSize: '0.74rem',
                                fontWeight: 700,
                                cursor: 'pointer'
                              }}
                            >
                              Browse Computer File
                            </button>
                            <button
                              type="button"
                              onClick={() => setProductImageMode('url')}
                              style={{
                                padding: '0.25rem 0.65rem',
                                borderRadius: '4px',
                                background: productImageMode === 'url' ? 'var(--accent-primary)' : 'transparent',
                                color: productImageMode === 'url' ? '#fff' : 'var(--text-muted)',
                                border: 'none',
                                fontSize: '0.74rem',
                                fontWeight: 700,
                                cursor: 'pointer'
                              }}
                            >
                              Paste Image URL
                            </button>
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '1.25rem', alignItems: 'center' }}>
                          <div>
                            {productImageMode === 'upload' ? (
                              <div>
                                <input
                                  ref={productImageInputRef}
                                  type="file"
                                  accept="image/*"
                                  onChange={handleProductImageUpload}
                                  style={{ display: 'none' }}
                                />
                                <div
                                  onDragOver={(e) => { e.preventDefault(); setIsDraggingFile(true); }}
                                  onDragLeave={() => setIsDraggingFile(false)}
                                  onDrop={(e) => {
                                    e.preventDefault();
                                    setIsDraggingFile(false);
                                    if (e.dataTransfer.files?.[0]) {
                                      handleProductImageUpload(e.dataTransfer.files[0]);
                                    }
                                  }}
                                  onClick={() => productImageInputRef.current?.click()}
                                  style={{
                                    border: isDraggingFile ? '2px dashed var(--accent-primary)' : '2px dashed var(--border-color)',
                                    borderRadius: 'var(--radius-lg)',
                                    padding: '1.75rem 1.25rem',
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    background: isDraggingFile ? 'rgba(99, 102, 241, 0.1)' : 'rgba(255,255,255,0.01)',
                                    transition: 'all 0.2s ease',
                                    boxShadow: isDraggingFile ? '0 0 15px rgba(99, 102, 241, 0.3)' : 'none'
                                  }}
                                >
                                  <Upload size={26} color="var(--accent-primary)" style={{ margin: '0 auto 0.45rem auto' }} />
                                  <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                                    {isUploadingProductImage ? 'Uploading image...' : isDraggingFile ? 'Drop file to upload instantly!' : 'Click to Browse or Drag & Drop File'}
                                  </div>
                                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                                    Supports PNG, JPG, WEBP, SVG files from your desktop (Max 15MB)
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div>
                                <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.35rem', color: 'var(--text-primary)' }}>
                                  High-Resolution Image URL
                                </label>
                                <input
                                  type="text"
                                  value={productForm.image}
                                  onChange={(e) => setProductForm(prev => ({ ...prev, image: e.target.value }))}
                                  placeholder="https://images.unsplash.com/... or /sr-shop-banner.jpg"
                                  style={{
                                    width: '100%',
                                    background: 'var(--bg-card)',
                                    border: '1px solid var(--border-color)',
                                    color: 'var(--text-primary)',
                                    padding: '0.65rem 0.85rem',
                                    borderRadius: 'var(--radius-md)',
                                    fontSize: '0.86rem',
                                    outline: 'none'
                                  }}
                                />
                                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '3px', display: 'block' }}>
                                  Paste image URL or switch to computer file upload.
                                </span>
                              </div>
                            )}

                            {productForm.image && (
                              <div style={{ fontSize: '0.74rem', color: '#10b981', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'rgba(16, 185, 129, 0.08)', padding: '4px 8px', borderRadius: '4px' }}>
                                <Check size={13} />
                                <span style={{ wordBreak: 'break-all', fontWeight: 600 }}>Active Image: {productForm.image}</span>
                              </div>
                            )}
                          </div>

                          {/* Live Photo Preview Box */}
                          <div style={{
                            height: '110px',
                            borderRadius: '10px',
                            border: '1px dashed var(--border-color)',
                            background: 'rgba(0,0,0,0.25)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden',
                            position: 'relative'
                          }}>
                            {productForm.image ? (
                              <img src={productForm.image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textAlign: 'center', padding: '0.5rem' }}>
                                <ImageIcon size={22} style={{ margin: '0 auto 4px auto', display: 'block', opacity: 0.6 }} />
                                <span>Live Preview</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* SECTION 3: PRICING ARCHITECTURE & LIVE PROFIT ENGINE */}
                    {(productFormViewMode === 'single' || productFormStep === 3) && (
                      <div className="animate-fade-in" style={{
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-lg)',
                        padding: '1.35rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1.1rem'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.84rem', fontWeight: 800, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            <DollarSign size={16} />
                            <span>3. Pricing Architecture & Margin Structure</span>
                          </div>

                          {/* Real-time Profit Engine Indicator */}
                          {productForm.price && productForm.cost_price && (
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.65rem',
                              background: 'rgba(16, 185, 129, 0.12)',
                              border: '1px solid rgba(16, 185, 129, 0.3)',
                              padding: '0.3rem 0.85rem',
                              borderRadius: 'var(--radius-full)',
                              fontSize: '0.76rem',
                              fontWeight: 800,
                              color: '#10b981'
                            }}>
                              <span>Net Unit Profit: +${(Number(productForm.price) - Number(productForm.cost_price)).toFixed(2)}</span>
                              <span>({(((Number(productForm.price) - Number(productForm.cost_price)) / Number(productForm.price)) * 100).toFixed(1)}% margin)</span>
                            </div>
                          )}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: currentRole === 'admin' ? '1fr 1fr 1fr' : '1fr 1fr', gap: '1rem' }}>
                          {currentRole === 'admin' && (
                            <div>
                              <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.35rem', color: 'var(--text-primary)' }}>
                                Wholesale Cost (COGS) ($)
                              </label>
                              <input
                                type="number"
                                step="0.01"
                                value={productForm.cost_price}
                                onChange={(e) => setProductForm(prev => ({ ...prev, cost_price: e.target.value }))}
                                placeholder="e.g. 15.00"
                                style={{
                                  width: '100%',
                                  background: 'var(--bg-card)',
                                  border: '1px solid var(--border-color)',
                                  color: 'var(--text-primary)',
                                  padding: '0.65rem 0.85rem',
                                  borderRadius: 'var(--radius-md)',
                                  fontSize: '0.86rem',
                                  outline: 'none'
                                }}
                              />
                              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Direct factory unit cost</span>
                            </div>
                          )}

                          <div>
                            <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.35rem', color: 'var(--text-primary)' }}>
                              Retail Selling Price ($) *
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              required
                              value={productForm.price}
                              onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                              placeholder="e.g. 29.00"
                              style={{
                                width: '100%',
                                background: 'var(--bg-card)',
                                border: '1px solid var(--accent-primary)',
                                color: 'var(--text-primary)',
                                padding: '0.65rem 0.85rem',
                                borderRadius: 'var(--radius-md)',
                                fontSize: '0.86rem',
                                fontWeight: 700,
                                outline: 'none'
                              }}
                            />
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Price paid by customers</span>
                          </div>

                          <div>
                            <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.35rem', color: 'var(--text-primary)' }}>
                              Compare-at Price ($)
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              value={productForm.compare_at_price}
                              onChange={(e) => setProductForm(prev => ({ ...prev, compare_at_price: e.target.value }))}
                              placeholder="e.g. 45.00"
                              style={{
                                width: '100%',
                                background: 'var(--bg-card)',
                                border: '1px solid var(--border-color)',
                                color: 'var(--text-primary)',
                                padding: '0.65rem 0.85rem',
                                borderRadius: 'var(--radius-md)',
                                fontSize: '0.86rem',
                                outline: 'none'
                              }}
                            />
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Original strikethrough price</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* SECTION 4: INVENTORY & SUPPLIER TRACKING */}
                    {(productFormViewMode === 'single' || productFormStep === 4) && (
                      <div className="animate-fade-in" style={{
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-lg)',
                        padding: '1.35rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1.1rem'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.84rem', fontWeight: 800, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          <Truck size={16} />
                          <span>4. Stock Allocation & Factory Origin</span>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                          <div>
                            <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.35rem', color: 'var(--text-primary)' }}>
                              Initial Stock Count
                            </label>
                            <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                              <input
                                type="number"
                                value={productForm.stock}
                                onChange={(e) => setProductForm(prev => ({ ...prev, stock: e.target.value }))}
                                style={{
                                  width: '100%',
                                  background: 'var(--bg-card)',
                                  border: '1px solid var(--border-color)',
                                  color: 'var(--text-primary)',
                                  padding: '0.65rem 0.85rem',
                                  borderRadius: 'var(--radius-md)',
                                  fontSize: '0.86rem',
                                  outline: 'none'
                                }}
                              />
                              {/* Quick Presets */}
                              {[+10, +25, +50, +100].map(inc => (
                                <button
                                  key={inc}
                                  type="button"
                                  onClick={() => setProductForm(prev => ({ ...prev, stock: Math.max(0, Number(prev.stock || 0) + inc) }))}
                                  style={{
                                    padding: '0.45rem 0.55rem',
                                    borderRadius: 'var(--radius-sm)',
                                    background: 'rgba(255,255,255,0.06)',
                                    color: 'var(--text-primary)',
                                    border: '1px solid var(--border-color)',
                                    fontSize: '0.74rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap'
                                  }}
                                >
                                  +{inc}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.35rem', color: 'var(--text-primary)' }}>
                              China Supplier / Factory Origin
                            </label>
                            <input
                              type="text"
                              value={productForm.supplier_info}
                              onChange={(e) => setProductForm(prev => ({ ...prev, supplier_info: e.target.value }))}
                              placeholder="e.g. Guangdong PowerTech Co., Ltd. - Yiwu Port"
                              style={{
                                width: '100%',
                                background: 'var(--bg-card)',
                                border: '1px solid var(--border-color)',
                                color: 'var(--text-primary)',
                                padding: '0.65rem 0.85rem',
                                borderRadius: 'var(--radius-md)',
                                fontSize: '0.86rem',
                                outline: 'none'
                              }}
                            />
                          </div>
                        </div>

                        <div>
                          <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.35rem', color: 'var(--text-primary)' }}>
                            Product Description & Features
                          </label>
                          <textarea
                            rows={3}
                            value={productForm.description}
                            onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Enter product description, technical specifications, and key selling points in Khmer and English..."
                            style={{
                              width: '100%',
                              background: 'var(--bg-card)',
                              border: '1px solid var(--border-color)',
                              color: 'var(--text-primary)',
                              padding: '0.65rem 0.85rem',
                              borderRadius: 'var(--radius-md)',
                              fontSize: '0.86rem',
                              outline: 'none',
                              lineHeight: 1.5
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Dynamic Footer Actions */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                      <div>
                        {productFormViewMode === 'wizard' && productFormStep > 1 && (
                          <button
                            type="button"
                            onClick={() => setProductFormStep(prev => prev - 1)}
                            className="btn-secondary"
                            style={{ padding: '0.65rem 1.25rem', fontSize: '0.85rem' }}
                          >
                            ← Back
                          </button>
                        )}
                      </div>

                      <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button
                          type="button"
                          onClick={() => setIsProductModalOpen(false)}
                          className="btn-secondary"
                          style={{ padding: '0.75rem 1.4rem', fontSize: '0.88rem' }}
                        >
                          Cancel
                        </button>

                        {productFormViewMode === 'wizard' && productFormStep < 4 ? (
                          <button
                            type="button"
                            onClick={() => setProductFormStep(prev => prev + 1)}
                            className="btn-primary"
                            style={{ padding: '0.75rem 1.6rem', fontSize: '0.88rem' }}
                          >
                            <span>Next Step →</span>
                          </button>
                        ) : (
                          <button
                            type="submit"
                            className="btn-primary"
                            style={{ padding: '0.75rem 1.75rem', fontSize: '0.88rem' }}
                          >
                            <Check size={16} />
                            <span>{editingProduct ? 'Save Changes' : 'Create & Publish Product'}</span>
                          </button>
                        )}
                      </div>
                    </div>

                  </form>
                </div>
              </div>
            )}

            {/* DYNAMIC CATALOG / CATEGORY MANAGER MODAL */}
            {isCategoryModalOpen && (
              <div className="modal-overlay" onClick={() => setIsCategoryModalOpen(false)}>
                <div
                  className="modal-content animate-fade-in"
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    maxWidth: '680px',
                    padding: '2.25rem',
                    maxHeight: '92vh',
                    overflowY: 'auto',
                    borderRadius: 'var(--radius-xl)',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-secondary)',
                    boxShadow: '0 25px 60px -12px rgba(0, 0, 0, 0.8)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <div style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '12px',
                        background: 'rgba(99, 102, 241, 0.15)',
                        border: '1px solid rgba(99, 102, 241, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--accent-primary)'
                      }}>
                        <Layers size={22} />
                      </div>
                      <div>
                        <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                          Catalog & Category Management
                        </h3>
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                          Create, edit, and organize product categories and shipment catalogs dynamically
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setIsCategoryModalOpen(false)}
                      className="btn-icon"
                      style={{ width: '32px', height: '32px' }}
                    >
                      <X size={16} />
                    </button>
                  </div>

                  {/* Create / Edit Category Form */}
                  <form onSubmit={handleSaveCategory} style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1.25rem',
                    marginBottom: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem'
                  }}>
                    <div style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {editingCategory ? '✏️ Edit Catalog Category' : '➕ Add New Catalog Category'}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: '0.75rem' }}>
                      <div>
                        <label style={{ fontSize: '0.78rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>Icon / Emoji</label>
                        <input
                          type="text"
                          value={categoryForm.icon}
                          onChange={(e) => setCategoryForm(prev => ({ ...prev, icon: e.target.value }))}
                          placeholder="📦"
                          style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '0.55rem 0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '1rem', textAlign: 'center' }}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '0.78rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>Category Name *</label>
                        <input
                          type="text"
                          required
                          value={categoryForm.name}
                          onChange={(e) => setCategoryForm(prev => ({ ...prev, name: e.target.value, slug: prev.slug || e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-') }))}
                          placeholder="e.g. Solar Power & Outdoor Gadgets"
                          style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '0.55rem 0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.84rem' }}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '0.78rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>Display Order</label>
                        <input
                          type="number"
                          value={categoryForm.display_order}
                          onChange={(e) => setCategoryForm(prev => ({ ...prev, display_order: e.target.value }))}
                          style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '0.55rem 0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.84rem' }}
                        />
                      </div>
                    </div>

                    {/* Quick Emoji Presets */}
                    <div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginRight: '0.5rem' }}>Quick Icons:</span>
                      {['🚗', '🛠️', '⚡', '✨', '📱', '🏕️', '🎧', '💡', '📦', '🔋', '⌚'].map(emoji => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => setCategoryForm(prev => ({ ...prev, icon: emoji }))}
                          style={{
                            padding: '0.2rem 0.4rem',
                            marginRight: '4px',
                            background: 'rgba(255,255,255,0.06)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.85rem'
                          }}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.25rem' }}>
                      {editingCategory && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingCategory(null);
                            setCategoryForm({ name: '', slug: '', icon: '📦', description: '', display_order: categories.length + 1 });
                          }}
                          className="btn-secondary btn-sm"
                        >
                          Cancel Edit
                        </button>
                      )}
                      <button type="submit" className="btn-primary btn-sm" disabled={isCategorySaving}>
                        <Check size={14} />
                        <span>{isCategorySaving ? 'Saving...' : editingCategory ? 'Update Category' : 'Create Category'}</span>
                      </button>
                    </div>
                  </form>

                  {/* Existing Categories Table */}
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
                    Existing Store Catalogs ({categories.length})
                  </div>

                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.76rem', textTransform: 'uppercase' }}>
                          <th style={{ padding: '0.65rem 0.75rem' }}>Icon</th>
                          <th style={{ padding: '0.65rem 0.75rem' }}>Category Name</th>
                          <th style={{ padding: '0.65rem 0.75rem' }}>Products Count</th>
                          <th style={{ padding: '0.65rem 0.75rem' }}>Order</th>
                          <th style={{ padding: '0.65rem 0.75rem' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {categories.map(c => {
                          const pCount = products.filter(p => p.category_id === c.id || p.category_slug === c.slug).length;
                          return (
                            <tr key={c.id} style={{ borderBottom: '1px solid var(--border-color)', fontSize: '0.84rem' }}>
                              <td style={{ padding: '0.65rem 0.75rem', fontSize: '1.1rem' }}>
                                {c.icon || '📦'}
                              </td>
                              <td style={{ padding: '0.65rem 0.75rem' }}>
                                <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{c.name}</div>
                                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>slug: {c.slug}</div>
                              </td>
                              <td style={{ padding: '0.65rem 0.75rem' }}>
                                <span style={{ background: 'rgba(99, 102, 241, 0.15)', color: 'var(--accent-primary)', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-full)', fontWeight: 800, fontSize: '0.75rem' }}>
                                  {pCount} SKUs
                                </span>
                              </td>
                              <td style={{ padding: '0.65rem 0.75rem', color: 'var(--text-muted)' }}>
                                #{c.display_order || 0}
                              </td>
                              <td style={{ padding: '0.65rem 0.75rem' }}>
                                <div style={{ display: 'flex', gap: '0.35rem' }}>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingCategory(c);
                                      setCategoryForm({
                                        name: c.name,
                                        slug: c.slug,
                                        icon: c.icon || '📦',
                                        description: c.description || '',
                                        display_order: c.display_order || 0
                                      });
                                    }}
                                    className="btn-icon"
                                    style={{ width: '28px', height: '28px' }}
                                    title="Edit Category"
                                  >
                                    <Edit2 size={13} />
                                  </button>
                                  {categories.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteCategory(c.id)}
                                      className="btn-icon"
                                      style={{ width: '28px', height: '28px', color: 'var(--danger)' }}
                                      title="Delete Category"
                                    >
                                      <Trash2 size={13} />
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                </div>
              </div>
            )}

          </div>
        )}

        {/* 3. ORDERS, FULFILLMENT & PRINTABLE WAYBILLS */}
        {activeTab === 'orders' && (
          <div className="animate-fade-in glass-panel" style={{ padding: '1.75rem', borderRadius: 'var(--radius-xl)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>🚚 Customer Orders & Waybill Dispatch</h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Manage incoming customer orders, assign courier dispatch, and print waybills.
                </div>
              </div>
            </div>

            {/* Order Status Filter Tabs & Search */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                {['all', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(st => (
                  <button
                    key={st}
                    onClick={() => setOrderStatusFilter(st)}
                    style={{
                      padding: '0.4rem 0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      background: orderStatusFilter === st ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)',
                      color: orderStatusFilter === st ? '#fff' : 'var(--text-secondary)',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    {st === 'all' ? 'All Orders' : st}
                  </button>
                ))}
              </div>

              <div style={{ position: 'relative', minWidth: '220px' }}>
                <Search size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Search by order # or customer..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '0.45rem 0.8rem 0.45rem 2rem', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', outline: 'none' }}
                />
              </div>
            </div>

            {/* Orders Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                    <th style={{ padding: '0.75rem 1rem' }}>Order #</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Customer & Destination</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Items</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Total Amount</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Payment</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Fulfillment Status</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map(o => (
                    <tr key={o.id} style={{ borderBottom: '1px solid var(--border-color)', fontSize: '0.85rem' }}>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                        #{o.order_number}
                      </td>

                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{o.customer_name} ({o.customer_phone})</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{o.shipping_address}, {o.city}</div>
                      </td>

                      <td style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)' }}>
                        {Array.isArray(o.items) ? `${o.items.length} item(s)` : '1 item'}
                      </td>

                      <td style={{ padding: '0.85rem 1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                        {formatPrice(o.total_amount)}
                      </td>

                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span className="badge badge-outline">{o.payment_method}</span>
                      </td>

                      <td style={{ padding: '0.85rem 1rem' }}>
                        <select
                          value={o.status}
                          onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                          style={{
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border-color)',
                            color: 'var(--text-primary)',
                            padding: '0.35rem 0.6rem',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.8rem',
                            fontWeight: 700
                          }}
                        >
                          <option value="Confirmed">Confirmed</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped (In Transit)</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>

                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ display: 'flex', gap: '0.45rem' }}>
                          <button
                            onClick={() => setSelectedWaybillOrder(o)}
                            className="btn-secondary btn-sm"
                            title="Preview and Print Courier Shipping Waybill"
                          >
                            <Printer size={13} />
                            <span>Waybill</span>
                          </button>

                          <a
                            href={`https://t.me/SIYEANLONG`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-icon"
                            style={{ width: '30px', height: '30px', color: '#229ED9' }}
                            title="Contact Customer on Telegram"
                          >
                            <TelegramIcon size={14} />
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Printable Waybill Modal */}
            {selectedWaybillOrder && (
              <div className="modal-overlay" onClick={() => setSelectedWaybillOrder(null)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '580px', padding: '2rem', background: '#ffffff', color: '#0f172a' }}>
                  
                  {/* Waybill Print Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #0f172a', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
                    <div>
                      <div style={{ fontSize: '1.4rem', fontWeight: 900, letterSpacing: '-0.02em' }}>
                        {settings.store_name || 'SR SHOP'} WAYBILL
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#475569' }}>
                        Domestic Courier Manifest • {selectedWaybillOrder.shipping_method || 'Standard Express'}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#4f46e5' }}>#{selectedWaybillOrder.order_number}</div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Date: {new Date(selectedWaybillOrder.created_at).toLocaleDateString()}</div>
                    </div>
                  </div>

                  {/* Simulated Barcode */}
                  <div style={{ textAlign: 'center', padding: '0.6rem 0', background: '#f8fafc', borderRadius: '4px', marginBottom: '1rem', border: '1px dashed #cbd5e1' }}>
                    <div style={{ fontFamily: 'monospace', letterSpacing: '0.35em', fontSize: '1.25rem', fontWeight: 900 }}>
                      ||| | | |||| | || ||||| ||| ||
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                      TRACKING: {selectedWaybillOrder.tracking_number || `SR-TRK-${selectedWaybillOrder.order_number}`}
                    </div>
                  </div>

                  {/* Sender & Receiver Box */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', border: '1px solid #e2e8f0', padding: '0.85rem', borderRadius: '6px', marginBottom: '1rem' }}>
                    <div>
                      <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>FROM (SENDER):</div>
                      <div style={{ fontWeight: 800, fontSize: '0.9rem', marginTop: '2px' }}>{settings.store_name || 'SR SHOP'}</div>
                      <div style={{ fontSize: '0.75rem', color: '#334155' }}>{settings.store_address}</div>
                      <div style={{ fontSize: '0.75rem', color: '#334155', fontWeight: 700 }}>Tel: {settings.store_phone || '098 33 47 55'}</div>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>TO (RECEIVER):</div>
                      <div style={{ fontWeight: 800, fontSize: '0.9rem', marginTop: '2px' }}>{selectedWaybillOrder.customer_name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#334155' }}>{selectedWaybillOrder.shipping_address}, {selectedWaybillOrder.city}</div>
                      <div style={{ fontSize: '0.75rem', color: '#334155', fontWeight: 700 }}>Tel: {selectedWaybillOrder.customer_phone}</div>
                    </div>
                  </div>

                  {/* Parcel Details & COD Amount */}
                  <div style={{ border: '1px solid #e2e8f0', padding: '0.85rem', borderRadius: '6px', marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700 }}>Items in Parcel:</span>
                      <span style={{ fontSize: '0.78rem', color: '#475569' }}>{Array.isArray(selectedWaybillOrder.items) ? selectedWaybillOrder.items.length : 1} Package(s)</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <div>
                        <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>PAYMENT METHOD:</div>
                        <div style={{ fontWeight: 800, fontSize: '0.88rem' }}>{selectedWaybillOrder.payment_method}</div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>COD COLLECT TOTAL:</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#dc2626' }}>${Number(selectedWaybillOrder.total_amount).toFixed(2)}</div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                    <button onClick={() => setSelectedWaybillOrder(null)} className="btn-secondary" style={{ color: '#0f172a', borderColor: '#cbd5e1' }}>
                      Close
                    </button>
                    <button onClick={() => window.print()} className="btn-primary" style={{ background: '#4f46e5' }}>
                      <Printer size={16} />
                      <span>Print Label Now</span>
                    </button>
                  </div>

                </div>
              </div>
            )}

          </div>
        )}

        {/* 4. SLIDESHOW MANAGER */}
        {activeTab === 'slideshow' && (
          <div className="animate-fade-in">
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.35rem' }}>🎬 Homepage Slideshow Slides</h3>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                    Showcase trending direct factory imported products and special promotions.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingSlide(null);
                    setSlideForm({
                      title: '',
                      title_km: '',
                      subtitle: '',
                      subtitle_km: '',
                      image: '',
                      badge: '🔥 HOT PROMO',
                      price: '',
                      compare_at_price: '',
                      cta_text: 'Shop Now',
                      cta_text_km: 'ទិញឥឡូវនេះ',
                      product_id: '',
                      display_order: adminSlides.length + 1
                    });
                    setIsSlideModalOpen(true);
                  }}
                  className="btn-primary"
                  style={{ alignSelf: 'flex-start', marginTop: '1rem' }}
                >
                  <Plus size={16} />
                  <span>Add New Slide</span>
                </button>
              </div>

              {/* Rotation Settings Card */}
              <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <Sliders size={16} color="var(--accent-primary)" />
                  <span>Rotation & Transition Settings</span>
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Rotation Speed:</label>
                    <select
                      value={slideshowSettings.autoplay_speed}
                      onChange={(e) => setSlideshowSettings(prev => ({ ...prev, autoplay_speed: e.target.value }))}
                      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '0.35rem 0.65rem', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem' }}
                    >
                      <option value="3000">3 Seconds (Fast)</option>
                      <option value="5000">5 Seconds (Default)</option>
                      <option value="7000">7 Seconds (Relaxed)</option>
                      <option value="10000">10 Seconds (Slow)</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Transition Style:</label>
                    <select
                      value={slideshowSettings.transition_effect}
                      onChange={(e) => setSlideshowSettings(prev => ({ ...prev, transition_effect: e.target.value }))}
                      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '0.35rem 0.65rem', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem' }}
                    >
                      <option value="fade">Smooth Fade Effect</option>
                      <option value="slide">Slide Carousel</option>
                    </select>
                  </div>

                  <button
                    onClick={handleSaveSlideshowSettings}
                    className="btn-secondary btn-sm"
                    style={{ alignSelf: 'flex-end', marginTop: '0.4rem' }}
                  >
                    <Check size={14} />
                    <span>Save Rotation Settings</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Slides List Table */}
            <div className="glass-panel" style={{ padding: '1.75rem', borderRadius: 'var(--radius-xl)' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                      <th style={{ padding: '0.75rem 1rem' }}>Order</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Slide Preview</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Badge & Title</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Price Tag</th>
                      <th style={{ padding: '0.75rem 1rem' }}>CTA Button</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {adminSlides.map((slide, idx) => (
                      <tr key={slide.id} style={{ borderBottom: '1px solid var(--border-color)', fontSize: '0.85rem' }}>
                        <td style={{ padding: '0.85rem 1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <span style={{ fontWeight: 800, color: 'var(--accent-primary)' }}>#{idx + 1}</span>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <button
                                disabled={idx === 0}
                                onClick={() => handleMoveSlide(idx, -1)}
                                style={{ color: idx === 0 ? 'var(--text-muted)' : 'var(--text-primary)', cursor: idx === 0 ? 'default' : 'pointer', padding: '1px' }}
                                title="Move Up"
                              >
                                <ArrowUp size={13} />
                              </button>
                              <button
                                disabled={idx === adminSlides.length - 1}
                                onClick={() => handleMoveSlide(idx, 1)}
                                style={{ color: idx === adminSlides.length - 1 ? 'var(--text-muted)' : 'var(--text-primary)', cursor: idx === adminSlides.length - 1 ? 'default' : 'pointer', padding: '1px' }}
                                title="Move Down"
                              >
                                <ArrowDown size={13} />
                              </button>
                            </div>
                          </div>
                        </td>

                        <td style={{ padding: '0.85rem 1rem' }}>
                          <img src={slide.image} alt="" style={{ width: '80px', height: '50px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border-color)' }} />
                        </td>

                        <td style={{ padding: '0.85rem 1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '2px' }}>
                            <span className="badge badge-sale" style={{ fontSize: '0.65rem' }}>{slide.badge}</span>
                          </div>
                          <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{slide.title}</div>
                          {slide.title_km && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{slide.title_km}</div>}
                        </td>

                        <td style={{ padding: '0.85rem 1rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                          {slide.price ? formatPrice(slide.price) : '—'}
                        </td>

                        <td style={{ padding: '0.85rem 1rem' }}>
                          <span className="badge badge-outline">{slide.cta_text || 'Shop Now'}</span>
                        </td>

                        <td style={{ padding: '0.85rem 1rem' }}>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                              onClick={() => {
                                setEditingSlide(slide);
                                setSlideForm({
                                  title: slide.title,
                                  title_km: slide.title_km || '',
                                  subtitle: slide.subtitle || '',
                                  subtitle_km: slide.subtitle_km || '',
                                  image: slide.image,
                                  badge: slide.badge || '🔥 HOT PROMO',
                                  price: slide.price || '',
                                  compare_at_price: slide.compare_at_price || '',
                                  cta_text: slide.cta_text || 'Shop Now',
                                  cta_text_km: slide.cta_text_km || 'ទិញឥឡូវនេះ',
                                  product_id: slide.product_id || '',
                                  display_order: slide.display_order
                                });
                                setIsSlideModalOpen(true);
                              }}
                              className="btn-icon"
                              style={{ width: '32px', height: '32px' }}
                              title="Edit Slide"
                            >
                              <Edit2 size={14} />
                            </button>

                            <button
                              onClick={() => handleDeleteSlide(slide.id)}
                              className="btn-icon"
                              style={{ width: '32px', height: '32px', color: 'var(--danger)' }}
                              title="Delete Slide"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Slide Add/Edit Modal */}
            {isSlideModalOpen && (
              <div className="modal-overlay" onClick={() => setIsSlideModalOpen(false)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '680px', padding: '2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.85rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                      {editingSlide ? 'Edit Slideshow Slide' : 'Add New Slideshow Slide'}
                    </h3>
                    <button onClick={() => setIsSlideModalOpen(false)} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>
                      <X size={18} />
                    </button>
                  </div>

                  {/* 1-Click Auto Fill */}
                  <div style={{ background: 'rgba(99, 102, 241, 0.08)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(99, 102, 241, 0.25)', marginBottom: '1.25rem' }}>
                    <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--accent-primary)', display: 'block', marginBottom: '0.35rem' }}>
                      ⚡ 1-Click Auto-Fill from Product Catalog:
                    </label>
                    <select
                      onChange={(e) => handleSelectProductForSlide(e.target.value)}
                      style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-sm)', outline: 'none' }}
                    >
                      <option value="">-- Choose a product to auto-fill details --</option>
                      {products.map(p => (
                        <option key={p.id} value={p.id}>{p.name} (${p.price})</option>
                      ))}
                    </select>
                  </div>

                  <form onSubmit={handleSaveSlide} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>Title (English) *</label>
                        <input
                          type="text"
                          required
                          value={slideForm.title}
                          onChange={(e) => setSlideForm(prev => ({ ...prev, title: e.target.value }))}
                          style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-sm)' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>Title (Khmer ភាសាខ្មែរ)</label>
                        <input
                          type="text"
                          value={slideForm.title_km}
                          onChange={(e) => setSlideForm(prev => ({ ...prev, title_km: e.target.value }))}
                          style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-sm)' }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>Image URL *</label>
                      <input
                        type="text"
                        required
                        value={slideForm.image}
                        onChange={(e) => setSlideForm(prev => ({ ...prev, image: e.target.value }))}
                        style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-sm)' }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>Price ($ USD)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={slideForm.price}
                          onChange={(e) => setSlideForm(prev => ({ ...prev, price: e.target.value }))}
                          style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-sm)' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>Compare Price ($)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={slideForm.compare_at_price}
                          onChange={(e) => setSlideForm(prev => ({ ...prev, compare_at_price: e.target.value }))}
                          style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-sm)' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>Badge Tag</label>
                        <input
                          type="text"
                          value={slideForm.badge}
                          onChange={(e) => setSlideForm(prev => ({ ...prev, badge: e.target.value }))}
                          style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-sm)' }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                      <button type="button" onClick={() => setIsSlideModalOpen(false)} className="btn-secondary">
                        Cancel
                      </button>
                      <button type="submit" className="btn-primary">
                        <span>{editingSlide ? 'Update Slide' : 'Create Slide'}</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

          </div>
        )}

        {/* 5. AI SOCIAL MEDIA COPYWRITER */}
        {activeTab === 'ai-copy' && (
          <div className="animate-fade-in glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-xl)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
              <Bot size={24} color="var(--accent-primary)" />
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800 }}>{t('ai_copy_generator')}</h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.75rem' }}>
              Instantly generate high-converting promotional post text for Facebook, TikTok, and Telegram Channel in Khmer or English.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>
                  Select Imported Product:
                </label>
                <select
                  value={selectedProductForAI}
                  onChange={(e) => setSelectedProductForAI(e.target.value)}
                  style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', outline: 'none' }}
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name} (${p.price})</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>
                  Social Media Platform:
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => setAiPlatform('facebook')}
                    style={{
                      flex: 1,
                      padding: '0.65rem',
                      borderRadius: 'var(--radius-md)',
                      background: aiPlatform === 'facebook' ? '#1877f2' : 'rgba(255, 255, 255, 0.05)',
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      cursor: 'pointer'
                    }}
                  >
                    Facebook Post
                  </button>
                  <button
                    onClick={() => setAiPlatform('tiktok')}
                    style={{
                      flex: 1,
                      padding: '0.65rem',
                      borderRadius: 'var(--radius-md)',
                      background: aiPlatform === 'tiktok' ? '#000000' : 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid var(--border-color)',
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      cursor: 'pointer'
                    }}
                  >
                    TikTok Video
                  </button>
                  <button
                    onClick={() => setAiPlatform('telegram')}
                    style={{
                      flex: 1,
                      padding: '0.65rem',
                      borderRadius: 'var(--radius-md)',
                      background: aiPlatform === 'telegram' ? '#229ED9' : 'rgba(255, 255, 255, 0.05)',
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      cursor: 'pointer'
                    }}
                  >
                    Telegram Broadcast
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={handleGenerateAICopy}
              className="btn-primary"
              style={{ marginBottom: '1.75rem', padding: '0.85rem 1.75rem' }}
            >
              <Sparkles size={16} />
              <span>{t('generate_copy')}</span>
            </button>

            {generatedAICopy && (
              <div style={{
                background: 'rgba(0, 0, 0, 0.25)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem',
                position: 'relative'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--accent-primary)', textTransform: 'uppercase' }}>
                    Ready to Post ({aiPlatform.toUpperCase()})
                  </span>
                  <button
                    onClick={handleCopyAIText}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.4rem 0.8rem',
                      borderRadius: 'var(--radius-sm)',
                      background: isCopied ? '#10b981' : 'rgba(255, 255, 255, 0.08)',
                      color: '#fff',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {isCopied ? <Check size={14} /> : <Copy size={14} />}
                    <span>{isCopied ? t('copied') : t('copy_to_clipboard')}</span>
                  </button>
                </div>

                <textarea
                  rows={9}
                  readOnly
                  value={generatedAICopy}
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: 'var(--text-primary)',
                    fontSize: '0.92rem',
                    lineHeight: 1.6,
                    fontFamily: 'inherit',
                    resize: 'none'
                  }}
                />
              </div>
            )}
          </div>
        )}

        {/* 6. STAFF & TEAM RBAC (Admin Only) */}
        {activeTab === 'staff' && currentRole === 'admin' && (
          <div className="animate-fade-in glass-panel" style={{ padding: '1.75rem', borderRadius: 'var(--radius-xl)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Users size={20} color="var(--accent-primary)" />
                  <span>Staff & Team Permission Control</span>
                </h3>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  Assign user roles and granular system permissions across your business team.
                </div>
              </div>

              <button
                onClick={() => {
                  setEditingStaff(null);
                  setStaffForm({
                    name: '',
                    email: '',
                    phone: '',
                    role: 'staff',
                    password: '',
                    avatar: ''
                  });
                  setIsStaffModalOpen(true);
                }}
                className="btn-primary"
              >
                <Plus size={16} />
                <span>Add Team Member</span>
              </button>
            </div>

            {/* Permission Matrix */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.02)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-color)',
              padding: '1.25rem',
              marginBottom: '1.75rem'
            }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--accent-primary)' }}>
                🛡️ Role-Based Access Control (RBAC) Hierarchy:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', fontSize: '0.8rem' }}>
                <div style={{ padding: '0.85rem', background: 'rgba(16, 185, 129, 0.08)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                  <div style={{ fontWeight: 800, color: '#10b981', marginBottom: '0.35rem' }}>👑 Admin (Owner)</div>
                  <div style={{ color: 'var(--text-secondary)', lineHeight: 1.4 }}>Full unrestricted access to financial margins, staff accounts, store settings & deletes.</div>
                </div>
                <div style={{ padding: '0.85rem', background: 'rgba(99, 102, 241, 0.08)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                  <div style={{ fontWeight: 800, color: '#818cf8', marginBottom: '0.35rem' }}>👔 Store Manager</div>
                  <div style={{ color: 'var(--text-secondary)', lineHeight: 1.4 }}>Catalog editing, inventory stock, marketing slideshows & order fulfillment. Financial profits hidden.</div>
                </div>
                <div style={{ padding: '0.85rem', background: 'rgba(245, 158, 11, 0.08)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                  <div style={{ fontWeight: 800, color: '#f59e0b', marginBottom: '0.35rem' }}>👷 Staff (Fulfillment)</div>
                  <div style={{ color: 'var(--text-secondary)', lineHeight: 1.4 }}>Order processing, waybill printing & parcel tracking updates only.</div>
                </div>
              </div>
            </div>

            {/* Staff Directory Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                    <th style={{ padding: '0.75rem 1rem' }}>Team Member</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Role Tier</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Phone Contact</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {staffList.map(member => (
                    <tr key={member.id} style={{ borderBottom: '1px solid var(--border-color)', fontSize: '0.85rem' }}>
                      <td style={{ padding: '0.85rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '50%',
                          background: 'var(--accent-primary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          color: '#fff',
                          overflow: 'hidden'
                        }}>
                          {member.avatar ? (
                            <img src={member.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            member.name.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{member.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{member.email}</div>
                        </div>
                      </td>

                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span style={{
                          padding: '0.3rem 0.65rem',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          textTransform: 'uppercase',
                          background: member.role === 'admin' ? 'rgba(16, 185, 129, 0.15)' : member.role === 'manager' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                          color: member.role === 'admin' ? '#10b981' : member.role === 'manager' ? '#818cf8' : '#f59e0b',
                          border: `1px solid ${member.role === 'admin' ? '#10b981' : member.role === 'manager' ? '#818cf8' : '#f59e0b'}`
                        }}>
                          {member.role === 'admin' ? '👑 Owner (Admin)' : member.role === 'manager' ? '👔 Manager' : '👷 Staff'}
                        </span>
                      </td>

                      <td style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)' }}>
                        {member.phone || '—'}
                      </td>

                      <td style={{ padding: '0.85rem 1rem' }}>
                        <button
                          onClick={() => handleToggleStaffStatus(member)}
                          style={{
                            padding: '0.25rem 0.6rem',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            background: member.is_active ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                            color: member.is_active ? '#10b981' : '#ef4444',
                            border: 'none',
                            cursor: 'pointer'
                          }}
                        >
                          {member.is_active ? '● Active' : '○ Deactivated'}
                        </button>
                      </td>

                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ display: 'flex', gap: '0.45rem' }}>
                          <button
                            onClick={() => {
                              setEditingStaff(member);
                              setStaffForm({
                                name: member.name,
                                email: member.email,
                                phone: member.phone || '',
                                role: member.role,
                                password: '',
                                avatar: member.avatar || ''
                              });
                              setIsStaffModalOpen(true);
                            }}
                            className="btn-icon"
                            style={{ width: '30px', height: '30px' }}
                            title="Edit Staff Role"
                          >
                            <Edit2 size={13} />
                          </button>

                          {member.email !== 'admin@srshop.store' && (
                            <button
                              onClick={() => handleDeleteStaff(member.id)}
                              className="btn-icon"
                              style={{ width: '30px', height: '30px', color: 'var(--danger)' }}
                              title="Delete Member"
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Add / Edit Staff Modal */}
            {isStaffModalOpen && (
              <div className="modal-overlay" onClick={() => setIsStaffModalOpen(false)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px', padding: '2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                      {editingStaff ? 'Edit Staff Member' : 'Add New Staff Member'}
                    </h3>
                    <button onClick={() => setIsStaffModalOpen(false)} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>
                      <X size={18} />
                    </button>
                  </div>

                  <form onSubmit={handleSaveStaff} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>Full Name *</label>
                      <input
                        type="text"
                        required
                        value={staffForm.name}
                        onChange={(e) => setStaffForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g. Dara Rath"
                        style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>Email Address *</label>
                      <input
                        type="email"
                        required
                        value={staffForm.email}
                        onChange={(e) => setStaffForm(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="staff@srshop.store"
                        style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)' }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>Phone Number</label>
                        <input
                          type="text"
                          value={staffForm.phone}
                          onChange={(e) => setStaffForm(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="012 33 44 55"
                          style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)' }}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>Role Tier</label>
                        <select
                          value={staffForm.role}
                          onChange={(e) => setStaffForm(prev => ({ ...prev, role: e.target.value }))}
                          style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)' }}
                        >
                          <option value="admin">👑 Admin (Owner)</option>
                          <option value="manager">👔 Store Manager</option>
                          <option value="staff">👷 Fulfillment Staff</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>
                        {editingStaff ? 'Reset Password (optional)' : 'Account Password *'}
                      </label>
                      <input
                        type="password"
                        required={!editingStaff}
                        value={staffForm.password}
                        onChange={(e) => setStaffForm(prev => ({ ...prev, password: e.target.value }))}
                        placeholder={editingStaff ? 'Leave empty to keep current password' : '••••••••'}
                        style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)' }}
                      />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                      <button type="button" onClick={() => setIsStaffModalOpen(false)} className="btn-secondary">
                        Cancel
                      </button>
                      <button type="submit" className="btn-primary">
                        <span>{editingStaff ? 'Update Member' : 'Create Account'}</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

          </div>
        )}

        {/* 7. CUSTOM BRANDING & LOGO SUITE (Admin Only) */}
        {activeTab === 'branding' && currentRole === 'admin' && (
          <div className="animate-fade-in glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-xl)' }}>
            
            <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Palette size={22} color="var(--accent-primary)" />
                <span>Custom Store Branding & Logo Management</span>
              </h3>
              <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                Upload your official company logo, customize store identity, and update contact information.
              </div>
            </div>

            <form onSubmit={handleSaveBranding} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
              
              {/* Logo Uploader */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem'
              }}>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <ImageIcon size={18} color="var(--accent-primary)" />
                  <span>Company Logo Asset</span>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                  Upload a high-resolution transparent PNG, SVG, or JPG logo. Recommended size: 400x120px.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', alignItems: 'center' }}>
                  
                  <div
                    onClick={() => logoInputRef.current?.click()}
                    style={{
                      border: '2px dashed var(--border-color)',
                      borderRadius: 'var(--radius-lg)',
                      padding: '2rem 1.5rem',
                      textAlign: 'center',
                      cursor: 'pointer',
                      background: 'rgba(255,255,255,0.01)',
                      transition: 'border-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
                  >
                    <input
                      ref={logoInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      style={{ display: 'none' }}
                    />
                    <Upload size={32} color="var(--accent-primary)" style={{ margin: '0 auto 0.75rem auto' }} />
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {isUploadingLogo ? 'Uploading logo...' : 'Click to Upload Custom Logo'}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                      PNG, SVG, WEBP up to 15MB
                    </div>
                  </div>

                  {/* Dual Theme Navbar Previews */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Live Navbar Theme Preview:
                    </div>

                    <div style={{ background: '#0b1329', padding: '0.85rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        {brandingForm.store_logo_url ? (
                          <img src={brandingForm.store_logo_url} alt="Logo Dark" style={{ height: '28px', maxWidth: '120px', objectFit: 'contain' }} />
                        ) : (
                          <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'var(--accent-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.75rem' }}>
                            SR
                          </div>
                        )}
                        <span style={{ fontWeight: 800, color: '#fff', fontSize: '0.9rem' }}>{brandingForm.store_name}</span>
                      </div>
                      <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)' }}>Dark Header</span>
                    </div>

                    <div style={{ background: '#ffffff', padding: '0.85rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        {brandingForm.store_logo_url ? (
                          <img src={brandingForm.store_logo_url} alt="Logo Light" style={{ height: '28px', maxWidth: '120px', objectFit: 'contain' }} />
                        ) : (
                          <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'var(--accent-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.75rem' }}>
                            SR
                          </div>
                        )}
                        <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.9rem' }}>{brandingForm.store_name}</span>
                      </div>
                      <span style={{ fontSize: '0.65rem', color: '#64748b' }}>Light Header</span>
                    </div>

                  </div>

                </div>
              </div>

              {/* Store Identity Fields */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.35rem' }}>Store Brand Name *</label>
                  <input
                    type="text"
                    required
                    value={brandingForm.store_name}
                    onChange={(e) => setBrandingForm(prev => ({ ...prev, store_name: e.target.value }))}
                    style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.35rem' }}>Store Tagline / Slogan</label>
                  <input
                    type="text"
                    value={brandingForm.store_tagline}
                    onChange={(e) => setBrandingForm(prev => ({ ...prev, store_tagline: e.target.value }))}
                    placeholder="Direct Factory Import & Reseller Store"
                    style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.35rem' }}>Hotline Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={brandingForm.store_phone}
                    onChange={(e) => setBrandingForm(prev => ({ ...prev, store_phone: e.target.value }))}
                    style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.35rem' }}>Support Email Address</label>
                  <input
                    type="email"
                    value={brandingForm.store_email}
                    onChange={(e) => setBrandingForm(prev => ({ ...prev, store_email: e.target.value }))}
                    style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.35rem' }}>Physical Address (Khmer & English)</label>
                <input
                  type="text"
                  value={brandingForm.store_address}
                  onChange={(e) => setBrandingForm(prev => ({ ...prev, store_address: e.target.value }))}
                  placeholder="បុរីពិភពថ្មីកំបូល 3, ភ្នំពេញ"
                  style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)' }}
                />
              </div>

              {/* Social Channels */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.35rem' }}>Facebook Page URL</label>
                  <input
                    type="text"
                    value={brandingForm.store_facebook}
                    onChange={(e) => setBrandingForm(prev => ({ ...prev, store_facebook: e.target.value }))}
                    placeholder="https://web.facebook.com/SRonlines.shop/"
                    style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.35rem' }}>Telegram Link</label>
                  <input
                    type="text"
                    value={brandingForm.store_telegram}
                    onChange={(e) => setBrandingForm(prev => ({ ...prev, store_telegram: e.target.value }))}
                    placeholder="https://t.me/SIYEANLONG"
                    style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button type="submit" className="btn-primary" style={{ padding: '0.85rem 2rem', fontSize: '0.95rem' }}>
                  <Check size={18} />
                  <span>Save Store Branding & Apply Live</span>
                </button>
              </div>

            </form>

          </div>
        )}

      </main>

    </div>
  );
}
