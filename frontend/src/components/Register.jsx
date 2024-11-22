import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Register.css";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Basic validation
      if (formData.phone.length !== 10) {
        setError("Phone number must be 10 digits");
        return;
      }
      if (formData.password.length < 8) {
        setError("Password must be at least 8 characters long");
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        formData
      );

      if (response.data) {
        localStorage.setItem("token", response.data.token);
        navigate("/login");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setError(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    }
  };

  return (
    <div className="register-container">
      <div className="register-form-container">
        <h2 className="register-title">Register</h2>
        {error && <p className="register-error">{error}</p>}

        <form className="register-form" onSubmit={handleSubmit}>
          <div className="register-input-group">
            <div>
              <label htmlFor="name" className="sr-only">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="register-input"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="phone" className="sr-only">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                pattern="[0-9]{10}"
                required
                className="register-input"
                placeholder="Phone Number (10 digits)"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="register-input"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength="8"
                className="register-input"
                placeholder="Password (min 8 characters)"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <button type="submit" className="register-button">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
