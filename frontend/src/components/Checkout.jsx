import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AddressModal from "./AddressModal";
import Header from "./Header";
import { useCart } from "../context/CartContext";
import "../styles/Checkout.css";

function Checkout() {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [showAddresses, setShowAddresses] = useState(false);
  const navigate = useNavigate();
  const { cartItems, getTotalAmount } = useCart();

  const subtotal = getTotalAmount();
  const tax = subtotal * 0.1;
  const deliveryFee = 5.0;
  const total = subtotal + tax + deliveryFee;

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/addresses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAddresses(response.data);
      if (response.data.length > 0 && !selectedAddress) {
        setSelectedAddress(response.data[0]);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    setShowAddresses(false); // Hide address list after selection
  };

  const handleAddNewAddress = () => {
    setEditingAddress(null);
    setIsModalOpen(true);
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setIsModalOpen(true);
  };

  const handleDeleteAddress = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/addresses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAddresses();
      if (selectedAddress?._id === id) {
        setSelectedAddress(null);
      }
    } catch (error) {
      console.error("Error deleting address:", error);
    }
  };

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="checkout-container">
        <div className="empty-cart-message">
          <h2>Your cart is empty</h2>
          <button
            onClick={() => navigate("/products")}
            className="continue-shopping-btn"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="checkout-container">
        <h1 className="checkout-title">Checkout</h1>

        <div className="checkout-content">
          <div className="delivery-section">
            <div className="section-header">
              <h2>Delivery Address</h2>
              <button
                onClick={() => navigate("/checkout/address")}
                className="change-address-btn"
              >
                Change Address
              </button>
            </div>

            {showAddresses ? (
              <div className="addresses-list">
                <div className="addresses-header">
                  <h3>Select Delivery Address</h3>
                  <button
                    onClick={handleAddNewAddress}
                    className="add-new-address-btn"
                  >
                    Add New Address
                  </button>
                </div>
                <div className="addresses-grid">
                  {addresses.map((address) => (
                    <div
                      key={address._id}
                      className={`address-card ${
                        selectedAddress?._id === address._id ? "selected" : ""
                      }`}
                      onClick={() => handleAddressSelect(address)}
                    >
                      <div className="address-content">
                        <p className="address-text">{address.fullAddress}</p>
                        <p className="address-details">
                          {address.cityDistrict}, {address.state}
                        </p>
                        <p className="address-details">
                          PIN: {address.pinCode}
                        </p>
                        <p className="address-details">
                          Phone: {address.phoneNumber}
                        </p>
                      </div>
                      <div className="address-actions">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditAddress(address);
                          }}
                          className="edit-button"
                        >
                          Edit
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteAddress(address._id);
                          }}
                          className="delete-button"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              selectedAddress && (
                <div className="address-box">
                  <p>{selectedAddress.fullAddress}</p>
                  <p>
                    {selectedAddress.cityDistrict}, {selectedAddress.state}
                  </p>
                  <p>PIN: {selectedAddress.pinCode}</p>
                  <p>Phone: {selectedAddress.phoneNumber}</p>
                </div>
              )
            )}

            {!selectedAddress && !showAddresses && (
              <div className="no-address">
                <p>No delivery address selected</p>
                <button
                  onClick={handleAddNewAddress}
                  className="add-address-btn"
                >
                  Add New Address
                </button>
              </div>
            )}
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
                <span>${subtotal.toFixed(2)}</span>
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
          disabled={!selectedAddress}
        >
          Proceed to Payment →
        </button>
      </div>

      <AddressModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingAddress(null);
        }}
        address={editingAddress}
        onSubmit={() => {
          fetchAddresses();
          setShowAddresses(true);
        }}
      />
    </div>
  );
}

export default Checkout;
