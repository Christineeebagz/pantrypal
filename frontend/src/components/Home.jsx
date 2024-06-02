import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = location.state || {};

  const [userId, setUserId] = useState(user ? user.id_no : null);

  useEffect(() => {
    if (user && user.username && !userId) {
      console.log("User data received in Home:", user);
      handleGetID();
    }
  }, [user]);

  const handleCreateList = () => {
    navigate("/createlist", { state: { user: { ...user, id_no: userId } } });
  };

  const handleGetID = () => {
    axios
      .post("http://localhost:8070/getid", { username: user.username })
      .then((res) => {
        setUserId(res.data.id_no);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      {user ? (
        <div>
          <h1>Welcome, {user.username}!</h1>
          <h3>
            Name: {user.firstName} {user.lastName}
          </h3>
          {userId !== null ? (
            <p>Your User ID is: {userId}</p>
          ) : (
            <p>Loading User ID...</p>
          )}
          <button onClick={handleCreateList}>Create List</button>
        </div>
      ) : (
        <p>No user data available.</p>
      )}
    </div>
  );
};

export default Home;
