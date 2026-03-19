import SearchBar from './SearchBar';

function Header({ cartCount, onCartClick, onSearch }) {
  return (
    <header className="header" data-testid="header">
      <div className="container">
        <div className="header-inner">
          <div className="logo">⚡ ShopSmart</div>

          <nav className="header-nav">
            <a href="#products" className="nav-link active">
              Shop
            </a>
            <a href="#categories" className="nav-link">
              Categories
            </a>
            <a href="#deals" className="nav-link">
              Deals
            </a>
            <a href="#about" className="nav-link">
              About
            </a>
          </nav>

          <SearchBar onSearch={onSearch} placeholder="Search 1000+ products..." />

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <button className="btn-icon" aria-label="Wishlist" title="Wishlist">
              ♡
            </button>

            <div className="cart-btn-wrap">
              <button
                className="btn-icon"
                onClick={onCartClick}
                aria-label="Open cart"
                data-testid="cart-icon-btn"
              >
                🛒
              </button>
              {cartCount > 0 && (
                <span className="cart-badge" data-testid="cart-badge">
                  {cartCount}
                </span>
              )}
            </div>

            {/* <button className="btn btn-primary" style={{ padding: '9px 18px', fontSize: '13px' }}>
              Sign In
            </button> */}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
