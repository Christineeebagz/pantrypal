import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Welcome from "./components/Welcome";
import Signup from "./components/Signup";
import Signin from "./components/Signin";
import Home from "./components/Home";
import CreateList from "./components/CreateList";
import GroceryList from "./components/GroceryList";
import CreateMeal from "./components/CreateMeal";
import Meals from "./components/Meals";
import mainicon from "./components/Styling/graphics/logo.png";
import { Helmet } from "react-helmet";

const App = () => {
  return (
    <BrowserRouter>
      <Helmet>
        <link rel="icon" href={mainicon} type="image/png" />
      </Helmet>
      <Routes>
        <Route path="/" element={<Welcome />}></Route>
        <Route path="/signin" element={<Signin />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
        <Route path="/home" element={<Home />}></Route>
        <Route path="/createlist" element={<CreateList />}></Route>
        <Route path="/grocerylist" element={<GroceryList />}></Route>
        <Route path="/createmeal" element={<CreateMeal />}></Route>
        <Route path="/meals" element={<Meals />}></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
