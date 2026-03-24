import { useState } from 'react';
import { formatPrice } from '../utils/formatters';

const STEPS = ['Review', 'Shipping', 'Confirmation'];

function CheckoutModal({ cart, onClose, onPlaceOrder }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ name: '', email: '', address: '', city: '', pin: '', phone: '' });
  const [orderId, setOrderId] = useState('');
  const [placing, setPlacing] = useState(false);

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const handleInput = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleConfirm = async () => {
    setPlacing(true);
    try {
      const id = await onPlaceOrder(cart);
      setOrderId(id || `ORD-${Date.now()}`);
      setStep(2);
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="modal-overlay" data-testid="checkout-modal">
      <div className="modal">
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">Checkout</h2>
          {step < 2 && (
            <button
              className="close-btn"
              onClick={onClose}
              aria-label="Close"
              data-testid="close-modal-btn"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          )}
        </div>

        <div className="modal-body">
          {/* Progress Steps */}
          <div className="progress-steps">
            {STEPS.map((label, i) => (
              <div key={label} className="progress-step">
                <div className={`step-circle ${i < step ? 'done' : i === step ? 'active' : ''}`}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span className={`step-label ${i === step ? 'active' : ''}`}>{label}</span>
                {i < STEPS.length - 1 && <div className={`step-line${i < step ? ' done' : ''}`} />}
              </div>
            ))}
          </div>

          {/* Step 0 — Cart Review */}
          {step === 0 && (
            <div data-testid="step-cart-review">
              <div style={{ maxHeight: '280px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0', marginBottom: '24px', border: '1px solid var(--clr-border)' }}>
                {cart.map((item) => (
                  <div key={item.id} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px 20px',
                    borderBottom: '1px solid var(--clr-border)',
                    fontSize: '14px',
                  }}>
                    <div>
                      <div style={{ fontFamily: 'var(--font-serif)', fontSize: '16px', fontWeight: 400 }}>{item.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--clr-text-muted)', marginTop: '4px', letterSpacing: '0.5px' }}>
                        Qty: {item.qty}
                      </div>
                    </div>
                    <div style={{ fontFamily: 'var(--font-serif)', fontSize: '16px' }}>{formatPrice(item.price * item.qty)}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0', borderTop: '1px solid var(--clr-border)', marginBottom: '24px' }}>
                <span style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--clr-text-secondary)' }}>Total</span>
                <span style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', color: 'var(--clr-ink)' }}>{formatPrice(total)}</span>
              </div>
              <button
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '16px' }}
                onClick={() => setStep(1)}
                data-testid="next-to-shipping-btn"
              >
                Continue to Shipping
              </button>
            </div>
          )}

          {/* Step 1 — Shipping */}
          {step === 1 && (
            <div data-testid="step-shipping">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input className="form-input" name="name" value={form.name} onChange={handleInput} placeholder="Your name" />
              </div>
              <div className="form-group">
                <label className="form-label">Email *</label>
                <input className="form-input" name="email" type="email" value={form.email} onChange={handleInput} placeholder="your@email.com" />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input className="form-input" name="phone" value={form.phone} onChange={handleInput} placeholder="+91 00000 00000" />
              </div>
              <div className="form-group">
                <label className="form-label">Delivery Address *</label>
                <input className="form-input" name="address" value={form.address} onChange={handleInput} placeholder="Street address" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input className="form-input" name="city" value={form.city} onChange={handleInput} placeholder="City" />
                </div>
                <div className="form-group">
                  <label className="form-label">PIN Code</label>
                  <input className="form-input" name="pin" value={form.pin} onChange={handleInput} placeholder="000000" />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button
                  className="btn btn-outline"
                  style={{ flex: 1, justifyContent: 'center' }}
                  onClick={() => setStep(0)}
                >
                  ← Back
                </button>
                <button
                  className="btn btn-primary"
                  style={{ flex: 2, justifyContent: 'center', padding: '16px', opacity: (!form.name || !form.email || !form.address) ? 0.5 : 1 }}
                  onClick={handleConfirm}
                  data-testid="place-order-btn"
                  disabled={!form.name || !form.email || !form.address || placing}
                >
                  {placing ? 'Placing Order…' : 'Place Order'}
                </button>
              </div>
            </div>
          )}

          {/* Step 2 — Confirmation */}
          {step === 2 && (
            <div className="order-confirm" data-testid="step-confirmation">
              <div className="confirm-icon">
                <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--clr-accent)' }}>
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <h3 className="confirm-title">Order Confirmed</h3>
              <p className="confirm-sub">
                Thank you for shopping with Maison. Your order is being prepared with care.
              </p>
              <div className="confirm-order-id">
                Order Reference: <strong style={{ fontFamily: 'var(--font-serif)', fontSize: '15px' }}>{orderId}</strong>
              </div>
              <button
                className="btn btn-primary"
                style={{ marginTop: '32px', padding: '14px 40px' }}
                onClick={onClose}
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CheckoutModal;
