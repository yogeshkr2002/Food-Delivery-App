import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Header from "./Header";
import "../styles/Payment.css";

function Payment() {
  const navigate = useNavigate();
  const { getTotalAmount } = useCart();

  const paymentMethods = [
    { id: 1, name: "Credit Card", icon: "💳" },
    { id: 2, name: "PayPal", icon: "🅿️" },
    { id: 3, name: "Apple Pay", icon: "🍎" },
    { id: 4, name: "Google Pay", icon: "🔷" },
  ];

  return (
    <div>
      <Header />
      <div className="payment-container">
        <h1>Payment Method</h1>

        <div className="payment-methods">
          {paymentMethods.map((method) => (
            <div key={method.id} className="payment-method">
              <span className="method-icon">{method.icon}</span>
              <span className="method-name">{method.name}</span>
            </div>
          ))}
          <div className="payment-method add-method">
            <span className="method-icon">+</span>
            <span className="method-name">Add New Method</span>
          </div>
        </div>

        <div className="payment-summary">
          <h2>Total Amount</h2>
          <p className="total-amount">${getTotalAmount().toFixed(2)}</p>
        </div>

        <button
          className="proceed-payment-btn"
          onClick={() => navigate("/order-success")}
        >
          Proceed Payment
        </button>
      </div>
    </div>
  );
}

export default Payment;
