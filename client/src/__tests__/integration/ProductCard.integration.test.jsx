import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ProductCard from '../../components/ProductCard';

describe('ProductCard — Integration Tests', () => {
    const mockProduct = {
        id: 42,
        name: 'Wireless Mouse',
        category: 'Electronics',
        price: 2999,
        originalPrice: 3999,
        rating: 4.2,
        reviews: 150,
        image: '/mouse.png',
        badge: 'Sale',
        inStock: true,
    };

    // Test 1
    it('renders product name, price, and image', () => {
        render(<ProductCard product={mockProduct} />);
        expect(screen.getByTestId('product-name')).toHaveTextContent('Wireless Mouse');
        expect(screen.getByTestId('product-price')).toBeDefined();
        expect(screen.getByTestId('product-image')).toHaveAttribute('src', '/mouse.png');
    });

    // Test 2 — NEW: onAddToCart is called with the full product object
    it('calls onAddToCart with the full product when button is clicked', () => {
        const mockCallback = vi.fn();
        render(<ProductCard product={mockProduct} onAddToCart={mockCallback} />);
        fireEvent.click(screen.getByTestId('add-to-cart-btn'));
        expect(mockCallback).toHaveBeenCalledWith(mockProduct);
        expect(mockCallback).toHaveBeenCalledTimes(1);
    });

    // Test 3 — NEW: category label is shown
    it('renders category label', () => {
        render(<ProductCard product={mockProduct} />);
        expect(screen.getByText('Electronics')).toBeInTheDocument();
    });

    // Test 4
    it('does not crash when description is not provided', () => {
        const productNoDesc = { ...mockProduct, description: undefined };
        render(<ProductCard product={productNoDesc} />);
        expect(screen.getByTestId('product-card')).toBeInTheDocument();
    });

    // Test 5
    it('returns null when product is null', () => {
        const { container } = render(<ProductCard product={null} />);
        expect(container.innerHTML).toBe('');
    });

    // Test 6 — updated fallback URL
    it('uses a fallback image when product image is missing', () => {
        const noImageProduct = { ...mockProduct, image: undefined };
        render(<ProductCard product={noImageProduct} />);
        const img = screen.getByTestId('product-image');
        expect(img).toHaveAttribute('src');
        expect(img.getAttribute('src')).toBeTruthy();
    });
});
