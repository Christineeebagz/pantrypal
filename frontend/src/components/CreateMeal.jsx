import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from "react-router-dom";
import { Helmet } from 'react-helmet';
import './Styling/home.css';
import './Styling/meals.css';
import './Styling/addmeals.css';
import mealsBackArrow from './Styling/graphics/meals_back-arrow.png';
import line3 from './Styling/graphics/line-3.svg';
import pork from './Styling/graphics/pork.png';
import plus from './Styling/graphics/pluss-symbol1.svg';


const CreateMeal = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = location.state || {};
    const [ingredients, setIngredients] = useState([]);
    const [mealName, setMealName] = useState('');
    const [errors, setErrors] = useState({});

    const units = [
      'Grams (g)', 'Kilograms (kg)', 'Milligrams (mg)', 'Pieces', 'Ounces (oz)',
      'Teaspoon (tsp)', 'Tablespoon (tbsp)', 'Cup', 'Gallon',
      'Liter', 'Pound (lb)', 'Box', 'Pack'
    ];
    
    useEffect(() => {
      const clear = document.querySelector('.overlap-7');
      const handleClear = () => {
        setIngredients([]);
        setMealName('');
      };
      clear.addEventListener('click', handleClear);
    
      const saveMealButton = document.querySelector('.save-meal-button');
      const handleSaveMeal = (event) => {
        const mealData = gatherMealData();
        localStorage.setItem('savedMeal', JSON.stringify(mealData));
        console.log('Meal data saved to local storage:', mealData);
    

        console.log("inside meal00");
        handleSubmitMeal(event);
      };
      saveMealButton.addEventListener('click', handleSaveMeal);
    
      return () => {
        clear.removeEventListener('click', handleClear);
        saveMealButton.removeEventListener('click', handleSaveMeal);
      };
    }, [mealName, ingredients]);

  const handleAddIngredient = () => {
      console.log("TRYING TO ADD INGRED");
    setIngredients([...ingredients, { name: '', quantity: '', unit: units[0] }]);
  };
  
    const handleIngredientChange = (index, field, value) => {
      const newIngredients = [...ingredients];
      newIngredients[index][field] = value;
      setIngredients(newIngredients);
    };
  
    const handleRemoveIngredient = (index) => {
      const newIngredients = ingredients.filter((_, i) => i !== index);
      setIngredients(newIngredients);
    };
  
    const gatherMealData = () => {
        return {
          meal_name: mealName,
          ingredients: ingredients.map(ingredient => ({
            ingredient_name: ingredient.name,
            quantity: ingredient.quantity,
            unit: ingredient.unit
          }))
        };
      };

    
    const handleSubmitMeal = (event) => {
      event.preventDefault();
      
      if (!mealName) {
        alert( "Meal name is required.");
        return;
      }
    
      if (ingredients.length === 0) {
        alert("Please enter at least one ingredient.");
        return;
      }
    
      // Check each ingredient for blank inputs or negative quantity
      for (let i = 0; i < ingredients.length; i++) {
        const ingredient = ingredients[i];
        const isDuplicate = ingredients.some((ing, index) => index !== i && ing.name.trim() === ingredient.name.trim());
        if (isDuplicate) {
          alert("Duplicate ingredient names are not allowed.");
          return;
        }

        if (!ingredient.name.trim() || ingredient.quantity <= 0) {
          alert("Please fill in all ingredient fields with valid values.");
          return;
        }
      }
      
      const mealData = {
        id_no: user.id_no,
        meal_name: mealName,
      };
      
      console.log("INSIDE INSERT MEAL", mealData);
      axios
        .post("http://localhost:8070/insertMeal", mealData)
        .then((mealRes) => {
          console.log("Meal data submitted successfully:", mealRes.data);
          if (mealRes.status === 200) {
            const ingredientPromises = ingredients.map((ingredient) => {
              const requestData = {
                meal_id: mealRes.data.meal_id,
                ingredient_name: ingredient.name,
                quantity: ingredient.quantity,
                unit: ingredient.unit
              };
              return axios.post("http://localhost:8070/insertIngredient", requestData)
                .then((response) => response.data.ingred_id);
            });
            return Promise.all(ingredientPromises);
          } else {
            return Promise.reject("Meal already exists");
          }
        })
        .then((ingredientIds) => {
          alert('Meal saved successfully!');
          navigate("/meals", { state: { user: user} });
        })
        .catch((err) => {
          alert("Duplicate meal. Please use a different meal name.");
        });
    };
    
  
    const handleMealsBack = () => {
      navigate("/meals", { state: { user: user } });
    };
  
  
    return (
      <div>
        <Helmet>
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <link rel="stylesheet" href="addmeals.css" />
          <title>Add New Meal</title>
        </Helmet>
        <div className="ADD-NEW-MEAL">
          <div className="div">
            <a href="welcome.html" className="pantrypal-logo">PantryPal.</a>
            <div onClick={handleMealsBack}>
              <div className="overlap-4">
                <img className="back-arrow" src={mealsBackArrow} alt="Back Arrow" />
                <div className="back-to-home">meals</div>
              </div>
            </div>
            <div className="overlap-5">
              <div className="save-meal-button">
                <div className="overlap-6">
                  <div className="complete-button"></div>
                  <div className="meal-name">save meal</div>
                </div>
              </div>
              <div className="overlap-wrapper">
                <div className="overlap-7">
                  <div className="complete-button-2"></div>
                  <div className="meal-name-2">clear</div>
                </div>
              </div>
            </div>
            <div className="overlap">
              <div className="meals-frame">
                <div id="ingredient-container">
                  {ingredients.map((ingredient, index) => (
                    <div key={index} className="list-item">
                      <input
                        type="text"
                        className="ingredient-name"
                        value={ingredient.name}
                        onChange={(e) => {
                          const newName = e.target.value; 
                          handleIngredientChange(index, 'name', newName);
                        }}
                        placeholder="Ingredient name"
                      />
                      <input
                        type="number"
                        className="quantity-ingredient"
                        value={ingredient.quantity}
                        onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                        placeholder="0"
                      />
                      <select
                        className="unit-ingredient"
                        value={ingredient.unit}
                        onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                      >
                        {units.map((unit, i) => (
                          <option key={i} value={unit}>{unit}</option>
                        ))}
                      </select>
                      <button className="remove-item" onClick={() => handleRemoveIngredient(index)}>X</button>
                    </div>
                  ))}
                </div>
                <div>
                  <div className="text-wrapper-8">Ingredient</div>
                  <div className="text-wrapper-9">quantity</div>
                  <div className="text-wrapper-10">unit</div>
                  <img className="line" src={line3} alt="Line" />
                </div>
              </div>
              <div className="meal-title">
              <input
                type="text"
                className="meal-title-text"
                placeholder="Enter meal name"
                value={mealName}
                onChange={(e) => setMealName(e.target.value)}
              />
              <img className="pork" src={pork} alt="Pork" />
            </div>
            </div>
            <div id="add-ingredient" className="add-ingredient" onClick={handleAddIngredient}>
              <img className="pluss-symbol" src={plus} alt="Add Ingredient" />
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default CreateMeal;