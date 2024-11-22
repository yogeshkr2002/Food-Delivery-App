import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import "./customerReviews.css";

function StarRating({ rating, onRatingChange }) {
  const [hover, setHover] = useState(0);

  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star ${star <= (hover || rating) ? "filled" : ""}`}
          onClick={() => onRatingChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
        >
          ★
        </span>
      ))}
    </div>
  );
}

function CustomerReviews() {
  // ... existing state declarations ...

  return (
    <div className="customer-reviews">
      <div className="reviews-header">{/* ... existing header code ... */}</div>

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
          <div className="rating-input">
            <label>Your Rating</label>
            <StarRating
              rating={newReview.rating}
              onRatingChange={(rating) =>
                setNewReview({ ...newReview, rating })
              }
            />
          </div>
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

      {/* ... rest of the component code ... */}
    </div>
  );
}

export default CustomerReviews;
