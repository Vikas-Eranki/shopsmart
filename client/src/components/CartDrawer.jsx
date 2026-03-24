import { formatPrice } from '../utils/formatters';

function CartDrawer({ cart, onClose, onRemove, onQtyChange, onCheckout }) {
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const count = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <>
      <div className="cart-overlay" onClick={onClose} data-testid="cart-overlay" />
      <div className="cart-drawer" data-testid="cart-drawer">
        {/* Header */}
        <div className="cart-header">
          <h2 className="cart-title">
            Your Bag{count > 0 && (
              <span style={{ fontSize: '16px', fontWeight: 300, color: 'var(--clr-text-muted)', marginLeft: '8px' }}>
                ({count})
              </span>
            )}
          </h2>
          <button
            className="close-btn"
            onClick={onClose}
            aria-label="Close cart"
            data-testid="close-cart-btn"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="cart-body">
          {cart.length === 0 ? (
            <div className="cart-empty" data-testid="cart-empty">
              <div className="cart-empty-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--clr-text-muted)', opacity: 0.5 }}>
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
              </div>
              <p style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', fontWeight: 400, color: 'var(--clr-ink)' }}>Your bag is empty</p>
              <p style={{ fontSize: '13px', fontWeight: 300, color: 'var(--clr-text-secondary)', textAlign: 'center', lineHeight: 1.7 }}>
                Discover our curated collections and add your favourites.
              </p>
              <button className="btn btn-primary" onClick={onClose} style={{ marginTop: '24px', padding: '13px 32px' }}>
                Explore Collection
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="cart-item" data-testid={`cart-item-${item.id}`}>
                <img
                  src={item.image && item.image.startsWith('http')
                    ? item.image
                    : 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=200&q=80'}
                  alt={item.name}
                  className="cart-item-img"
                />
                <div className="cart-item-details">
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-price">{formatPrice(item.price)}</div>
                  <div className="cart-qty-row">
                    <button
                      className="qty-btn"
                      onClick={() => onQtyChange(item.id, item.qty - 1)}
                      disabled={item.qty <= 1}
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="qty-value">{item.qty}</span>
                    <button
                      className="qty-btn"
                      onClick={() => onQtyChange(item.id, item.qty + 1)}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                    <button
                      className="remove-btn"
                      onClick={() => onRemove(item.id)}
                      data-testid={`remove-item-${item.id}`}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total-row">
              <span className="cart-total-label">Subtotal</span>
              <span className="cart-total-amount" data-testid="cart-total">
                {formatPrice(total)}
              </span>
            </div>
            <p style={{ fontSize: '11px', color: 'var(--clr-text-muted)', letterSpacing: '0.5px', textAlign: 'center' }}>
              Shipping &amp; taxes calculated at checkout
            </p>
            <button
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '16px' }}
              onClick={onCheckout}
              data-testid="checkout-btn"
            >
              Proceed to Checkout
            </button>
            <button
              className="btn btn-ghost"
              style={{ width: '100%', justifyContent: 'center', fontSize: '11px', letterSpacing: '1px' }}
              onClick={onClose}
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default CartDrawer;
