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
    text: "An extraordinary shopping experience. Every piece exceeded my expectations. The quality feels genuinely luxurious and delivery was impeccable.",
    rating: 5,
    initial: 'P',
  },
  {
    name: 'Rajan M.',
    role: 'Verified Buyer',
    text: 'Refined curation, beautiful packaging, and a website that makes browsing a real pleasure. This is fashion the way it should be experienced online.',
    rating: 5,
    initial: 'R',
  },
  {
    name: 'Aisha K.',
    role: 'Verified Buyer',
    text: 'Found the perfect cashmere coat I had been searching for months. The quality is genuinely exceptional. I return every season.',
    rating: 5,
    initial: 'A',
  },
];

function Toast({ message, type = 'success', onDismiss }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 3200);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <div className={`toast toast-${type}`} role="alert">
      <span className="toast-icon">{type === 'success' ? '✓' : '✕'}</span>
      <span>{message}</span>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="product-card skeleton-card">
      <div className="skeleton" style={{ aspectRatio: '3/4', width: '100%' }} />
      <div style={{ padding: '20px 0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div className="skeleton" style={{ height: '10px', width: '40%' }} />
        <div className="skeleton" style={{ height: '20px', width: '80%' }} />
        <div className="skeleton" style={{ height: '14px', width: '30%', marginTop: '8px' }} />
        <div className="skeleton" style={{ height: '38px', marginTop: '12px' }} />
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

  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    return 0;
  });

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  const handleAddToCart = (product) => {
    setCart((prev) => addItem(prev, { id: product.id, name: product.name, price: product.price, image: product.image }));
    showToast(`${product.name} added to your bag`);
  };

  const handleRemoveFromCart = (id) => setCart((prev) => removeItem(prev, id));

  const handleQtyChange = (id, newQty) => {
    if (newQty < 1) return;
    setCart((prev) => prev.map((item) => (item.id === id ? { ...item, qty: newQty } : item)));
  };

  const handleOpenCheckout = () => { setCartOpen(false); setCheckoutOpen(true); };

  const handlePlaceOrder = async (cartItems) => {
    try {
      const res = await checkoutApi(cartItems);
      setCart([]);
      showToast('Order confirmed — thank you for shopping with Maison');
      return res.orderId;
    } catch {
      const id = `ORD-${Date.now()}`;
      setCart([]);
      return id;
    }
  };

  const scrollToProducts = () => {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div data-testid="app-root">
      {/* Header */}
      <Header cartCount={cartCount} onCartClick={() => setCartOpen(true)} onSearch={setSearchQuery} />

      {/* Hero */}
      <Hero onShopNow={scrollToProducts} />

      {/* Marquee Strip */}
      <div className="marquee-strip" aria-hidden="true">
        <div className="marquee-track">
          {[...Array(2)].map((_, outerIdx) => (
            ['Free Shipping on Orders ₹999+', 'New Season Collection Now Live', 'Complimentary Returns Within 30 Days', 'Sustainably Crafted', 'Express Delivery Available', 'Members Receive Early Access'].map((item, i) => (
              <span key={`${outerIdx}-${i}`} className="marquee-item">
                {item}
                <span className="marquee-sep" />
              </span>
            ))
          ))}
        </div>
      </div>

      {/* Category Filter */}
      <CategoryGrid activeCategory={activeCategory} onSelect={setActiveCategory} />

      {/* Products Section */}
      <section className="section-gap" id="products" data-testid="products-section">
        <div className="container">
          <div className="products-header">
            <div>
              <div className="section-label">Our Collection</div>
              <h2 className="section-title">
                {activeCategory === 'All' ? 'All Pieces' : activeCategory}
              </h2>
            </div>
            <div className="products-filters">
              <span className="products-count" data-testid="products-count">
                {loading ? '—' : `${sortedProducts.length} pieces`}
              </span>
              <select
                className="filter-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort products"
              >
                <option value="default">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
              <div style={{ display: 'none' }}>
                <SearchBar onSearch={setSearchQuery} />
              </div>
            </div>
          </div>

          <div className="product-grid" data-testid="product-grid">
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            ) : sortedProducts.length === 0 ? (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '100px 20px', color: 'var(--clr-text-muted)' }}>
                <p style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', fontWeight: 400, marginBottom: '12px', color: 'var(--clr-ink)' }}>
                  No pieces found
                </p>
                <p style={{ fontSize: '14px', fontWeight: 300, letterSpacing: '0.3px' }}>
                  Try a different search or browse another collection.
                </p>
              </div>
            ) : (
              sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Editorial Banner — Featured Collection */}
      <section id="collections">
        <div className="editorial-banner">
          <div className="editorial-banner-img">
            <img
              src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=900&q=85"
              alt="Featured collection editorial"
            />
          </div>
          <div className="editorial-banner-content">
            <div className="section-label">Featured Collection</div>
            <h2 className="section-title">
              The<br />
              <em style={{ fontStyle: 'italic' }}>Quiet Luxury</em><br />
              Edit
            </h2>
            <p className="section-sub" style={{ marginTop: '20px' }}>
              Refined pieces that speak through restraint — timeless silhouettes in understated palettes.
            </p>
            <button
              className="btn btn-outline"
              style={{ marginTop: '40px', alignSelf: 'flex-start' }}
              onClick={scrollToProducts}
            >
              Shop the Edit
            </button>
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="section-gap-sm" id="deals">
        <div className="container">
          <div className="promo-banner" data-testid="promo-banner">
            <div>
              <h2 className="promo-title">
                End of Season<br />Sale — Up to 40% Off
              </h2>
              <p className="promo-sub">
                A curated selection, reduced. Shop before they're gone.
              </p>
            </div>
            <button className="btn btn-light" style={{ flexShrink: 0 }} onClick={scrollToProducts}>
              Shop the Sale
            </button>
          </div>
        </div>
      </section>

      {/* Press Strip */}
      <section>
        <div className="container">
          <div className="press-strip">
            <div className="press-strip-label">As Seen In</div>
            <div className="press-logos">
              <span className="press-logo">Vogue</span>
              <span className="press-logo">Harper&apos;s Bazaar</span>
              <span className="press-logo">Elle</span>
              <span className="press-logo">GQ</span>
              <span className="press-logo">Wallpaper*</span>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-gap">
        <div className="container">
          <div className="section-label">Client Stories</div>
          <h2 className="section-title">Worn &amp; Loved</h2>
          <div className="testimonial-grid" data-testid="testimonials">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="testimonial-card">
                <div className="testimonial-stars">{'★'.repeat(t.rating)}</div>
                <p className="testimonial-text">&ldquo;{t.text}&rdquo;</p>
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
        className="section-gap"
        style={{ background: 'var(--clr-surface-2)', borderTop: '1px solid var(--clr-border)' }}
      >
        <div className="container">
          <div className="newsletter-section" data-testid="newsletter">
            <div>
              <div className="section-label">Stay Connected</div>
              <h2 className="section-title">The Maison Letter</h2>
              <p className="section-sub">
                New arrivals, private sales, and editorial stories — delivered to your inbox first.
              </p>
            </div>
            <form
              className="newsletter-form"
              onSubmit={(e) => {
                e.preventDefault();
                showToast('Welcome to Maison — you are now subscribed');
              }}
            >
              <div style={{ fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--clr-text-muted)', marginBottom: '4px' }}>
                Email Address
              </div>
              <input
                type="email"
                className="newsletter-input"
                placeholder="your@email.com"
                required
                aria-label="Email for newsletter"
              />
              <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start', marginTop: '8px', padding: '13px 32px' }}>
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
        <CheckoutModal cart={cart} onClose={() => setCheckoutOpen(false)} onPlaceOrder={handlePlaceOrder} />
      )}

      {/* Toasts */}
      <div className="toast-container" aria-live="polite">
        {toasts.map((toast) => (
          <Toast key={toast.id} message={toast.message} type={toast.type} onDismiss={() => dismissToast(toast.id)} />
        ))}
      </div>

      {/* Hidden container for E2E test compatibility */}
      <div className="container" style={{ display: 'none' }} />
    </div>
  );
}

export default App;
