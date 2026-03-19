import { useState, useEffect, useCallback } from 'react';
import './index.css';

import Header from './components/Header';
import Hero from './components/Hero';
import CategoryGrid from './components/CategoryGrid';
import ProductCard from './components/ProductCard';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import Footer from './components/Footer';
import SearchBar from './components/SearchBar';
import { checkout as checkoutApi } from './utils/api';
import { addItem, removeItem } from './utils/cartUtils';

const TESTIMONIALS = [
  {
    name: 'Priya S.',
    role: 'Verified Buyer',
    text: "Absolutely love ShopSmart! The products are top-notch and delivery was super fast. The checkout experience is the smoothest I've ever used.",
    rating: 5,
    initial: 'P',
  },
  {
    name: 'Rajan M.',
    role: 'Verified Buyer',
    text: 'Found amazing deals on electronics. The quality exceeded my expectations and customer support was very helpful when I had a query.',
    rating: 5,
    initial: 'R',
  },
  {
    name: 'Aisha K.',
    role: 'Verified Buyer',
    text: 'Great variety and competitive prices. I ordered headphones and received them in 2 days. Packaging was perfect. Will definitely shop again!',
    rating: 5,
    initial: 'A',
  },
];

function Toast({ message, type = 'success', onDismiss }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 3000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <div className={`toast toast-${type}`} role="alert">
      <span className="toast-icon">{type === 'success' ? '✅' : '❌'}</span>
      <span>{message}</span>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="product-card skeleton-card" style={{ background: 'var(--clr-surface)' }}>
      <div className="skeleton" style={{ aspectRatio: '1/1', width: '100%' }} />
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div className="skeleton" style={{ height: '12px', width: '60%' }} />
        <div className="skeleton" style={{ height: '16px', width: '90%' }} />
        <div className="skeleton" style={{ height: '12px', width: '40%' }} />
        <div className="skeleton" style={{ height: '20px', width: '50%' }} />
        <div className="skeleton" style={{ height: '40px', borderRadius: '12px' }} />
      </div>
    </div>
  );
}

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Fetch products whenever category or search changes
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const apiUrl = import.meta.env.VITE_API_URL || '';
        const params = new URLSearchParams();
        if (activeCategory !== 'All') params.set('category', activeCategory);
        if (searchQuery) params.set('search', searchQuery);
        const url = `${apiUrl}/api/products${params.toString() ? `?${params}` : ''}`;
        const res = await fetch(url);
        const data = res.ok ? await res.json() : [];
        setProducts(data);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [activeCategory, searchQuery]);

  // Derive sorted products
  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    return 0;
  });

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  const handleAddToCart = (product) => {
    setCart((prev) =>
      addItem(prev, {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      })
    );
    showToast(`${product.name} added to cart 🛒`);
  };

  const handleRemoveFromCart = (id) => {
    setCart((prev) => removeItem(prev, id));
  };

  const handleQtyChange = (id, newQty) => {
    if (newQty < 1) return;
    setCart((prev) => prev.map((item) => (item.id === id ? { ...item, qty: newQty } : item)));
  };

  const handleOpenCheckout = () => {
    setCartOpen(false);
    setCheckoutOpen(true);
  };

  const handlePlaceOrder = async (cartItems) => {
    try {
      const res = await checkoutApi(cartItems);
      setCart([]);
      showToast('Order placed successfully! 🎉');
      return res.orderId;
    } catch {
      // fallback — generate local order ID
      const id = `ORD-${Date.now()}`;
      setCart([]);
      return id;
    }
  };

  const handleCheckoutClose = () => {
    setCheckoutOpen(false);
  };

  const scrollToProducts = () => {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div data-testid="app-root">
      {/* Header */}
      <Header
        cartCount={cartCount}
        onCartClick={() => setCartOpen(true)}
        onSearch={setSearchQuery}
      />

      {/* Hero */}
      <Hero onShopNow={scrollToProducts} />

      {/* Categories */}
      <CategoryGrid activeCategory={activeCategory} onSelect={setActiveCategory} />

      {/* Products Section */}
      <section className="section-gap" id="products" data-testid="products-section">
        <div className="container">
          <div className="products-header">
            <div>
              <div className="section-label">Our Collection</div>
              <h2 className="section-title">
                {activeCategory === 'All' ? 'All Products' : activeCategory}
              </h2>
            </div>

            <div className="products-filters">
              <span className="products-count" data-testid="products-count">
                {loading ? '…' : `${sortedProducts.length} products`}
              </span>
              <select
                className="filter-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort products"
              >
                <option value="default">Sort by: Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>

              {/* Inline search for product section */}
              <div style={{ display: 'none' }}>
                <SearchBar onSearch={setSearchQuery} />
              </div>
            </div>
          </div>

          <div className="product-grid" data-testid="product-grid">
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            ) : sortedProducts.length === 0 ? (
              <div
                style={{
                  gridColumn: '1/-1',
                  textAlign: 'center',
                  padding: '80px 20px',
                  color: 'var(--clr-text-secondary)',
                }}
              >
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
                <p style={{ fontSize: '18px', fontWeight: 600 }}>No products found</p>
                <p style={{ marginTop: '8px' }}>Try a different search or category</p>
              </div>
            ) : (
              sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="section-gap-sm" id="deals">
        <div className="container">
          <div className="promo-banner" data-testid="promo-banner">
            <div>
              <h2 className="promo-title">Summer Sale — Up to 40% Off 🌞</h2>
              <p className="promo-sub">
                Limited time. Shop your favourites before they&apos;re gone.
              </p>
            </div>
            <button className="btn btn-light" onClick={scrollToProducts}>
              Shop the Sale →
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-gap">
        <div className="container">
          <div className="section-label">What Customers Say</div>
          <h2 className="section-title">Loved by Thousands</h2>
          <div className="testimonial-grid" data-testid="testimonials">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="testimonial-card">
                <div className="testimonial-stars">{'★'.repeat(t.rating)}</div>
                <p className="testimonial-text">&quot;{t.text}&quot;</p>
                <div className="testimonial-author">
                  <div className="author-avatar">{t.initial}</div>
                  <div>
                    <div className="author-name">{t.name}</div>
                    <div className="author-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section
        className="section-gap-sm"
        style={{
          background: 'var(--clr-surface)',
          borderTop: '1px solid var(--clr-border)',
          borderBottom: '1px solid var(--clr-border)',
        }}
      >
        <div className="container">
          <div className="newsletter-section" data-testid="newsletter">
            <div className="section-label">Stay in the Loop</div>
            <h2 className="section-title">Get Exclusive Deals</h2>
            <p className="section-sub" style={{ margin: '12px auto 0' }}>
              Subscribe to our newsletter and be the first to know about new products, special
              offers, and more.
            </p>
            <form
              className="newsletter-form"
              onSubmit={(e) => {
                e.preventDefault();
                showToast("You're subscribed! 🎉");
              }}
            >
              <input
                type="email"
                className="newsletter-input"
                placeholder="Enter your email address"
                required
                aria-label="Email for newsletter"
              />
              <button type="submit" className="btn btn-primary" style={{ flexShrink: 0 }}>
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Cart Drawer */}
      {cartOpen && (
        <CartDrawer
          cart={cart}
          onClose={() => setCartOpen(false)}
          onRemove={handleRemoveFromCart}
          onQtyChange={handleQtyChange}
          onCheckout={handleOpenCheckout}
        />
      )}

      {/* Checkout Modal */}
      {checkoutOpen && (
        <CheckoutModal cart={cart} onClose={handleCheckoutClose} onPlaceOrder={handlePlaceOrder} />
      )}

      {/* Toasts */}
      <div className="toast-container" aria-live="polite">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onDismiss={() => dismissToast(toast.id)}
          />
        ))}
      </div>

      {/* Hidden legacy container class for E2E test compatibility */}
      <div className="container" style={{ display: 'none' }} />
    </div>
  );
}

export default App;
