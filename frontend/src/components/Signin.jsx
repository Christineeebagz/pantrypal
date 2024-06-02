import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Helmet } from "react-helmet";
import "./Styling/Signin.css";

const Signin = () => {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInput = (event) => {
    setValues((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await axios.post("http://localhost:8070/signin", values);
      if (res.data.message === "Success") {
        navigate("/home", { state: { user: res.data } });
      } else {
        setErrors({ message: "Invalid email or password" });
      }
    } catch (err) {
      console.log(err);
      setErrors({ message: "An error occurred. Please try again." });
    }

    setIsSubmitting(false);
  };

  return (
    <>
      <Helmet>
        <title>PantryPal - Log in</title>
        <link rel="icon" href="graphics/logo.png" type="image/x-icon" />
        <link rel="stylesheet" href="login.css" />
      </Helmet>

      <a href="/" className="PantryPalName">PantryPal.</a>
      <Link to="/signup" className="signupbutton">Sign Up</Link>

      <div className="signinbox">
        <div className="signin">Sign in</div>
        <div className="usernamelabel">email</div>
        <input
          type="text"
          id="usernameinput"
          name="email"
          value={values.email}
          onChange={handleInput}
        />
        <div className="pswrdlabel">password</div>
        <Link to="/forgot-password" className="forgot">forgot password?</Link>
        <input
          type="password"
          id="pswrdinput"
          name="password"
          value={values.password}
          onChange={handleInput}
        />
        {errors.message && <span id="error-message" className="text-danger">{errors.message}</span>}
        <button id="signinbutton" onClick={handleSubmit} disabled={isSubmitting}>
          Sign in
        </button>
        <div className="noaccount">
          Don’t have an account? <Link to="/signup">Sign Up</Link>
        </div>
      </div>
    </>
  );
};

export default Signin;
