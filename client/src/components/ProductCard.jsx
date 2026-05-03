import { useState } from 'react';
import { formatPrice } from '../utils/formatters';

function Stars({ rating }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <span className="stars">
      {'★'.repeat(full)}
      {half ? '½' : ''}
      {'☆'.repeat(5 - full - (half ? 1 : 0))}
    </span>
  );
}

const FASHION_IMAGES = [
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80',
  'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80',
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80',
  'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80',
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80',
  'https://images.unsplash.com/photo-1525450824786-227cbef70703?w=600&q=80',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80',
  'https://images.unsplash.com/photo-1560243563-062bfc001d68?w=600&q=80',
];

function ProductCard({ product, onAddToCart }) {
  const [wishlisted, setWishlisted] = useState(false);

  if (!product) return null;

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  const getBadgeClass = (badge) => {
    if (!badge) return 'badge-accent';
    const map = {
      'Best Seller': 'badge-accent',
      Hot: 'badge-danger',
      New: 'badge-success',
      Sale: 'badge-warning',
    };
    return map[badge] || 'badge-accent';
  };

  // Use a deterministic fashion image based on product id if no image provided
  const imgSrc =
    product.image && product.image.startsWith('http')
      ? product.image
      : FASHION_IMAGES[(product.id - 1) % FASHION_IMAGES.length];

  return (
    <div className="product-card" data-testid="product-card">
      <div className="product-image-wrap">
        <img
          src={imgSrc}
          alt={product.name}
          className="product-image"
          data-testid="product-image"
          loading="lazy"
        />

        {product.badge && (
          <div className="product-badge">
            <span className={`badge ${getBadgeClass(product.badge)}`}>{product.badge}</span>
          </div>
        )}

        <button
          className={`product-wishlist${wishlisted ? ' active' : ''}`}
          aria-label="Add to wishlist"
          onClick={() => setWishlisted(!wishlisted)}
        >
          {wishlisted ? '♥' : '♡'}
        </button>

        <button
          className="product-quick-add"
          onClick={() => onAddToCart && onAddToCart(product)}
          data-testid="quick-add-btn"
        >
          Quick Add
        </button>
      </div>

      <div className="product-info">
        <div className="product-category">{product.category}</div>

        <h3 className="product-name" data-testid="product-name">
          {product.name}
        </h3>

        <div className="product-rating">
          <Stars rating={product.rating || 4} />
          <span className="rating-count">({product.reviews || 0})</span>
        </div>

        <div className="product-price-row">
          <span className="product-price" data-testid="product-price">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="product-original-price">{formatPrice(product.originalPrice)}</span>
          )}
          {discount > 0 && <span className="product-discount">−{discount}%</span>}
        </div>

        <button
          className="add-to-cart-btn"
          data-testid="add-to-cart-btn"
          onClick={() => onAddToCart && onAddToCart(product)}
        >
          Add to Bag
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
