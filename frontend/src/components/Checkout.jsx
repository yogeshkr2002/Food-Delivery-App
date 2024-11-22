import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Header from "./Header";
import "../styles/Checkout.css";

function Checkout() {
  const navigate = useNavigate();
  const { cartItems, getTotalAmount } = useCart();
  const tax = getTotalAmount() * 0.1; // 10% tax
  const deliveryFee = 5.99;
  const total = getTotalAmount() + tax + deliveryFee;

  return (
    <div>
      <Header />
      <div className="checkout-container">
        <h1>Checkout</h1>

        <div className="checkout-content">
          <div className="delivery-section">
            <h2>Delivery Address</h2>
            <div className="address-box">
              <p>123 Main Street</p>
              <p>Apt 4B</p>
              <p>New York, NY 10001</p>
              <button className="change-address-btn">Change Address</button>
            </div>
          </div>

          <div className="order-summary">
            <h2>Order Summary</h2>
            <div className="order-items">
              {cartItems.map((item) => (
                <div key={item._id} className="order-item">
                  <div className="item-details">
                    <span>{item.name}</span>
                    <span>x{item.quantity}</span>
                  </div>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="price-details">
              <div className="price-row">
                <span>Subtotal</span>
                <span>${getTotalAmount().toFixed(2)}</span>
              </div>
              <div className="price-row">
                <span>Tax (10%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="price-row">
                <span>Delivery Fee</span>
                <span>${deliveryFee.toFixed(2)}</span>
              </div>
              <div className="price-row total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <button
          className="proceed-payment-btn"
          onClick={() => navigate("/payment")}
        >
          Proceed to Payment →
        </button>
      </div>
    </div>
  );
}

export default Checkout;
