import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from '../../App';

describe('App — Integration Tests', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    // Test 1
    it('fetches and displays health status on load', async () => {
        global.fetch = vi.fn(() =>
            Promise.resolve({
                ok: true,
                json: () =>
                    Promise.resolve({
                        status: 'ok',
                        message: 'ShopSmart Backend is running',
                        timestamp: '2024-01-01T00:00:00Z',
                    }),
            })
        );

        render(<App />);

        await waitFor(() => {
            expect(screen.getByText(/ok/i)).toBeInTheDocument();
            expect(screen.getByText(/ShopSmart Backend is running/i)).toBeInTheDocument();
        });
        expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    // Test 2
    it('shows loading state before data arrives', () => {
        global.fetch = vi.fn(() => new Promise(() => {})); // never resolves

        render(<App />);

        expect(screen.getByText(/Loading backend status/i)).toBeInTheDocument();
    });

    // Test 3
    it('handles fetch error gracefully without crashing', async () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        global.fetch = vi.fn(() => Promise.reject(new Error('Network failure')));

        render(<App />);

        await waitFor(() => {
            expect(consoleSpy).toHaveBeenCalled();
        });
        // App should still render the title
        expect(screen.getByText(/ShopSmart/i)).toBeInTheDocument();
        consoleSpy.mockRestore();
    });

    // Test 4
    it('renders the ShopSmart title', () => {
        global.fetch = vi.fn(() => new Promise(() => {}));
        render(<App />);
        expect(screen.getByText('ShopSmart')).toBeInTheDocument();
    });

    // Test 5
    it('renders the HMR hint text', () => {
        global.fetch = vi.fn(() => new Promise(() => {}));
        render(<App />);
        expect(screen.getByText(/Edit/i)).toBeInTheDocument();
        expect(screen.getByText(/src\/App.jsx/i)).toBeInTheDocument();
    });

    // Test 6
    it('displays timestamp from API response', async () => {
        global.fetch = vi.fn(() =>
            Promise.resolve({
                ok: true,
                json: () =>
                    Promise.resolve({
                        status: 'ok',
                        message: 'Backend running',
                        timestamp: '2024-12-25T12:00:00Z',
                    }),
            })
        );

        render(<App />);

        await waitFor(() => {
            expect(screen.getByText(/2024-12-25T12:00:00Z/)).toBeInTheDocument();
        });
    });
});
