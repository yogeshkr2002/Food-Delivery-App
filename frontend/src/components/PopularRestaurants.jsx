import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../styles/PopularRestaurants.css";

function PopularRestaurants() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/restaurants",
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
        setRestaurants(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [user.token]);

  if (loading) {
    return <div className="loading">Loading restaurants...</div>;
  }

  return (
    <div className="popular-restaurants">
      <h2>Popular Restaurants</h2>
      <div className="restaurants-scroll">
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
  );
}

export default PopularRestaurants;
