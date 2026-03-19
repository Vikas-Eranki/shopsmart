import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ProductCard from '../../components/ProductCard';

const SAMPLE_PRODUCT = {
    id: 1,
    name: 'Wireless Headphones',
    category: 'Electronics',
    price: 7999,
    originalPrice: 9999,
    rating: 4.7,
    reviews: 1284,
    description: 'Premium headphones with ANC.',
    badge: 'Best Seller',
    image: 'https://example.com/img.jpg',
    inStock: true,
};

describe('ProductCard — Unit Tests', () => {
    // Test 1
    it('renders product name', () => {
        render(<ProductCard product={SAMPLE_PRODUCT} />);
        expect(screen.getByTestId('product-name')).toHaveTextContent('Wireless Headphones');
    });

    // Test 2
    it('renders formatted product price', () => {
        render(<ProductCard product={SAMPLE_PRODUCT} />);
        expect(screen.getByTestId('product-price').textContent).toContain('7');
    });

    // Test 3
    it('renders product image with correct alt text', () => {
        render(<ProductCard product={SAMPLE_PRODUCT} />);
        const img = screen.getByTestId('product-image');
        expect(img).toHaveAttribute('alt', 'Wireless Headphones');
    });

    // Test 4
    it('renders "Add to Cart" button', () => {
        render(<ProductCard product={SAMPLE_PRODUCT} />);
        expect(screen.getByTestId('add-to-cart-btn')).toBeInTheDocument();
    });

    // Test 5
    it('calls onAddToCart with the product when "Add to Cart" is clicked', () => {
        const handler = vi.fn();
        render(<ProductCard product={SAMPLE_PRODUCT} onAddToCart={handler} />);
        fireEvent.click(screen.getByTestId('add-to-cart-btn'));
        expect(handler).toHaveBeenCalledOnce();
        expect(handler).toHaveBeenCalledWith(SAMPLE_PRODUCT);
    });

    // Test 6
    it('calls onAddToCart when quick-add is clicked', () => {
        const handler = vi.fn();
        render(<ProductCard product={SAMPLE_PRODUCT} onAddToCart={handler} />);
        fireEvent.click(screen.getByTestId('quick-add-btn'));
        expect(handler).toHaveBeenCalledOnce();
    });

    // Test 7
    it('returns null when product is undefined', () => {
        const { container } = render(<ProductCard product={undefined} />);
        expect(container.firstChild).toBeNull();
    });

    // Test 8
    it('shows badge when product has a badge', () => {
        render(<ProductCard product={SAMPLE_PRODUCT} />);
        expect(screen.getByText('Best Seller')).toBeInTheDocument();
    });

    // Test 9
    it('shows discount percentage when originalPrice is higher than price', () => {
        render(<ProductCard product={SAMPLE_PRODUCT} />);
        expect(screen.getByText(/20% off/)).toBeInTheDocument();
    });

    // Test 10
    it('renders product category label', () => {
        render(<ProductCard product={SAMPLE_PRODUCT} />);
        expect(screen.getByText('Electronics')).toBeInTheDocument();
    });
});
