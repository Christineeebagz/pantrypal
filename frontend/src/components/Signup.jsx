import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Validation from "./Verification/SignupValidation";
import axios from "axios";
import "./Styling/Signup.css";

//MAKE AN ACCOUNT

const Signup = () => {
  const [values, setValues] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const handleInput = (event) => {
    setValues((prev) => ({
      ...prev,
      [event.target.name]: [event.target.value],
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrors(Validation(values));
    console.log("passed here " + values.username);
    if (
      errors.username === "" &&
      errors.firstName === "" &&
      errors.lastName === "" &&
      errors.email === "" &&
      errors.password === ""
    ) {
      axios
        .post("http://localhost:8070/signup", values)
        .then((res) => {
          console.log("done getting");
          navigate("/home", { state: { user: res.data } });
        })
        .catch((err) => console.log(err));
    }
    console.log("errors: " + errors.username);
  };

  return (
    <div>
      <form action="" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            placeholder="Enter Username"
            onChange={handleInput}
            name="username"
          />
          {errors.username && (
            <span className="text-danger">{errors.username}</span>
          )}
        </div>
        <div>
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            placeholder="Enter First Name"
            onChange={handleInput}
            name="firstName"
          />
          {errors.firstName && (
            <span className="text-danger">{errors.firstName}</span>
          )}
        </div>
        <div>
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            placeholder="Enter Last Name"
            onChange={handleInput}
            name="lastName"
          />
          {errors.lastName && (
            <span className="text-danger">{errors.lastName}</span>
          )}
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            placeholder="Enter Email"
            onChange={handleInput}
            name="email"
          />
          {errors.email && <span className="text-danger">{errors.email}</span>}
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            placeholder="Enter Password"
            onChange={handleInput}
            name="password"
          />
          {errors.password && (
            <span className="text-danger">{errors.password}</span>
          )}
        </div>
        <button onClick={handleSubmit} type="submit">
          <strong>Sign in</strong>
        </button>
      </form>
    </div>
  );
};

export default Signup;
