import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Validation from "./Verification/SignupValidation";
import axios from "axios";
import { Helmet } from "react-helmet";
import "./Styling/Signup.css";

const Signup = () => {
  const [values, setValues] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top of the page on component mount
  }, []);

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
    const validationErrors = await Validation(values);
    setErrors(validationErrors);

    if (Object.values(validationErrors).every((err) => err === "")) {
      axios
        .post("http://localhost:8070/signup", values)
        .then((res) => {
          navigate("/home", { state: { user: values } });
        })
        .catch((err) => console.log(err));
    }
    setIsSubmitting(false);
  };

  return (
    <div className="background-container">
      <Helmet>
        <title>PantryPal - Sign Up</title>
        <link rel="icon" href="graphics/diet.png" type="image/x-icon" />
        <link rel="stylesheet" href="signup.css" />
      </Helmet>
      <a href="/" className="PantryPalName">
        PantryPal.
      </a>
      <Link to="/signin" className="signinbutton">
        Sign in
      </Link>

      <div className="signupbox">
        <div className="signup">sign up</div>
        <form onSubmit={handleSubmit}>
          <div className="inputlabel" id="lfname">
            first name
          </div>
          <input
            type="text"
            className="inputfield"
            id="infname"
            name="firstName"
            value={values.firstName}
            onChange={handleInput}
          />
          {errors.firstName && (
            <span id="error-fname" className="text-danger">
              {errors.firstName}
            </span>
          )}

          <div className="inputlabel" id="llname">
            last name
          </div>
          <input
            type="text"
            className="inputfield"
            id="inlname"
            name="lastName"
            value={values.lastName}
            onChange={handleInput}
          />
          {errors.lastName && (
            <span id="error-lname" className="text-danger">
              {errors.lastName}
            </span>
          )}

          <div className="inputlabel" id="luname">
            username
          </div>
          <input
            type="text"
            className="inputfield"
            id="inuname"
            name="username"
            value={values.username}
            onChange={handleInput}
          />
          {errors.username && (
            <span id="error-uname" className="text-danger">
              {errors.username}
            </span>
          )}

          <div className="inputlabel" id="lemail">
            email address
          </div>
          <input
            type="email"
            className="inputfield"
            id="inemail"
            name="email"
            value={values.email}
            onChange={handleInput}
          />
          {errors.email && (
            <span id="error-email" className="text-danger">
              {errors.email}
            </span>
          )}

          <div className="inputlabel" id="lpassword">
            password
          </div>
          <input
            type="password"
            className="inputfield"
            id="inpassword"
            name="password"
            value={values.password}
            onChange={handleInput}
          />
          {errors.password && (
            <span id="error-password" className="text-danger">
              {errors.password}
            </span>
          )}

          <button id="complete" type="submit" disabled={isSubmitting}>
            complete
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
