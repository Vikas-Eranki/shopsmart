function Hero({ onShopNow }) {
    return (
        <section className="hero" data-testid="hero-section">
            <div className="hero-bg" />
            <div className="container">
                <div className="hero-grid">
                    <div className="slide-up">
                        <div className="hero-label">
                            <span className="badge badge-accent">🔥 New Season Sale</span>
                        </div>
                        <h1 className="hero-title">
                            Shop the <em>Future</em> of
                            <br />Smart Living
                        </h1>
                        <p className="hero-sub">
                            Discover thousands of curated products — from cutting-edge electronics
                            to premium lifestyle essentials. Free shipping on orders over ₹999.
                        </p>
                        <div className="hero-actions">
                            <button
                                className="btn btn-primary"
                                style={{ padding: '14px 32px', fontSize: '15px' }}
                                onClick={onShopNow}
                                data-testid="hero-cta-btn"
                            >
                                Shop Now →
                            </button>
                            <button
                                className="btn btn-outline"
                                style={{ padding: '14px 32px', fontSize: '15px' }}
                            >
                                View Deals
                            </button>
                        </div>
                        <div className="hero-stats">
                            <div>
                                <div className="hero-stat-value">20K+</div>
                                <div className="hero-stat-label">Products</div>
                            </div>
                            <div>
                                <div className="hero-stat-value">4.9★</div>
                                <div className="hero-stat-label">Avg Rating</div>
                            </div>
                            <div>
                                <div className="hero-stat-value">1M+</div>
                                <div className="hero-stat-label">Customers</div>
                            </div>
                        </div>
                    </div>

                    <div className="hero-image-wrap fade-in">
                        <div className="hero-product-card">
                            <img
                                src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80"
                                alt="Featured product"
                            />
                            <div className="hero-float-badge">
                                <div>
                                    <div className="hero-float-name">Smart Watch Pro</div>
                                    <div style={{ fontSize: '11px', color: 'var(--clr-text-secondary)', marginTop: '2px' }}>
                                        ⭐ 4.5 · 876 reviews
                                    </div>
                                </div>
                                <div className="hero-float-price">₹12,999</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Hero;
