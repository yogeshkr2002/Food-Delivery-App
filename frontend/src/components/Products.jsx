import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import axios from "axios";
import Header from "./Header";
import PopularRestaurants from "./PopularRestaurants";
import CustomerReviews from "./CustomerReviews";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import "../styles/Products.css";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    getTotalAmount,
    isCartOpen,
    toggleCart,
  } = useCart();

  const categories = ["Burger", "Fries", "Pizza"];
  const filteredCategories = categories.filter((category) =>
    category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const category = searchParams.get("category");
    if (category) {
      setSearchTerm(category);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/products", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const allProducts = response.data[Object.keys(response.data)[0]] || [];
        setProducts(allProducts);
        setLoading(false);
      } catch (error) {
        setError(
          error.response?.data?.message || "Error fetching products data"
        );
        setLoading(false);
      }
    };

    fetchProducts();
  }, [user.token]);

  const handleSearch = (e) => {
    e.preventDefault();
    // The search is already happening through the filteredCategories
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div className="products-container">
          <div className="loading">Loading products...</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className={`products-container ${isCartOpen ? "with-cart" : ""}`}>
        <div className="main-content">
          <div className="search-section">
            <form onSubmit={handleSearch} className="search-form">
              <div className="search-input-container">
                <i className="search-icon">🔍</i>
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                {searchTerm && (
                  <button
                    type="button"
                    className="clear-search"
                    onClick={() => setSearchTerm("")}
                  >
                    ×
                  </button>
                )}
              </div>
              <button type="submit" className="search-button">
                Search
              </button>
            </form>
          </div>

          <div className="categories-header">
            {filteredCategories.map((category) => (
              <div key={category} className="category-label">
                {category}
              </div>
            ))}
          </div>

          {error ? (
            <div className="error-message">{error}</div>
          ) : (
            <>
              {filteredCategories.map((category) => (
                <div key={category} className="category-section">
                  <h2>{category}</h2>
                  <div className="products-scroll">
                    <div className="products-row">
                      {products.length > 0 ? (
                        products.map((product) => (
                          <div
                            key={`${category}-${product._id}`}
                            className="product-card"
                          >
                            <img src={product.image} alt={product.name} />
                            <h3>{product.name}</h3>
                            <p>{product.description}</p>
                            <p className="price">${product.price.toFixed(2)}</p>
                            <button
                              className="add-to-cart-btn"
                              onClick={() => addToCart(product)}
                            >
                              Add to Cart
                            </button>
                          </div>
                        ))
                      ) : (
                        <div className="no-products">
                          No products available in this category
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}

          <PopularRestaurants />
          <CustomerReviews />
        </div>

        {isCartOpen && (
          <div className="cart-sidebar">
            <div className="cart-header">
              <h2>My Cart</h2>
              <button className="close-cart" onClick={toggleCart}>
                ×
              </button>
            </div>
            {cartItems.length === 0 ? (
              <p>Your cart is empty</p>
            ) : (
              <>
                <div className="cart-items">
                  {cartItems.map((item) => (
                    <div key={item._id} className="cart-item">
                      <div className="item-info">
                        <h3>{item.name}</h3>
                        <p>${item.price.toFixed(2)}</p>
                      </div>
                      <div className="item-controls">
                        <button
                          onClick={() =>
                            updateQuantity(item._id, item.quantity - 1)
                          }
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() =>
                            updateQuantity(item._id, item.quantity + 1)
                          }
                        >
                          +
                        </button>
                        <button
                          className="remove-btn"
                          onClick={() => removeFromCart(item._id)}
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="cart-footer">
                  <div className="cart-total">
                    <h3>Total: ${getTotalAmount().toFixed(2)}</h3>
                  </div>
                  <Link to="/checkout" className="checkout-btn">
                    Checkout <span className="arrow">→</span>
                  </Link>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Products;
