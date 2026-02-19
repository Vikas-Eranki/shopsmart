import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ProductCard from '../../components/ProductCard';

describe('ProductCard — Integration Tests', () => {
    const mockProduct = {
        id: 42,
        name: 'Wireless Mouse',
        price: 2999,
        image: '/mouse.png',
        description: 'A sleek wireless mouse with ergonomic design.',
    };

    // Test 1
    it('renders product name, price, and image', () => {
        render(<ProductCard product={mockProduct} />);

        expect(screen.getByTestId('product-name')).toHaveTextContent('Wireless Mouse');
        expect(screen.getByTestId('product-price')).toHaveTextContent('$29.99');
        expect(screen.getByTestId('product-image')).toHaveAttribute('src', '/mouse.png');
    });

    // Test 2
    it('calls onAddToCart with product id when button is clicked', () => {
        const mockCallback = vi.fn();
        render(<ProductCard product={mockProduct} onAddToCart={mockCallback} />);

        fireEvent.click(screen.getByTestId('add-to-cart-btn'));
        expect(mockCallback).toHaveBeenCalledWith(42);
        expect(mockCallback).toHaveBeenCalledTimes(1);
    });

    // Test 3
    it('renders description when provided', () => {
        render(<ProductCard product={mockProduct} />);
        expect(screen.getByTestId('product-description')).toHaveTextContent(
            'A sleek wireless mouse with ergonomic design.'
        );
    });

    // Test 4
    it('does not render description when not provided', () => {
        const productNoDesc = { ...mockProduct, description: undefined };
        render(<ProductCard product={productNoDesc} />);
        expect(screen.queryByTestId('product-description')).not.toBeInTheDocument();
    });

    // Test 5
    it('returns null when product is null', () => {
        const { container } = render(<ProductCard product={null} />);
        expect(container.innerHTML).toBe('');
    });

    // Test 6
    it('uses placeholder image when product image is missing', () => {
        const noImageProduct = { ...mockProduct, image: undefined };
        render(<ProductCard product={noImageProduct} />);
        expect(screen.getByTestId('product-image')).toHaveAttribute('src', '/placeholder.png');
    });
});
