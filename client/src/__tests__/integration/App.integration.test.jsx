import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from '../../App';

const MOCK_PRODUCTS = [
  {
    id: 1,
    name: 'Wireless Headphones',
    category: 'Electronics',
    price: 7999,
    originalPrice: 9999,
    rating: 4.7,
    reviews: 100,
    badge: 'Best Seller',
    image: '',
    inStock: true,
  },
  {
    id: 2,
    name: 'Leather Sneakers',
    category: 'Fashion',
    price: 4999,
    originalPrice: 6999,
    rating: 4.8,
    reviews: 200,
    badge: 'Hot',
    image: '',
    inStock: true,
  },
];

describe('App — Integration Tests', () => {
  beforeEach(() => {
    global.fetch = vi.fn((url) => {
      if (url.includes('/api/products')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve(MOCK_PRODUCTS) });
      }
      if (url.includes('/api/checkout')) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({ success: true, orderId: 'ORD-123', total: 7999, items: [] }),
        });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
    });
    vi.restoreAllMocks();
  });

  // Test 1
  it('renders the ShopSmart title in the header', async () => {
    render(<App />);
    expect(screen.getByTestId('header')).toBeInTheDocument();
  });

  // Test 2
  it('fetches and displays product cards', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve(MOCK_PRODUCTS) })
    );
    render(<App />);
    await waitFor(() => {
      expect(screen.getAllByTestId('product-card').length).toBeGreaterThan(0);
    });
  });

  // Test 3
  it('shows hero section with CTA button', () => {
    render(<App />);
    expect(screen.getByTestId('hero-section')).toBeInTheDocument();
    expect(screen.getByTestId('hero-cta-btn')).toBeInTheDocument();
  });

  // Test 4
  it('shows category section', () => {
    render(<App />);
    expect(screen.getByTestId('category-section')).toBeInTheDocument();
  });

  // Test 5
  it('opens cart drawer when cart icon is clicked', async () => {
    render(<App />);
    const cartBtn = screen.getByTestId('cart-icon-btn');
    fireEvent.click(cartBtn);
    await waitFor(() => {
      expect(screen.getByTestId('cart-drawer')).toBeInTheDocument();
    });
  });

  // Test 6
  it('shows empty cart message when cart is empty', async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('cart-icon-btn'));
    await waitFor(() => {
      expect(screen.getByTestId('cart-empty')).toBeInTheDocument();
    });
  });
});
