import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "./Header";
import { useAuth } from "../context/AuthContext";
import "../styles/Home.css";

function Home() {
  const [message, setMessage] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [homeResponse, restaurantsResponse] = await Promise.all([
          axios.get("http://localhost:5000/api/home", {
            headers: { Authorization: `Bearer ${user.token}` },
          }),
          axios.get("http://localhost:5000/api/restaurants", {
            headers: { Authorization: `Bearer ${user.token}` },
          }),
        ]);

        setMessage(homeResponse.data.message);
        setRestaurants(restaurantsResponse.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [user.token]);

  return (
    <div>
      <Header />
      <div className="content">
        <h1>Welcome to Home Page</h1>
        <p>{message}</p>

        <div className="restaurants-section">
          <h2>Popular Restaurants</h2>
          <div className="restaurants-grid">
            {restaurants.map((restaurant) => (
              <div
                key={restaurant._id}
                className="restaurant-card"
                onClick={() => navigate("/products")}
              >
                <img src={restaurant.image} alt={restaurant.name} />
                <h3>{restaurant.name}</h3>
                <p>{restaurant.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
