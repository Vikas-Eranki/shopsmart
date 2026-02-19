const API_BASE = import.meta.env.VITE_API_URL || '';

export async function fetchHealth() {
    const res = await fetch(`${API_BASE}/api/health`);
    if (!res.ok) throw new Error(`Health check failed: ${res.status}`);
    return res.json();
}

export async function fetchProducts() {
    const res = await fetch(`${API_BASE}/api/products`);
    if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`);
    return res.json();
}

export async function searchProducts(query) {
    if (!query || !query.trim()) return [];
    const res = await fetch(`${API_BASE}/api/products?search=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error(`Search failed: ${res.status}`);
    return res.json();
}

export async function addToCart(productId, qty = 1) {
    const res = await fetch(`${API_BASE}/api/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, qty }),
    });
    if (!res.ok) throw new Error(`Add to cart failed: ${res.status}`);
    return res.json();
}

export async function removeFromCart(productId) {
    const res = await fetch(`${API_BASE}/api/cart/${productId}`, {
        method: 'DELETE',
    });
    if (!res.ok) throw new Error(`Remove from cart failed: ${res.status}`);
    return res.json();
}

export async function getCart() {
    const res = await fetch(`${API_BASE}/api/cart`);
    if (!res.ok) throw new Error(`Failed to get cart: ${res.status}`);
    return res.json();
}

export async function checkout(cart) {
    const res = await fetch(`${API_BASE}/api/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cart }),
    });
    if (!res.ok) throw new Error(`Checkout failed: ${res.status}`);
    return res.json();
}
