function Hero({ onShopNow }) {
  return (
    <section className="hero" data-testid="hero-section">
      {/* Left — Editorial Text */}
      <div className="hero-content slide-up">
        <div className="hero-label">
          SS 2026 Collection
        </div>

        <h1 className="hero-title">
          Dressed for<br />
          <em>Those Who</em><br />
          Notice
        </h1>

        <p className="hero-sub">
          Elevated essentials and seasonal statements — curated for the discerning wardrobe.
        </p>

        <div className="hero-actions">
          <button
            className="btn btn-primary"
            onClick={onShopNow}
            data-testid="hero-cta-btn"
            style={{ padding: '15px 36px' }}
          >
            Explore Collection
          </button>
          <button
            className="btn btn-outline"
            style={{ padding: '15px 36px' }}
          >
            Our Story
          </button>
        </div>
      </div>

      {/* Right — Fashion Image */}
      <div className="hero-image-panel fade-in">
        <img
          src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=85"
          alt="Maison SS 2026 editorial"
          style={{ objectPosition: 'center top' }}
        />
      </div>

      {/* Scroll hint */}
      <div className="hero-scroll-hint">
        <div className="hero-scroll-line" />
        Scroll to explore
      </div>
    </section>
  );
}

export default Hero;
