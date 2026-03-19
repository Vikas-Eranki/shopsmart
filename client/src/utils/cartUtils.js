/**
 * Add an item to the cart. If it already exists, increment quantity.
 * @param {Array} cart
 * @param {{ id: number, name: string, price: number, qty?: number }} item
 * @returns {Array}
 */
export function addItem(cart, item) {
  const existing = cart.find((i) => i.id === item.id);
  if (existing) {
    return cart.map((i) => (i.id === item.id ? { ...i, qty: i.qty + (item.qty || 1) } : i));
  }
  return [...cart, { ...item, qty: item.qty || 1 }];
}

/**
 * Remove an item from the cart by id.
 * @param {Array} cart
 * @param {number} id
 * @returns {Array}
 */
export function removeItem(cart, id) {
  return cart.filter((i) => i.id !== id);
}

/**
 * Get the total price of all items in the cart (in cents).
 * @param {Array} cart
 * @returns {number}
 */
export function getTotal(cart) {
  return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

/**
 * Get total number of items in the cart.
 * @param {Array} cart
 * @returns {number}
 */
export function getItemCount(cart) {
  return cart.reduce((sum, item) => sum + item.qty, 0);
}

/**
 * Apply a discount code to the cart total.
 * Supported codes: SAVE10 (10%), SAVE20 (20%), HALF (50%)
 * @param {Array} cart
 * @param {string} code
 * @returns {{ total: number, discount: number, finalTotal: number }}
 */
export function applyDiscount(cart, code) {
  const total = getTotal(cart);
  const discounts = {
    SAVE10: 10,
    SAVE20: 20,
    HALF: 50,
  };
  const percent = discounts[code?.toUpperCase()] || 0;
  const discount = Math.round(total * (percent / 100));
  return {
    total,
    discount,
    finalTotal: total - discount,
  };
}
