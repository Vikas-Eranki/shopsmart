import { useState } from 'react';
import { formatPrice } from '../utils/formatters';

const STEPS = ['Cart Review', 'Shipping', 'Confirmation'];

function CheckoutModal({ cart, onClose, onPlaceOrder }) {
    const [step, setStep] = useState(0);
    const [form, setForm] = useState({ name: '', email: '', address: '', city: '', pin: '', phone: '' });
    const [orderId, setOrderId] = useState('');

    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

    const handleInput = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

    const handleConfirm = async () => {
        const id = await onPlaceOrder(cart);
        setOrderId(id || `ORD-${Date.now()}`);
        setStep(2);
    };

    return (
        <div className="modal-overlay" data-testid="checkout-modal">
            <div className="modal">
                <div className="modal-header">
                    <h2 className="modal-title">Checkout</h2>
                    {step < 2 && (
                        <button className="close-btn" onClick={onClose} aria-label="Close" data-testid="close-modal-btn">✕</button>
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
                            <div style={{ maxHeight: '280px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                                {cart.map((item) => (
                                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--clr-surface-2)', borderRadius: 'var(--radius-md)', fontSize: '14px' }}>
                                        <div>
                                            <div style={{ fontWeight: 600 }}>{item.name}</div>
                                            <div style={{ color: 'var(--clr-text-muted)', marginTop: '2px' }}>Qty: {item.qty}</div>
                                        </div>
                                        <div style={{ fontWeight: 700 }}>{formatPrice(item.price * item.qty)}</div>
                                    </div>
                                ))}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 700, padding: '16px 0', borderTop: '1px solid var(--clr-border)', marginBottom: '20px' }}>
                                <span>Total</span>
                                <span style={{ color: 'var(--clr-accent)' }}>{formatPrice(total)}</span>
                            </div>
                            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px' }} onClick={() => setStep(1)} data-testid="next-to-shipping-btn">
                                Continue to Shipping →
                            </button>
                        </div>
                    )}

                    {/* Step 1 — Shipping */}
                    {step === 1 && (
                        <div data-testid="step-shipping">
                            <div className="form-group">
                                <label className="form-label">Full Name *</label>
                                <input className="form-input" name="name" value={form.name} onChange={handleInput} placeholder="John Doe" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Email *</label>
                                <input className="form-input" name="email" type="email" value={form.email} onChange={handleInput} placeholder="john@example.com" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Phone</label>
                                <input className="form-input" name="phone" value={form.phone} onChange={handleInput} placeholder="+91 98765 43210" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Delivery Address *</label>
                                <input className="form-input" name="address" value={form.address} onChange={handleInput} placeholder="123 Main Street, Apartment 4B" />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">City</label>
                                    <input className="form-input" name="city" value={form.city} onChange={handleInput} placeholder="Mumbai" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">PIN Code</label>
                                    <input className="form-input" name="pin" value={form.pin} onChange={handleInput} placeholder="400001" />
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                                <button className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setStep(0)}>← Back</button>
                                <button
                                    className="btn btn-primary"
                                    style={{ flex: 2, justifyContent: 'center', padding: '14px' }}
                                    onClick={handleConfirm}
                                    data-testid="place-order-btn"
                                    disabled={!form.name || !form.email || !form.address}
                                >
                                    Place Order →
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 2 — Confirmation */}
                    {step === 2 && (
                        <div className="order-confirm" data-testid="step-confirmation">
                            <div className="confirm-icon">🎉</div>
                            <h3 className="confirm-title">Order Placed!</h3>
                            <p className="confirm-sub">Thank you for shopping with ShopSmart. Your order is on its way!</p>
                            <div className="confirm-order-id">
                                Order ID: <strong>{orderId}</strong>
                            </div>
                            <button className="btn btn-primary" style={{ marginTop: '24px', padding: '13px 32px' }} onClick={onClose}>
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
