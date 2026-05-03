function Footer() {
  return (
    <footer className="footer" data-testid="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <div className="logo" style={{ fontSize: '22px', marginBottom: '20px' }}>
              Maison
            </div>
            <p>
              Elevated essentials and seasonal collections — curated for those who live with
              intention.
            </p>
            <div className="footer-social">
              <a href="#" className="social-btn" aria-label="Instagram">
                Ig
              </a>
              <a href="#" className="social-btn" aria-label="Pinterest">
                Pt
              </a>
              <a href="#" className="social-btn" aria-label="Twitter">
                𝕏
              </a>
              <a href="#" className="social-btn" aria-label="LinkedIn">
                in
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <div className="footer-col-title">Shop</div>
            <ul className="footer-links">
              <li>
                <a href="#" className="footer-link">
                  Women
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Men
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  New Arrivals
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Collections
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Sale
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <div className="footer-col-title">Support</div>
            <ul className="footer-links">
              <li>
                <a href="#" className="footer-link">
                  Help Centre
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Order Status
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Returns
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Size Guide
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
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
                  Sustainability
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
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">© 2026 Maison. All rights reserved.</p>
          <div className="trust-badges">
            <span className="trust-badge">Free Shipping ₹999+</span>
            <span className="trust-badge">30-Day Returns</span>
            <span className="trust-badge">Secure Checkout</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
