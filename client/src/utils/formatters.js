/**
 * Format price from cents to dollar string.
 * @param {number} cents
 * @returns {string}
 */
export function formatPrice(cents) {
    if (typeof cents !== 'number' || isNaN(cents)) return '$0.00';
    return `$${(cents / 100).toFixed(2)}`;
}

/**
 * Format ISO date string into a readable locale string.
 * @param {string} isoString
 * @returns {string}
 */
export function formatDate(isoString) {
    if (!isoString) return '';
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

/**
 * Truncate text to maxLen characters with ellipsis.
 * @param {string} text
 * @param {number} maxLen
 * @returns {string}
 */
export function truncateText(text, maxLen = 50) {
    if (!text) return '';
    if (text.length <= maxLen) return text;
    return text.slice(0, maxLen) + '...';
}

/**
 * Convert text into a URL-friendly slug.
 * @param {string} text
 * @returns {string}
 */
export function slugify(text) {
    if (!text) return '';
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_]+/g, '-')
        .replace(/-+/g, '-');
}

/**
 * Calculate discount price.
 * @param {number} price - original price in cents
 * @param {number} percent - discount percentage (0-100)
 * @returns {number} discounted price in cents
 */
export function calculateDiscount(price, percent) {
    if (typeof price !== 'number' || typeof percent !== 'number') return 0;
    if (percent < 0 || percent > 100) return price;
    return Math.round(price * (1 - percent / 100));
}

/**
 * Validate an email address format.
 * @param {string} email
 * @returns {boolean}
 */
export function validateEmail(email) {
    if (!email) return false;
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}
