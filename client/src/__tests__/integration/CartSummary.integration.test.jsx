import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CartSummary from '../../components/CartSummary';

describe('CartSummary — Integration Tests', () => {
    const mockCart = [
        { id: 1, name: 'Widget', price: 1000, qty: 2 },
        { id: 2, name: 'Gadget', price: 2500, qty: 1 },
    ];

    // Test 1
    it('displays items and total price', () => {
        render(<CartSummary cart={mockCart} onCheckout={vi.fn()} />);

        expect(screen.getByTestId('cart-item-1')).toBeInTheDocument();
        expect(screen.getByTestId('cart-item-2')).toBeInTheDocument();
        expect(screen.getByTestId('cart-total')).toHaveTextContent('$45.00');
    });

    // Test 2
    it('shows empty state when cart is empty', () => {
        render(<CartSummary cart={[]} />);
        expect(screen.getByTestId('cart-empty')).toHaveTextContent('Your cart is empty');
        expect(screen.queryByTestId('checkout-btn')).not.toBeInTheDocument();
    });

    // Test 3
    it('calls onCheckout callback with cart when checkout is clicked', () => {
        const mockCheckout = vi.fn();
        render(<CartSummary cart={mockCart} onCheckout={mockCheckout} />);

        fireEvent.click(screen.getByTestId('checkout-btn'));
        expect(mockCheckout).toHaveBeenCalledWith(mockCart);
        expect(mockCheckout).toHaveBeenCalledTimes(1);
    });

    // Test 4
    it('displays correct item count', () => {
        render(<CartSummary cart={mockCart} onCheckout={vi.fn()} />);
        expect(screen.getByTestId('cart-item-count')).toHaveTextContent('3 items');
    });

    // Test 5
    it('displays singular "item" for single quantity', () => {
        const singleCart = [{ id: 1, name: 'Widget', price: 1000, qty: 1 }];
        render(<CartSummary cart={singleCart} onCheckout={vi.fn()} />);
        expect(screen.getByTestId('cart-item-count')).toHaveTextContent('1 item');
    });

    // Test 6
    it('calls onRemove with item id when remove button is clicked', () => {
        const mockRemove = vi.fn();
        render(<CartSummary cart={mockCart} onCheckout={vi.fn()} onRemove={mockRemove} />);

        fireEvent.click(screen.getByTestId('remove-item-1'));
        expect(mockRemove).toHaveBeenCalledWith(1);
    });
});
