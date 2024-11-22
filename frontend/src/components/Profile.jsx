import { useEffect, useState } from "react";
import axios from "axios";
import Header from "./Header";
import { useAuth } from "../context/AuthContext";
import "../styles/Profile.css";

function Profile() {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/users/profile",
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
        setProfileData(response.data);
        setLoading(false);
      } catch (error) {
        setError(
          error.response?.data?.message || "Error fetching profile data"
        );
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user.token]);

  if (loading) {
    return (
      <div>
        <Header />
        <div className="profile-container">
          <div className="loading">Loading profile...</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="profile-container">
        <div className="profile-header">
          <h1>Profile</h1>
        </div>
        <div className="profile-content">
          {error ? (
            <div className="error-message">{error}</div>
          ) : (
            <div className="profile-info">
              <div className="profile-field">
                <label>Username</label>
                <span>{profileData?.username}</span>
              </div>
              <div className="profile-field">
                <label>Email</label>
                <span>{profileData?.email}</span>
              </div>
              <div className="profile-field">
                <label>Account ID</label>
                <span>{profileData?._id}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
