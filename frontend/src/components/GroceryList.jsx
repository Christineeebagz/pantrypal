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
  const [adjustQuantity, setAdjustQuantity] = useState([]);
  const [compiled_ingred_list, setCompiledIngredList] = useState([]);
  const [partialCompiledIngredList, setPartialCompiledIngredList] = useState(
    []
  );
  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top of the page on component mount
  }, []);

  const meal_ID_list = selectedMeals
    ? selectedMeals.map((meal) => meal.meal_id)
    : [];

  useEffect(() => {
    if (meal_ID_list.length > 0) {
      axios
        .post(`http://localhost:8070/getingredientslist`, { meal_ID_list })
        .then((response) => {
          setFullIngredList(response.data);
        })
        .catch((error) => {
          console.error("Error fetching ingredients:", error);
        });
    }
  }, [meal_ID_list]);

  useEffect(() => {
    if (selectedMeals && selectedMeals.length > 0) {
      const adjustedQuantities = selectedMeals.map((meal) => ({
        meal_id: meal.meal_id,
        quantity: meal.quantity,
      }));
      setAdjustQuantity(adjustedQuantities);
    }
  }, [selectedMeals]);

  useEffect(() => {
    if (full_ingred_list.length > 0 && adjustQuantity.length > 0) {
      const adjustedList = partialList(adjustQuantity, full_ingred_list);
      compileIngredients(adjustedList);
      setPartialCompiledIngredList(adjustedList);
    }
  }, [full_ingred_list, adjustQuantity]);

  const handleCreateList = () => {
    // console.log("Going to create list with: " + userId);
    console.log("sending this: " + userID);
    navigate("/createlist", { state: { user: { ...user, id_no: userId } } });
  };

  const partialList = (adjust, main) => {
    // Clone the main list to avoid mutating the original array
    let adjustedMain = [...main];

    // Iterate through each adjustment
    adjust.forEach((adj) => {
      // Find the corresponding ingredient in adjustedMain
      adjustedMain = adjustedMain.map((ingredient) => {
        console.log(
          `Comparing: ingredient.meal_id (${ingredient.meal_id}) and adj.meal_id (${adj.meal_id})`
        );
        console.log(
          `Types: ${typeof ingredient.meal_id} and ${typeof adj.meal_id}`
        );

        if (Number(ingredient.meal_id) === Number(adj.meal_id)) {
          const newQuantity = ingredient.quantity * adj.quantity;
          console.log(
            `Multiplying: ${ingredient.quantity} * ${adj.quantity} = ${newQuantity}`
          );
          return {
            ...ingredient,
            quantity: newQuantity,
          };
        } else {
          console.log("IDs do not match");
        }
        return ingredient;
      });
    });

    return adjustedMain;
  };

  const compileIngredients = (ingredients) => {
    const ingredientMap = ingredients.reduce((acc, ingredient) => {
      const { ingredient_name, quantity, unit } = ingredient;
      const key = `${ingredient_name}-${unit}`;
      if (!acc[key]) {
        acc[key] = { ingredient_name, quantity, unit };
      } else {
        acc[key].quantity += quantity;
      }
      return acc;
    }, {});

    // Sort ingredients by name and then by unit
    const compiledList = Object.values(ingredientMap).sort((a, b) => {
      if (a.ingredient_name < b.ingredient_name) return -1;
      if (a.ingredient_name > b.ingredient_name) return 1;
      if (a.unit < b.unit) return -1;
      if (a.unit > b.unit) return 1;
      return 0;
    });

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

  return (
    <div>
      <Helmet>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="glist.css" />
        <title>Grocery List</title>
      </Helmet>

      <div id="grocerylist"></div>
      <div id="glistlabel">
        <img src={groceryIcon} />
        <div id="viewlabel">Grocery List</div>
      </div>
      <img
        src={backArrow}
        onClick={handleCreateList}
        className="backbutton"
        id="backtochoosebutton"
      ></img>
      <div id="backtochooselabel">choose</div>
    </div>
  );
};

export default GroceryList;

// import React, { useState, useEffect } from "react";
// import { useLocation } from "react-router-dom";
// import { Helmet } from "react-helmet";
// import axios from "axios";
// import backArrow from "./Styling/graphics/meals_back-arrow.png";
// import groceryIcon from "./Styling/graphics/grocery-list-icon.png";
// import "./Styling/glist.css";

// const GroceryList = () => {
//   const location = useLocation();
//   const { id_no, selectedMeals } = location.state || {};
//   const [full_ingred_list, setFullIngredList] = useState([]);
//   const [adjustQuantity, setAdjustQuantity] = useState([]);

//   const [compiled_ingred_list, setCompiledIngredList] = useState([]);

//   const meal_ID_list = selectedMeals
//     ? selectedMeals.map((meal) => meal.meal_id)
//     : [];

//   useEffect(() => {
//     if (meal_ID_list.length > 0) {
//       axios
//         .post(`http://localhost:8070/getingredients`, { meal_ID_list })
//         .then((response) => {
//           setFullIngredList(response.data);
//         })
//         .catch((error) => {
//           console.error("Error fetching ingredients:", error);
//         });
//     }
//   }, [meal_ID_list]);
//   useEffect(() => {
//     if (selectedMeals && selectedMeals.length > 0) {
//       const adjustedQuantities = selectedMeals.map((meal) => ({
//         meal_id: meal.meal_id,
//         quantity: meal.quantity,
//       }));
//       setAdjustQuantity(adjustedQuantities);
//     }
//     compileIngredients(partialList(full_ingred_list, adjustQuantity));
//     partialList(full_ingred_list, adjustQuantity);
//   }, [selectedMeals]);

//   const partialList = (adjust, main) => {
//     // Clone the main list to avoid mutating the original array
//     let adjustedMain = [...main];

//     // Iterate through each adjustment
//     adjust.forEach((adj) => {
//       // Find the corresponding ingredient in adjustedMain
//       adjustedMain = adjustedMain.map((ingredient) => {
//         console.log(
//           `Comparing: ingredient.meal_id (${ingredient.meal_id}) and adj.meal_id (${adj.meal_id})`
//         );
//         console.log(
//           `Types: ${typeof ingredient.meal_id} and ${typeof adj.meal_id}`
//         );

//         if (Number(ingredient.meal_id) === Number(adj.meal_id)) {
//           const newQuantity = ingredient.quantity * adj.quantity;
//           console.log(
//             `Multiplying: ${ingredient.quantity} * ${adj.quantity} = ${newQuantity}`
//           );
//           return {
//             ...ingredient,
//             quantity: newQuantity,
//           };
//         } else {
//           console.log("IDs do not match");
//         }
//         return ingredient;
//       });
//     });

//     compileIngredients(adjustedMain);
//     return adjustedMain;
//   };

//   const compileIngredients = (ingredients) => {
//     const ingredientMap = ingredients.reduce((acc, ingredient) => {
//       const { ingredient_name, quantity, unit } = ingredient;
//       const key = `${ingredient_name}-${unit}`;
//       if (!acc[key]) {
//         acc[key] = { ingredient_name, quantity, unit };
//       } else {
//         acc[key].quantity += quantity;
//       }
//       return acc;
//     }, {});

//     // Sort ingredients by name and then by unit
//     const compiledList = Object.values(ingredientMap).sort((a, b) => {
//       if (a.ingredient_name < b.ingredient_name) return -1;
//       if (a.ingredient_name > b.ingredient_name) return 1;
//       if (a.unit < b.unit) return -1;
//       if (a.unit > b.unit) return 1;
//       return 0;
//     });

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
//     const finalPartialList = partialList(adjustQuantity, full_ingred_list);
//     console.log("Full Ingredient List:", full_ingred_list);
//     console.log("Compiled Ingredient List:", compiled_ingred_list);
//     console.log("Quantity: ", adjustQuantity);
//     console.log("Partial Compiled Ingredient List:", finalPartialList);
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

//       <div id="grocerylist"></div>

//       <h1>Grocery List</h1>
//       <p>User ID: {id_no}</p>
//       <h2>Selected Meals:</h2>
//       {selectedMeals && selectedMeals.length > 0 ? (
//         <>
//           <ul>
//             {selectedMeals.map((meal, index) => (
//               <li key={index}>
//                 {meal.meal_name} (ID: {meal.meal_id}) (Quantity: {meal.quantity}
//                 )
//               </li>
//             ))}
//           </ul>
//           <br />
//           <h3>Meal IDs:</h3>
//           <ul>
//             {meal_ID_list.map((mealId, index) => (
//               <li key={index}>{mealId}</li>
//             ))}
//           </ul>
//           <br />
//           <h3>Ingredients:</h3>
//           <ul>
//             {full_ingred_list.map((ingredient, index) => (
//               <li key={index}>
//                 {ingredient.ingredient_name} (ID: {ingredient.ingred_id}) -{" "}
//                 {ingredient.quantity} {ingredient.unit}
//               </li>
//             ))}
//           </ul>
//           <br />
//           <h3>AdjustQuantity:</h3>
//           <ul>
//             {adjustQuantity.map((ingredient, index) => (
//               <li key={index}>
//                 (meal_id: {ingredient.meal_id}) {ingredient.quantity}
//               </li>
//             ))}
//           </ul>
//           <br />
//           <h3>Compiled Ingredients:</h3>
//           <ul>
//             {compiled_ingred_list.map((ingredient, index) => (
//               <li key={index}>
//                 {ingredient.ingredient_name} - {ingredient.quantity}{" "}
//                 {ingredient.unit}
//               </li>
//             ))}
//           </ul>
//         </>
//       ) : (
//         <p>No meals selected.</p>
//       )}
//       <button onClick={handleShowInConsole}>Show In The Console Log</button>
//     </div>
//   );
// };

// export default GroceryList;
