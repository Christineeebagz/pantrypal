import React from "react";
import { Helmet } from "react-helmet";
import "./Styling/choosemeals.css";
import "./Styling/navbar.css";
import backArrow from "./Styling/graphics/meals_back-arrow.png";
import logo from "./Styling/graphics/logo.png";

const NavBar = () => {
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
      <div className="navbar-container">
        <a href="welcome.html" className="PantryPalName">
          PantryPal.
        </a>
        <button className="signout">Sign Out</button>
        <a href="home.html">
          <img src={backArrow} className="backbutton" />
        </a>
        <div className="backtohome">home</div>
      </div>
    </div>
  );
};

export default NavBar;
