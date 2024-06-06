import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import "./Styling/welcome.css";
import logo from "./Styling/graphics/logo.png";

const Welcome = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top of the page on component mount
  }, []);

  const handleSignUpClick = () => {
    navigate("/signin");
  };

  return (
    <div id="welcome-body">
      <Helmet>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <title>PantryPal</title>
        <link rel="icon" href={logo} type="image/x-icon" />
      </Helmet>
      <div className="maincontainer-body">
        <div className="message">Create your grocery list with PantryPal.</div>
        <a className="getstartedbutton" onClick={handleSignUpClick}>
          GET STARTED!
        </a>
      </div>
      {/* Welcome Page Hello new new
      <button onClick={handleSignUpClick}>Sign In</button> */}
    </div>
  );
};

export default Welcome;
