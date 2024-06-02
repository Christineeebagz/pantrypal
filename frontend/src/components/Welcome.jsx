import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import "./Styling/Welcome.css"

const Welcome = () => {
  const navigate = useNavigate();

  const handleSignInClick = () => {
    navigate("/signin");
  };

  return (
    <>
      <Helmet>
        <title>PantryPal</title>
        <link rel="icon" href="graphics/diet.png" type="image/x-icon" />
        <link rel="stylesheet" href="welcome.css" />
      </Helmet>
      <div className="maincontainer">
        <div className="message">Create your grocery list with PantryPal.</div>
        <button onClick={handleSignInClick} className="getstartedbutton">
          GET STARTED!
        </button>
      </div>
    </>
  );
};

export default Welcome;
