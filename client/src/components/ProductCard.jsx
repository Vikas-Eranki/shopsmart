import { formatPrice } from '../utils/formatters';

function ProductCard({ product, onAddToCart }) {
    if (!product) return null;

    return (
        <div className="product-card" data-testid="product-card">
            <img
                src={product.image || '/placeholder.png'}
                alt={product.name}
                className="product-image"
                data-testid="product-image"
            />
            <h3 data-testid="product-name">{product.name}</h3>
            <p className="product-price" data-testid="product-price">
                {formatPrice(product.price)}
            </p>
            {product.description && (
                <p className="product-description" data-testid="product-description">
                    {product.description}
                </p>
            )}
            <button
                className="add-to-cart-btn"
                data-testid="add-to-cart-btn"
                onClick={() => onAddToCart && onAddToCart(product.id)}
            >
                Add to Cart
            </button>
        </div>
    );
}

export default ProductCard;
