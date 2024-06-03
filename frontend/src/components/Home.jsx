import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";


const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = location.state || {};

  console.log("User object:", user);
  console.log("User ID:", user.id_no);


  const handleCreateList = () => {
    navigate("/createlist", { state: { user: { ...user, id_no: user.id_no } } });
  };

  const handleCreateMeal = () => {
    navigate("/createmeal", { state: { user: { ...user, id_no: user.id_no} } });
  };

  const handleMeals = () => {
    navigate("/meals", { state: { user: { ...user, id_no: user.id_no } } });
  };

  return (
    <div>
      {user ? (
        <div>
          <h1>Welcome, {user.username}!</h1>
          <h3>
            Name: {user.firstName} {user.lastName}
          </h3>
          {user.id_no !== null ? (
            <p>Your User ID is: {user.id_no}</p>
          ) : (
            <p>Loading User ID...</p>
          )}
          <button onClick={handleCreateMeal}>Create Meal</button>
          <button onClick={handleCreateList}>Create List</button>
          <button onClick={handleMeals}>Meals</button>
        </div>
      ) : (
        <p>No user data available.</p>
      )}
    </div>
  );
};

export default Home;
