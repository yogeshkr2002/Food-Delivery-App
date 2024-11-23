import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Layout from "./components/Layout";
import Login from "./components/Login";
import Register from "./pages/Register";
import Home from "./components/Home";
import Products from "./components/Products";
import Profile from "./components/Profile";
import Checkout from "./components/Checkout";
import Payment from "./components/Payment";
import OrderSuccess from "./components/OrderSuccess";
import PrivateRoute from "./components/PrivateRoute";
import AddressManagement from "./components/AddressManagement";
import PaymentMethodForm from "./components/PaymentMethodForm";
import CheckoutAddressPage from "./components/CheckoutAddressPage";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/home"
              element={
                <PrivateRoute>
                  <Layout>
                    <Home />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/products"
              element={
                <PrivateRoute>
                  <Layout>
                    <Products />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Layout>
                    <Profile />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <PrivateRoute>
                  <Layout>
                    <Checkout />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/payment"
              element={
                <PrivateRoute>
                  <Layout>
                    <Payment />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/order-success"
              element={
                <PrivateRoute>
                  <Layout>
                    <OrderSuccess />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/addresses"
              element={
                <PrivateRoute>
                  <Layout>
                    <AddressManagement />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/add-payment-method"
              element={
                <PrivateRoute>
                  <Layout>
                    <PaymentMethodForm />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/checkout/address"
              element={
                <PrivateRoute>
                  <Layout>
                    <CheckoutAddressPage />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
