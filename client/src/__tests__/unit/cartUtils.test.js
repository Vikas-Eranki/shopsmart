import { describe, it, expect } from 'vitest';
import { addItem, removeItem, getTotal, getItemCount, applyDiscount } from '../../utils/cartUtils';

describe('cartUtils — Unit Tests', () => {
  const sampleCart = [
    { id: 1, name: 'Widget', price: 1000, qty: 2 },
    { id: 2, name: 'Gadget', price: 2500, qty: 1 },
  ];

  // Test 1
  it('addItem adds a new item to an empty cart', () => {
    const result = addItem([], { id: 1, name: 'Widget', price: 1000 });
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({ id: 1, name: 'Widget', price: 1000, qty: 1 });
  });

  // Test 2
  it('addItem increments quantity for an existing item', () => {
    const result = addItem(sampleCart, { id: 1, name: 'Widget', price: 1000 });
    expect(result).toHaveLength(2);
    expect(result.find((i) => i.id === 1).qty).toBe(3);
  });

  // Test 3
  it('removeItem removes an item by id', () => {
    const result = removeItem(sampleCart, 1);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(2);
  });

  // Test 4
  it('removeItem returns same cart when id not found', () => {
    const result = removeItem(sampleCart, 99);
    expect(result).toHaveLength(2);
  });

  // Test 5
  it('getTotal calculates total price correctly', () => {
    expect(getTotal(sampleCart)).toBe(4500); // (1000*2) + (2500*1)
  });

  // Test 6
  it('getTotal returns 0 for empty cart', () => {
    expect(getTotal([])).toBe(0);
  });

  // Test 7
  it('getItemCount returns total quantity of items', () => {
    expect(getItemCount(sampleCart)).toBe(3); // 2 + 1
  });

  // Test 8
  it('getItemCount returns 0 for empty cart', () => {
    expect(getItemCount([])).toBe(0);
  });

  // Test 9
  it('applyDiscount applies SAVE10 code for 10% off', () => {
    const result = applyDiscount(sampleCart, 'SAVE10');
    expect(result.total).toBe(4500);
    expect(result.discount).toBe(450);
    expect(result.finalTotal).toBe(4050);
  });

  // Test 10
  it('applyDiscount applies HALF code for 50% off', () => {
    const result = applyDiscount(sampleCart, 'HALF');
    expect(result.total).toBe(4500);
    expect(result.discount).toBe(2250);
    expect(result.finalTotal).toBe(2250);
  });

  // Test 11
  it('applyDiscount returns no discount for invalid code', () => {
    const result = applyDiscount(sampleCart, 'INVALID');
    expect(result.total).toBe(4500);
    expect(result.discount).toBe(0);
    expect(result.finalTotal).toBe(4500);
  });
});
