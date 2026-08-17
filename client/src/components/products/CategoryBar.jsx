import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Sparkles, Cpu, Home, Compass, Zap, Flame } from 'lucide-react';

export default function CategoryBar() {
  const { categories, selectedCategory, setSelectedCategory, selectedBadgeFilter, setSelectedBadgeFilter } = useStore();

  const getCategoryIcon = (slug) => {
    switch (slug) {
      case 'smart-tech': return <Cpu size={16} />;
      case 'home-living': return <Home size={16} />;
      case 'lifestyle-edc': return <Compass size={16} />;
      case 'beauty-wellness': return <Sparkles size={16} />;
      default: return <Zap size={16} />;
    }
  };

  return (
    <div style={{ marginBottom: '1.75rem' }}>
      
      {/* Category Pills Slider */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.65rem',
        overflowX: 'auto',
        paddingBottom: '0.5rem',
        scrollbarWidth: 'none'
      }}>
        <button
          onClick={() => { setSelectedCategory('all'); setSelectedBadgeFilter('all'); }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.55rem 1.15rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.86rem',
            fontWeight: 600,
            whiteSpace: 'nowrap',
            cursor: 'pointer',
            transition: 'all 0.2s',
            background: selectedCategory === 'all' && selectedBadgeFilter === 'all'
              ? 'var(--accent-gradient)'
              : 'rgba(255, 255, 255, 0.05)',
            color: selectedCategory === 'all' && selectedBadgeFilter === 'all'
              ? '#ffffff'
              : 'var(--text-primary)',
            border: `1px solid ${selectedCategory === 'all' && selectedBadgeFilter === 'all' ? 'transparent' : 'var(--border-color)'}`,
            boxShadow: selectedCategory === 'all' && selectedBadgeFilter === 'all' ? '0 4px 12px rgba(99, 102, 241, 0.35)' : 'none'
          }}
        >
          <Zap size={16} />
          <span>All Products</span>
        </button>

        {/* Hot / Trending Filter Quick Tag */}
        <button
          onClick={() => setSelectedBadgeFilter(selectedBadgeFilter === 'trending' ? 'all' : 'trending')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.55rem 1.15rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.86rem',
            fontWeight: 600,
            whiteSpace: 'nowrap',
            cursor: 'pointer',
            transition: 'all 0.2s',
            background: selectedBadgeFilter === 'trending' ? '#ec4899' : 'rgba(236, 72, 153, 0.1)',
            color: selectedBadgeFilter === 'trending' ? '#ffffff' : '#f472b6',
            border: `1px solid ${selectedBadgeFilter === 'trending' ? 'transparent' : 'rgba(236, 72, 153, 0.3)'}`
          }}
        >
          <Flame size={16} />
          <span>🔥 Trending Now</span>
        </button>

        {/* Categories */}
        {categories.map(cat => {
          const isSelected = selectedCategory === cat.slug;
          return (
            <button
              key={cat.id}
              onClick={() => { setSelectedCategory(cat.slug); setSelectedBadgeFilter('all'); }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.55rem 1.15rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.86rem',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                transition: 'all 0.2s',
                background: isSelected
                  ? 'var(--accent-gradient)'
                  : 'rgba(255, 255, 255, 0.05)',
                color: isSelected ? '#ffffff' : 'var(--text-primary)',
                border: `1px solid ${isSelected ? 'transparent' : 'var(--border-color)'}`,
                boxShadow: isSelected ? '0 4px 12px rgba(99, 102, 241, 0.35)' : 'none'
              }}
            >
              {getCategoryIcon(cat.slug)}
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

    </div>
  );
}
