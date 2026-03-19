import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import SearchBar from '../../components/SearchBar';

describe('SearchBar — Integration Tests', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // Test 1
  it('renders input with placeholder', () => {
    render(<SearchBar onSearch={vi.fn()} placeholder="Find items..." />);
    expect(screen.getByPlaceholderText('Find items...')).toBeInTheDocument();
  });

  // Test 2
  it('calls onSearch after debounce when user types', async () => {
    const mockSearch = vi.fn();
    render(<SearchBar onSearch={mockSearch} debounceMs={300} />);

    const input = screen.getByTestId('search-input');
    fireEvent.change(input, { target: { value: 'laptop' } });

    // Should not have called yet
    expect(mockSearch).not.toHaveBeenCalledWith('laptop');

    // Advance timers past debounce
    act(() => {
      vi.advanceTimersByTime(350);
    });

    expect(mockSearch).toHaveBeenCalledWith('laptop');
  });

  // Test 3
  it('clears input and calls onSearch with empty string on clear', () => {
    const mockSearch = vi.fn();
    render(<SearchBar onSearch={mockSearch} debounceMs={0} />);

    const input = screen.getByTestId('search-input');
    fireEvent.change(input, { target: { value: 'test' } });

    act(() => {
      vi.advanceTimersByTime(10);
    });

    const clearBtn = screen.getByTestId('search-clear-btn');
    fireEvent.click(clearBtn);

    act(() => {
      vi.advanceTimersByTime(10);
    });

    expect(mockSearch).toHaveBeenCalledWith('');
  });

  // Test 4
  it('does not show clear button when input is empty', () => {
    render(<SearchBar onSearch={vi.fn()} />);
    expect(screen.queryByTestId('search-clear-btn')).not.toBeInTheDocument();
  });

  // Test 5
  it('shows clear button when input has text', () => {
    render(<SearchBar onSearch={vi.fn()} />);
    const input = screen.getByTestId('search-input');
    fireEvent.change(input, { target: { value: 'x' } });
    expect(screen.getByTestId('search-clear-btn')).toBeInTheDocument();
  });
});
