import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import "../styles/Header.css";
import cartIcon from "../assets/cart-icon.png";

function Header() {
  const { logout } = useAuth();
  const { toggleCart, cartItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    logout();
    navigate("/login");
  };

  const handleCartClick = () => {
    if (location.pathname !== "/products") {
      navigate("/products");
    }
    toggleCart();
  };

  const cartItemCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <header className="header">
      <nav>
        <Link
          to="/home"
          className={location.pathname === "/home" ? "active" : ""}
        >
          Home
        </Link>
        <Link
          to="/products"
          className={location.pathname === "/products" ? "active" : ""}
        >
          Products
        </Link>
        <Link
          to="/profile"
          className={location.pathname === "/profile" ? "active" : ""}
        >
          Profile
        </Link>
        <button className="cart-button" onClick={handleCartClick}>
          <img src={cartIcon} alt="Cart" className="cart-icon" />
          {cartItemCount > 0 && (
            <span className="cart-count">{cartItemCount}</span>
          )}
        </button>
        <button onClick={handleLogout}>Logout</button>
      </nav>
    </header>
  );
}

export default Header;
