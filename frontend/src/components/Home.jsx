import { useEffect, useState } from "react";
import axios from "axios";
import Header from "./Header";
import PopularRestaurants from "./PopularRestaurants";
import { useAuth } from "../context/AuthContext";
import "../styles/Home.css";

function Home() {
  const [message, setMessage] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/home", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setMessage(response.data.message);
      } catch (error) {
        console.error("Error fetching data:", error);
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
        <PopularRestaurants />
      </div>
    </div>
  );
}

export default Home;
