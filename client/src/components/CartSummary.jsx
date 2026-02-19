import { formatPrice } from '../utils/formatters';
import { getTotal, getItemCount } from '../utils/cartUtils';

function CartSummary({ cart = [], onCheckout, onRemove }) {
    const total = getTotal(cart);
    const itemCount = getItemCount(cart);

    if (cart.length === 0) {
        return (
            <div className="cart-summary" data-testid="cart-summary">
                <h2>Your Cart</h2>
                <p data-testid="cart-empty">Your cart is empty</p>
            </div>
        );
    }

    return (
        <div className="cart-summary" data-testid="cart-summary">
            <h2>Your Cart</h2>
            <p data-testid="cart-item-count">{itemCount} item{itemCount !== 1 ? 's' : ''}</p>
            <ul data-testid="cart-items-list">
                {cart.map((item) => (
                    <li key={item.id} data-testid={`cart-item-${item.id}`}>
                        <span>{item.name}</span>
                        <span> x{item.qty}</span>
                        <span> — {formatPrice(item.price * item.qty)}</span>
                        {onRemove && (
                            <button
                                data-testid={`remove-item-${item.id}`}
                                onClick={() => onRemove(item.id)}
                            >
                                Remove
                            </button>
                        )}
                    </li>
                ))}
            </ul>
            <p className="cart-total" data-testid="cart-total">
                Total: {formatPrice(total)}
            </p>
            <button
                className="checkout-btn"
                data-testid="checkout-btn"
                onClick={() => onCheckout && onCheckout(cart)}
            >
                Checkout
            </button>
        </div>
    );
}

export default CartSummary;
