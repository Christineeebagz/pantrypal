// TO FIX:
// - what if the units are different

// TO CREATE:
// - copy button
// - add to collection kineme

import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";
import axios from "axios";
import backArrow from "./Styling/graphics/meals_back-arrow.png";
import groceryIcon from "./Styling/graphics/grocery-list-icon.png";
import "./Styling/glist.css";

const GroceryList = () => {
  const location = useLocation();
  const { id_no, selectedMeals } = location.state || {};
  const [full_ingred_list, setFullIngredList] = useState([]);
  const [compiled_ingred_list, setCompiledIngredList] = useState([]);

  const meal_ID_list = selectedMeals
    ? selectedMeals.map((meal) => meal.meal_id)
    : [];

  useEffect(() => {
    if (meal_ID_list.length > 0) {
      axios
        .post(`http://localhost:8070/getingredients`, { meal_ID_list })
        .then((response) => {
          setFullIngredList(response.data);
          compileIngredients(response.data);
        })
        .catch((error) => {
          console.error("Error fetching ingredients:", error);
        });
    }
  }, [meal_ID_list]);

  const compileIngredients = (ingredients) => {
    const ingredientMap = ingredients.reduce((acc, ingredient) => {
      const { ingredient_name, quantity, unit } = ingredient;
      if (!acc[ingredient_name]) {
        acc[ingredient_name] = { ingredient_name, quantity, unit };
      } else {
        acc[ingredient_name].quantity += quantity;
      }
      return acc;
    }, {});
    const compiledList = Object.values(ingredientMap);
    setCompiledIngredList(compiledList);
  };

  useEffect(() => {
    if (compiled_ingred_list.length > 0) {
      loadGroceryList();
    }
  }, [compiled_ingred_list]);

  const loadGroceryList = () => {
    const groceryListElement = document.getElementById("grocerylist");

    // Clear existing rows except the header and the label
    const rows = groceryListElement.querySelectorAll(".row:not(#header)");
    rows.forEach((row) => row.remove());

    compiled_ingred_list.forEach((ingredient, index) => {
      let newRow = document.createElement("div");
      newRow.className = "row";

      let newNum = document.createElement("div");
      newNum.className = "column1";
      newNum.textContent = (index + 1).toString();

      let newIng = document.createElement("div");
      newIng.className = "column2";
      newIng.textContent = ingredient.ingredient_name;

      let newQ = document.createElement("div");
      newQ.className = "column3";
      newQ.textContent = ingredient.quantity;

      let newUnit = document.createElement("div");
      newUnit.className = "column4";
      newUnit.textContent = ingredient.unit;

      newRow.appendChild(newNum);
      newRow.appendChild(newIng);
      newRow.appendChild(newQ);
      newRow.appendChild(newUnit);

      groceryListElement.appendChild(newRow);
    });
  };

  const handleShowInConsole = () => {
    console.log("Full Ingredient List:", full_ingred_list);
    console.log("Compiled Ingredient List:", compiled_ingred_list);
  };

  return (
    <div>
      <Helmet>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="glist.css" />
        <title>Grocery List</title>
      </Helmet>

      <div id="grocerylist">
        <div id="glistlabel">
          <img src={groceryIcon} />
          <div id="viewlabel">Grocery List</div>
        </div>
        <div className="row" id="header">
          <div className="column1">#</div>
          <div className="column2">ingredient</div>
          <div className="column3">quantity</div>
          <div className="column4">unit</div>
        </div>
        <a href="choosemeals.html">
          <img
            src={backArrow}
            className="backbutton"
            id="backtochoosebutton"
            alt="Back to choose meals"
          />
          <div id="backtochooselabel">choose</div>
        </a>
      </div>

      <h1>Grocery List</h1>
      <p>User ID: {id_no}</p>
      <h2>Selected Meals:</h2>
      {selectedMeals && selectedMeals.length > 0 ? (
        <>
          <ul>
            {selectedMeals.map((meal, index) => (
              <li key={index}>
                {meal.meal_name} (ID: {meal.meal_id}) (Quantity: {meal.quantity}
                )
              </li>
            ))}
          </ul>
          <br />
          <h3>Meal IDs:</h3>
          <ul>
            {meal_ID_list.map((mealId, index) => (
              <li key={index}>{mealId}</li>
            ))}
          </ul>
          <br />
          <h3>Ingredients:</h3>
          <ul>
            {full_ingred_list.map((ingredient, index) => (
              <li key={index}>
                {ingredient.ingredient_name} (ID: {ingredient.ingred_id}) -{" "}
                {ingredient.quantity} {ingredient.unit}
              </li>
            ))}
          </ul>
          <br />
          <h3>Compiled Ingredients:</h3>
          <ul>
            {compiled_ingred_list.map((ingredient, index) => (
              <li key={index}>
                {ingredient.ingredient_name} - {ingredient.quantity}{" "}
                {ingredient.unit}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>No meals selected.</p>
      )}
      <button onClick={handleShowInConsole}>Show In The Console Log</button>
    </div>
  );
};

export default GroceryList;

// import React, { useState, useEffect } from "react";
// import { useLocation, useHistory } from "react-router-dom";
// import { Helmet } from "react-helmet";
// import axios from "axios";
// import backArrow from "./Styling/graphics/meals_back-arrow.png";
// import groceryIcon from "./Styling/graphics/grocery-list-icon.png";
// import "./Styling/glist.css";

// const GroceryList = () => {
//   const location = useLocation();
//   const { id_no, selectedMeals } = location.state || {};
//   const [full_ingred_list, setFullIngredList] = useState([]);
//   const [compiled_ingred_list, setCompiledIngredList] = useState([]);

//   const meal_ID_list = selectedMeals
//     ? selectedMeals.map((meal) => meal.meal_id)
//     : [];

//   const history = useHistory();

//   const handleGoBack = () => {
//     history.goBack();
//   };

//   useEffect(() => {
//     if (meal_ID_list.length > 0) {
//       axios
//         .post(`http://localhost:8070/getingredients`, { meal_ID_list })
//         .then((response) => {
//           setFullIngredList(response.data);
//           compileIngredients(response.data);
//         })
//         .catch((error) => {
//           console.error("Error fetching ingredients:", error);
//         });
//     }
//   }, [meal_ID_list]);

//   const compileIngredients = (ingredients) => {
//     const ingredientMap = ingredients.reduce((acc, ingredient) => {
//       const { ingredient_name, quantity, unit } = ingredient;
//       if (!acc[ingredient_name]) {
//         acc[ingredient_name] = { ingredient_name, quantity, unit };
//       } else {
//         acc[ingredient_name].quantity += quantity;
//       }
//       return acc;
//     }, {});
//     const compiledList = Object.values(ingredientMap);
//     setCompiledIngredList(compiledList);
//   };

//   useEffect(() => {
//     if (compiled_ingred_list.length > 0) {
//       loadGroceryList();
//     }
//   }, [compiled_ingred_list]);

//   const loadGroceryList = () => {
//     const groceryListElement = document.getElementById("grocerylist");

//     // Clear existing rows except the header and the label
//     const rows = groceryListElement.querySelectorAll(".row:not(#header)");
//     rows.forEach((row) => row.remove());

//     compiled_ingred_list.forEach((ingredient, index) => {
//       let newRow = document.createElement("div");
//       newRow.className = "row";

//       let newNum = document.createElement("div");
//       newNum.className = "column1";
//       newNum.textContent = (index + 1).toString();

//       let newIng = document.createElement("div");
//       newIng.className = "column2";
//       newIng.textContent = ingredient.ingredient_name;

//       let newQ = document.createElement("div");
//       newQ.className = "column3";
//       newQ.textContent = ingredient.quantity;

//       let newUnit = document.createElement("div");
//       newUnit.className = "column4";
//       newUnit.textContent = ingredient.unit;

//       newRow.appendChild(newNum);
//       newRow.appendChild(newIng);
//       newRow.appendChild(newQ);
//       newRow.appendChild(newUnit);

//       groceryListElement.appendChild(newRow);
//     });
//   };

//   const handleShowInConsole = () => {
//     console.log("Full Ingredient List:", full_ingred_list);
//     console.log("Compiled Ingredient List:", compiled_ingred_list);
//   };

//   return (
//     <div>
//       <Helmet>
//         <meta charSet="UTF-8" />
//         <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
//         <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//         <link rel="stylesheet" href="glist.css" />
//         <title>Grocery List</title>
//       </Helmet>

//       <div id="grocerylist">
//         <div id="glistlabel">
//           <img src={groceryIcon} />
//           <div id="viewlabel">Grocery List</div>
//         </div>
//         <div className="row" id="header">
//           <div className="column1">#</div>
//           <div className="column2">ingredient</div>
//           <div className="column3">quantity</div>
//           <div className="column4">unit</div>
//         </div>
//         {/* <Link to="/createlist">
//           <img
//             src={backArrow}
//             className="backbutton"
//             id="backtochoosebutton"
//             alt="Back to choose meals"
//           />

//           <div id="backtochooselabel">choose</div>
//         </Link> */}
//         <div onClick={handleGoBack}>
//           <img
//             src={backArrow}
//             className="backbutton"
//             id="backtochoosebutton"
//             alt="Back to choose meals"
//           />
//           <div id="backtochooselabel">choose</div>
//         </div>
//       </div>

//       {/* <button onClick={handleShowInConsole}>Show In The Console Log</button> */}
//     </div>
//   );
// };

// export default GroceryList;
