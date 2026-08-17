import React from 'react';
import { useStore } from '../../context/StoreContext';
import ProductCard from './ProductCard';
import { SlidersHorizontal, RefreshCcw, Sparkles, Filter } from 'lucide-react';

export default function ProductGrid() {
  const {
    products,
    loading,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedSort,
    setSelectedSort,
    selectedBadgeFilter,
    setSelectedBadgeFilter,
    priceRange,
    setPriceRange
  } = useStore();

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedSort('featured');
    setSelectedBadgeFilter('all');
    setPriceRange([0, 200]);
  };

  return (
    <section id="catalog-section" style={{ marginBottom: '3.5rem' }}>
      
      {/* Filter and Sorting Header Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.5rem',
        padding: '0.85rem 1.25rem',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)'
      }}>
        
        {/* Results Counter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          <Sparkles size={16} color="var(--accent-primary)" />
          <span>
            Showing <strong style={{ color: 'var(--text-primary)' }}>{products.length}</strong> imported items
            {searchQuery && ` for "${searchQuery}"`}
          </span>
        </div>

        {/* Controls: Price Filter & Sort Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          
          {/* Active Filter Indicators */}
          {(searchQuery || selectedCategory !== 'all' || selectedBadgeFilter !== 'all') && (
            <button
              onClick={resetAllFilters}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.78rem',
                color: 'var(--accent-primary)',
                background: 'rgba(99, 102, 241, 0.1)',
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer'
              }}
            >
              <RefreshCcw size={12} />
              <span>Reset Filters</span>
            </button>
          )}

          {/* Sort Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Sort by:</span>
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              style={{
                background: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.4rem 0.8rem',
                fontSize: '0.84rem',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="featured">Featured & Best Deals</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Customer Rated</option>
              <option value="newest">Latest Imports</option>
            </select>
          </div>

        </div>

      </div>

      {/* Loading Skeletons */}
      {loading ? (
        <div className="product-grid">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
            <div key={n} className="glass-panel" style={{ height: '380px', borderRadius: 'var(--radius-lg)', opacity: 0.5, animation: 'pulseGlow 1.5s infinite' }} />
          ))}
        </div>
      ) : products.length === 0 ? (
        /* Empty State */
        <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem', borderRadius: 'var(--radius-xl)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</div>
          <h3 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>No matching products found</h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '420px', margin: '0 auto 1.5rem', fontSize: '0.9rem' }}>
            We could not find items matching your search criteria. Try browsing another category or resetting filters.
          </p>
          <button onClick={resetAllFilters} className="btn-primary">
            <span>Show All Products</span>
          </button>
        </div>
      ) : (
        /* Product Grid */
        <div className="product-grid">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

    </section>
  );
}
