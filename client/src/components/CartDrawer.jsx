import { formatPrice } from '../utils/formatters';

function CartDrawer({ cart, onClose, onRemove, onQtyChange, onCheckout }) {
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const count = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <>
      <div className="cart-overlay" onClick={onClose} data-testid="cart-overlay" />
      <div className="cart-drawer" data-testid="cart-drawer">
        <div className="cart-header">
          <h2 className="cart-title">
            Your Cart{' '}
            {count > 0 && (
              <span style={{ color: 'var(--clr-accent)', fontWeight: 700 }}>({count})</span>
            )}
          </h2>
          <button
            className="close-btn"
            onClick={onClose}
            aria-label="Close cart"
            data-testid="close-cart-btn"
          >
            ✕
          </button>
        </div>

        <div className="cart-body">
          {cart.length === 0 ? (
            <div className="cart-empty" data-testid="cart-empty">
              <div className="cart-empty-icon">🛒</div>
              <p style={{ fontWeight: 600 }}>Your cart is empty</p>
              <p style={{ fontSize: '13px' }}>Add something awesome to get started</p>
              <button className="btn btn-primary" onClick={onClose} style={{ marginTop: '16px' }}>
                Continue Shopping
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="cart-item" data-testid={`cart-item-${item.id}`}>
                <img
                  src={
                    item.image ||
                    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&q=80'
                  }
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
                    >
                      −
                    </button>
                    <span className="qty-value">{item.qty}</span>
                    <button className="qty-btn" onClick={() => onQtyChange(item.id, item.qty + 1)}>
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

        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total-row">
              <span className="cart-total-label">Subtotal ({count} items)</span>
              <span className="cart-total-amount" data-testid="cart-total">
                {formatPrice(total)}
              </span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--clr-text-muted)', textAlign: 'center' }}>
              🚚 Free shipping on orders over ₹999
            </div>
            <button
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '14px' }}
              onClick={onCheckout}
              data-testid="checkout-btn"
            >
              Proceed to Checkout →
            </button>
            <button
              className="btn btn-ghost"
              style={{ width: '100%', justifyContent: 'center' }}
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
