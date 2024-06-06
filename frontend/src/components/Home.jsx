import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Styling/home.css";
import { Helmet } from "react-helmet";
import logo from "./Styling/graphics/logo.png";
import bellicon from "./Styling/graphics/home_bell-icon.png";
import chaticon from "./Styling/graphics/home_chat-icon.png";
import thisimgbg from "./Styling/graphics/home_imgbg.png";
import homeplus from "./Styling/graphics/home_plus.png";
import accounticon from "./Styling/graphics/home_accounticon.png";
import homeabout from "./Styling/graphics/home_about-icon.png";
import homeicon from "./Styling/graphics/home_home-icon.png";
import homemeals from "./Styling/graphics/home_meals-icon.png";
import grocerylisticon from "./Styling/graphics/grocery-list-icon.png";
import homesettingsicon from "./Styling/graphics/home_settings-icon.png";

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = location.state || {};
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    if (user && user.username) {
      handleGetID();
    }
  }, [user]);

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top of the page on component mount
  }, []);

  const handleSignOut = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleCreateList = () => {
    // console.log("Going to create list with: " + userId);
    navigate("/createlist", { state: { user: { ...user, id_no: userId } } });
  };

  const handleCreateMeal = () => {
    navigate("/createmeal", {
      state: { user: { ...user, id_no: user.id_no } },
    });
  };

  const handleMeals = () => {
    navigate("/meals", { state: { user: { ...user, id_no: user.id_no } } });
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
    <div className="inhome">
      <Helmet>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <title>PantryPal - Home</title>
        {/* <link rel="icon" href={logo} type="image/x-icon" /> */}
      </Helmet>
      <a className="PantryPalName-home">PantryPal.</a>
      <button id="signout-home" onClick={handleSignOut}>
        Sign Out
      </button>
      <div className="sidebar-home">
        <img src={bellicon} className="bell-home"></img>
        <img src={chaticon} className="msg"></img>
        <img src={accounticon} className="dp"></img>
        <div id="name">
          <div id="username">{user.username}</div>
          <br></br> {user.firstName} {user.lastName}
        </div>
        <div className="line1"></div>
        <div className="nav-home" id="home-home">
          <img src={homeicon} className="icons" />
          <div className="homelabel-home">home</div>
        </div>
        <a onClick={handleMeals}>
          <div className="nav-home" id="meals-home">
            <img src={homemeals} className="icons" />
            <div className="navlabel-home">meals</div>
          </div>
        </a>
        <a onClick={handleCreateList}>
          <div className="nav-home" id="grocerylist-home">
            <img src={grocerylisticon} className="icons" />
            <div className="navlabel-home">grocery list</div>
          </div>
        </a>
        <div className="line2"></div>
        <div className="nav-home" id="settings">
          <img src={homesettingsicon} className="icons" />
          <div className="navlabel-home">settings</div>
        </div>
        <div className="nav-home" id="about">
          <img src={homeabout} className="icons" />
          <div className="navlabel-home">about</div>
        </div>
      </div>
      <div className="img">
        <img src={thisimgbg} className="imgbg" />
      </div>
      <div className="mainbuttons">
        <div className="addlist-home">
          <div className="addlabel-home">make list</div>
          <a onClick={handleCreateList}>
            <img src={homeplus} className="plusicon-home" />
          </a>
        </div>

        <div className="addmeal-home">
          <div className="addlabel-home">add meal</div>
          <a onClick={handleCreateMeal}>
            <img src={homeplus} className="plusicon-home" />
          </a>
        </div>
      </div>

      {/* {user ? (
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

          <button onClick={handleCreateMeal}>Create Meal</button>
          <button onClick={handleCreateList}>Create List</button>
          <button onClick={handleMeals}>Meals</button>
        </div>
      ) : (
        <p>No user data available.</p>
      )} */}
    </div>
  );
};

export default Home;
