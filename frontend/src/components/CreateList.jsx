import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import axios from "axios";
import "./Styling/choosemeals.css";
import NavBar from "./NavBar";

const CreateList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = location.state || {};
  const [meals, setMeals] = useState([]);
  const [selectedMeals, setSelectedMeals] = useState([]);
  const [readyQuantity, setReadyQuantity] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top of the page on component mount
  }, []);

  useEffect(() => {
    if (user?.id_no) {
      axios
        .get(`http://localhost:8070/getmealslist?id_no=${user.id_no}`)
        .then((response) => {
          console.log("Fetched meals:", response.data);
          setMeals(response.data);
        })
        .catch((error) => {
          console.error("Error fetching meals:", error);
        });
    }
  }, [user?.id_no]);

  const toggleMeal = (meal) => {
    const existingMeal = selectedMeals.find(
      (selectedMeal) => selectedMeal.meal_id === meal.meal_id
    );
    if (existingMeal) {
      setSelectedMeals(
        selectedMeals.filter(
          (selectedMeal) => selectedMeal.meal_id !== meal.meal_id
        )
      );
      setReadyQuantity(
        readyQuantity.filter((readyMeal) => readyMeal.meal_id !== meal.meal_id)
      );
    } else {
      setSelectedMeals([...selectedMeals, { ...meal, quantity: 1 }]);
      setReadyQuantity([...readyQuantity, { ...meal, quantity: 1 }]);
    }
  };

  const updateQuantity = (meal_name, quantity) => {
    const parsedQuantity = parseInt(quantity, 10);

    // Update readyQuantity state
    setReadyQuantity((prevReadyQuantity) =>
      prevReadyQuantity.map((meal) =>
        meal.meal_name === meal_name
          ? { ...meal, quantity: parsedQuantity }
          : meal
      )
    );

    // Update selectedMeals state
    setSelectedMeals((prevSelectedMeals) =>
      prevSelectedMeals.map((meal) =>
        meal.meal_name === meal_name
          ? { ...meal, quantity: parsedQuantity }
          : meal
      )
    );
  };

  const handleSubmit = () => {
    const includedMeals = [];
    const includedMealsQuantities = [];
    let selectedFlag = 0;

    selectedMeals.forEach((meal) => {
      if (meal.quantity > 0) {
        selectedFlag = 1;
        includedMeals.push(meal.meal_id);
        let mealQuantity = meal.quantity.toString();
        if (mealQuantity === "") {
          includedMealsQuantities.push("0");
        } else {
          includedMealsQuantities.push(mealQuantity);
        }
      }
    });

    if (!selectedFlag) {
      alert("Select A Meal First!");
    } else {
      console.log("Included Meals:", includedMeals);
      console.log("Included Meals Quantities:", includedMealsQuantities);
      navigate("/grocerylist", {
        state: { id_no: user?.id_no, selectedMeals },
      });
    }

    console.log("Updated selected meals:", selectedMeals); // Moved outside the if-else block
  };

  const handleSelected = (event) => {
    const mealDiv = event.target.closest(".meal");
    if (mealDiv) {
      const mealId = mealDiv.getAttribute("data-mealid");
      const mealName = mealDiv.querySelector(".mealname").textContent;
      const meal = { meal_id: mealId, meal_name: mealName };

      mealDiv.classList.toggle("selected");
      if (mealDiv.classList.contains("selected")) {
        toggleMeal(meal);
      } else {
        toggleMeal(meal);
      }
    }
  };

  return (
    <div className="container-create-list">
      <Helmet>
        <meta charSet="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>PantryPal - Create A List</title>
        <link rel="icon" href="graphics/logo.png" type="image/x-icon" />
      </Helmet>

      <NavBar values={user} />

      <div id="maincontainer-create-list">
        <div className="label-createlist ">
          <div className="mealslabel-createlist">Choose your meals</div>
          <button id="viewlist-createlist" onClick={handleSubmit}>
            View Grocery List
          </button>
        </div>
        <div onClick={handleSelected}>
          {meals.map((meal) => (
            <div key={meal.meal_id} className="meal" data-mealid={meal.meal_id}>
              <input
                type="number"
                min="1"
                className="mealquantity"
                value={
                  readyQuantity.find((m) => m.meal_name === meal.meal_name)
                    ?.quantity || ""
                }
                onChange={(e) => updateQuantity(meal.meal_name, e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
              <div className="mealname">{meal.meal_name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreateList;
