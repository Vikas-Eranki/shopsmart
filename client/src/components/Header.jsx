import { useState, useEffect } from 'react';
import SearchBar from './SearchBar';

function Header({ cartCount, onCartClick, onSearch }) {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <header
      className="header"
      data-testid="header"
      style={scrolled ? { boxShadow: '0 1px 20px rgba(26,26,24,0.07)' } : {}}
    >
      <div className="container">
        <div className="header-inner">
          {/* Logo */}
          <div className="logo">Maison</div>

          {/* Nav */}
          <nav className="header-nav">
            <a href="#products" className="nav-link active">Women</a>
            <a href="#products" className="nav-link">Men</a>
            <a href="#products" className="nav-link">New</a>
            <a href="#collections" className="nav-link">Collections</a>
            <a href="#deals" className="nav-link">Sale</a>
          </nav>

          {/* Right Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0, marginLeft: 'auto' }}>
            {/* Search */}
            {searchOpen ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <SearchBar onSearch={onSearch} placeholder="Search collections…" />
                <button
                  className="btn-icon"
                  onClick={() => { setSearchOpen(false); onSearch(''); }}
                  aria-label="Close search"
                  style={{ fontSize: '18px', color: 'var(--clr-text-muted)' }}
                >
                  ✕
                </button>
              </div>
            ) : (
              <button
                className="btn-icon"
                aria-label="Search"
                onClick={() => setSearchOpen(true)}
                title="Search"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </button>
            )}

            {/* Wishlist */}
            <button className="btn-icon" aria-label="Wishlist" title="Wishlist">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </button>

            {/* Cart */}
            <div className="cart-btn-wrap">
              <button
                className="btn-icon"
                onClick={onCartClick}
                aria-label="Open cart"
                data-testid="cart-icon-btn"
                title="Shopping bag"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
              </button>
              {cartCount > 0 && (
                <span className="cart-badge" data-testid="cart-badge">{cartCount}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
