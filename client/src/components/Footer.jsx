function Footer() {
  return (
    <footer className="footer" data-testid="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="logo" style={{ fontSize: '22px' }}>
              ⚡ ShopSmart
            </div>
            <p>
              Your one-stop destination for premium products across electronics, fashion, lifestyle,
              and home. Curated for the modern shopper.
            </p>
            <div className="footer-social">
              <a href="#" className="social-btn" aria-label="Twitter">
                𝕏
              </a>
              <a href="#" className="social-btn" aria-label="Instagram">
                📸
              </a>
              <a href="#" className="social-btn" aria-label="Facebook">
                𝔽
              </a>
              <a href="#" className="social-btn" aria-label="LinkedIn">
                in
              </a>
            </div>
          </div>

          <div>
            <div className="footer-col-title">Shop</div>
            <ul className="footer-links">
              <li>
                <a href="#" className="footer-link">
                  Electronics
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Fashion
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Lifestyle
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Home & Living
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  New Arrivals
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Best Sellers
                </a>
              </li>
            </ul>
          </div>

          <div>
            <div className="footer-col-title">Support</div>
            <ul className="footer-links">
              <li>
                <a href="#" className="footer-link">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Order Status
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Returns & Refunds
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Track Package
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Size Guide
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          <div>
            <div className="footer-col-title">Company</div>
            <ul className="footer-links">
              <li>
                <a href="#" className="footer-link">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Press
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">© 2026 ShopSmart. All rights reserved.</p>
          <div className="trust-badges">
            {/* <span className="trust-badge">🔒 SSL Secured</span> */}
            <span className="trust-badge">🚚 Free Shipping ₹999+</span>
            <span className="trust-badge">↩️ 30-Day Returns</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
