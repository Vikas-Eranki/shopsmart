import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CartDrawer from '../../components/CartDrawer';

describe('CartDrawer — Integration Tests', () => {
  const mockCart = [
    { id: 1, name: 'Widget', price: 1000, qty: 2, image: '' },
    { id: 2, name: 'Gadget', price: 2500, qty: 1, image: '' },
  ];

  // Test 1
  it('displays cart items and total price', () => {
    render(
      <CartDrawer
        cart={mockCart}
        onClose={vi.fn()}
        onRemove={vi.fn()}
        onQtyChange={vi.fn()}
        onCheckout={vi.fn()}
      />
    );
    expect(screen.getByTestId('cart-item-1')).toBeInTheDocument();
    expect(screen.getByTestId('cart-item-2')).toBeInTheDocument();
    expect(screen.getByTestId('cart-total')).toBeDefined();
  });

  // Test 2
  it('shows empty state when cart is empty', () => {
    render(
      <CartDrawer
        cart={[]}
        onClose={vi.fn()}
        onRemove={vi.fn()}
        onQtyChange={vi.fn()}
        onCheckout={vi.fn()}
      />
    );
    expect(screen.getByTestId('cart-empty')).toBeInTheDocument();
    expect(screen.queryByTestId('checkout-btn')).not.toBeInTheDocument();
  });

  // Test 3
  it('calls onCheckout when checkout button is clicked', () => {
    const mockCheckout = vi.fn();
    render(
      <CartDrawer
        cart={mockCart}
        onClose={vi.fn()}
        onRemove={vi.fn()}
        onQtyChange={vi.fn()}
        onCheckout={mockCheckout}
      />
    );
    fireEvent.click(screen.getByTestId('checkout-btn'));
    expect(mockCheckout).toHaveBeenCalledTimes(1);
  });

  // Test 4
  it('calls onClose when close button is clicked', () => {
    const mockClose = vi.fn();
    render(
      <CartDrawer
        cart={mockCart}
        onClose={mockClose}
        onRemove={vi.fn()}
        onQtyChange={vi.fn()}
        onCheckout={vi.fn()}
      />
    );
    fireEvent.click(screen.getByTestId('close-cart-btn'));
    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  // Test 5
  it('calls onRemove with item id when remove button is clicked', () => {
    const mockRemove = vi.fn();
    render(
      <CartDrawer
        cart={mockCart}
        onClose={vi.fn()}
        onRemove={mockRemove}
        onQtyChange={vi.fn()}
        onCheckout={vi.fn()}
      />
    );
    fireEvent.click(screen.getByTestId('remove-item-1'));
    expect(mockRemove).toHaveBeenCalledWith(1);
  });

  // Test 6
  it('renders overlay that can close the drawer', () => {
    const mockClose = vi.fn();
    render(
      <CartDrawer
        cart={[]}
        onClose={mockClose}
        onRemove={vi.fn()}
        onQtyChange={vi.fn()}
        onCheckout={vi.fn()}
      />
    );
    fireEvent.click(screen.getByTestId('cart-overlay'));
    expect(mockClose).toHaveBeenCalledTimes(1);
  });
});
