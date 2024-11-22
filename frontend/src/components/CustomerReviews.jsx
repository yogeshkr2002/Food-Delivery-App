import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../styles/CustomerReviews.css";

function CustomerReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAddReview, setShowAddReview] = useState(false);
  const [newReview, setNewReview] = useState({
    userName: "",
    location: "",
    rating: 5,
    description: "",
  });
  const { user } = useAuth();

  useEffect(() => {
    fetchReviews();
  }, [user.token]);

  const fetchReviews = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/reviews", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setReviews(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setLoading(false);
    }
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:5000/api/reviews/add",
        {
          ...newReview,
          profilePic: `https://randomuser.me/api/portraits/${
            Math.random() > 0.5 ? "men" : "women"
          }/${Math.floor(Math.random() * 100)}.jpg`,
        },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      setShowAddReview(false);
      setNewReview({ userName: "", location: "", rating: 5, description: "" });
      fetchReviews();
    } catch (error) {
      console.error("Error adding review:", error);
    }
  };

  const renderStars = (rating) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : 0));
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev < reviews.length - 3 ? prev + 1 : reviews.length - 3
    );
  };

  if (loading) {
    return <div className="loading">Loading reviews...</div>;
  }

  const visibleReviews = reviews.slice(currentIndex, currentIndex + 3);

  return (
    <div className="customer-reviews">
      <div className="reviews-header">
        <h2>Customer Reviews</h2>
        <div className="average-rating">
          <span className="rating-number">{getAverageRating()}</span>
          <div className="rating-details">
            <div className="stars">
              {renderStars(Math.round(getAverageRating()))}
            </div>
            <p>Based on {reviews.length} reviews</p>
          </div>
        </div>
        <button
          className="add-review-btn"
          onClick={() => setShowAddReview(!showAddReview)}
        >
          {showAddReview ? "Cancel" : "Add Review"}
        </button>
      </div>

      {showAddReview && (
        <form onSubmit={handleAddReview} className="review-form">
          <input
            type="text"
            placeholder="Your Name"
            value={newReview.userName}
            onChange={(e) =>
              setNewReview({ ...newReview, userName: e.target.value })
            }
            required
          />
          <input
            type="text"
            placeholder="Location"
            value={newReview.location}
            onChange={(e) =>
              setNewReview({ ...newReview, location: e.target.value })
            }
            required
          />
          <select
            value={newReview.rating}
            onChange={(e) =>
              setNewReview({ ...newReview, rating: Number(e.target.value) })
            }
          >
            {[5, 4, 3, 2, 1].map((num) => (
              <option key={num} value={num}>
                {num} Stars
              </option>
            ))}
          </select>
          <textarea
            placeholder="Your Review"
            value={newReview.description}
            onChange={(e) =>
              setNewReview({ ...newReview, description: e.target.value })
            }
            required
          />
          <button type="submit">Submit Review</button>
        </form>
      )}

      <div className="reviews-container">
        <button
          className="nav-button prev"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
        >
          ←
        </button>
        <div className="reviews-grid">
          {visibleReviews.map((review) => (
            <div key={review._id} className="review-card">
              <div className="review-header">
                <img
                  src={review.profilePic}
                  alt={review.userName}
                  className="profile-pic"
                />
                <div className="review-info">
                  <h3>{review.userName}</h3>
                  <p className="location">{review.location}</p>
                  <p className="date">
                    {new Date(review.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="rating">{renderStars(review.rating)}</div>
              <p className="review-text">{review.description}</p>
            </div>
          ))}
        </div>
        <button
          className="nav-button next"
          onClick={handleNext}
          disabled={currentIndex >= reviews.length - 3}
        >
          →
        </button>
      </div>
    </div>
  );
}

export default CustomerReviews;
