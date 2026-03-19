import { describe, it, expect } from 'vitest';
import {
  formatPrice,
  formatDate,
  truncateText,
  slugify,
  calculateDiscount,
  validateEmail,
} from '../../utils/formatters';

describe('formatters — Unit Tests', () => {
  // Test 1
  it('formatPrice converts cents to dollar string', () => {
    expect(formatPrice(1999)).toBe('$19.99');
    expect(formatPrice(500)).toBe('$5.00');
    expect(formatPrice(1)).toBe('$0.01');
  });

  // Test 2
  it('formatPrice handles zero, negative, and invalid input', () => {
    expect(formatPrice(0)).toBe('$0.00');
    expect(formatPrice(-500)).toBe('$-5.00');
    expect(formatPrice(NaN)).toBe('$0.00');
    expect(formatPrice(undefined)).toBe('$0.00');
    expect(formatPrice('abc')).toBe('$0.00');
  });

  // Test 3
  it('formatDate formats ISO string to readable date', () => {
    const result = formatDate('2024-06-15T10:30:00Z');
    expect(result).toContain('Jun');
    expect(result).toContain('15');
    expect(result).toContain('2024');
  });

  // Test 4
  it('formatDate returns empty string for invalid input', () => {
    expect(formatDate('')).toBe('');
    expect(formatDate(null)).toBe('');
    expect(formatDate('not-a-date')).toBe('');
  });

  // Test 5
  it('truncateText truncates long text with ellipsis', () => {
    const longText = 'A'.repeat(100);
    const result = truncateText(longText, 20);
    expect(result).toBe('A'.repeat(20) + '...');
    expect(result.length).toBe(23);
  });

  // Test 6
  it('truncateText returns short text unchanged', () => {
    expect(truncateText('Hello', 50)).toBe('Hello');
    expect(truncateText('', 10)).toBe('');
    expect(truncateText(null)).toBe('');
  });

  // Test 7
  it('slugify converts text to URL-friendly slug', () => {
    expect(slugify('Hello World')).toBe('hello-world');
    expect(slugify('  Foo  Bar  ')).toBe('foo-bar');
    expect(slugify('Special @#$ Characters!')).toBe('special-characters');
    expect(slugify('')).toBe('');
    expect(slugify(null)).toBe('');
  });

  // Test 8
  it('calculateDiscount applies percentage correctly', () => {
    expect(calculateDiscount(1000, 10)).toBe(900);
    expect(calculateDiscount(1000, 50)).toBe(500);
    expect(calculateDiscount(1000, 100)).toBe(0);
    expect(calculateDiscount(999, 33)).toBe(669);
  });

  // Test 9
  it('calculateDiscount handles edge cases', () => {
    expect(calculateDiscount(1000, -5)).toBe(1000);
    expect(calculateDiscount(1000, 150)).toBe(1000);
    expect(calculateDiscount('abc', 10)).toBe(0);
    expect(calculateDiscount(1000, 'abc')).toBe(0);
  });

  // Test 10
  it('validateEmail returns true for valid emails', () => {
    expect(validateEmail('user@example.com')).toBe(true);
    expect(validateEmail('test.name+tag@domain.co')).toBe(true);
    expect(validateEmail('a@b.c')).toBe(true);
  });

  // Test 11
  it('validateEmail returns false for invalid emails', () => {
    expect(validateEmail('')).toBe(false);
    expect(validateEmail(null)).toBe(false);
    expect(validateEmail('notanemail')).toBe(false);
    expect(validateEmail('missing@domain')).toBe(false);
    expect(validateEmail('@no-local.com')).toBe(false);
    expect(validateEmail('spaces in@email.com')).toBe(false);
  });
});
