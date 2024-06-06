import React from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import "./Styling/choosemeals.css";
import "./Styling/navbar.css";
import backArrow from "./Styling/graphics/meals_back-arrow.png";
import logo from "./Styling/graphics/logo.png";

const NavBar = ({ values }) => {
  const navigate = useNavigate();
  const goToHome = () => {
    navigate("/home", { state: { user: values } });
  };

  const goToWelcome = () => {
    navigate("/");
  };

  return (
    <div className="navbar">
      <Helmet>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <title>PantryPal - Create A List</title>

        <link
          rel="icon"
          //   href="./Styling/graphics/logo.png"
          src={logo}
          type="image/x-icon"
        />
      </Helmet>
      <div className="navbar-container-solo">
        <a className="PantryPalName">PantryPal.</a>
        <button onClick={goToWelcome} className="signout">
          Sign Out
        </button>
        <a>
          <img src={backArrow} onClick={goToHome} className="backbutton" />
        </a>
        <div className="backhomelabel">home</div>
      </div>
    </div>
  );
};

export default NavBar;
