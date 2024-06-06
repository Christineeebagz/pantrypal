import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import "./Styling/home.css";
import "./Styling/meals.css";
import "./Styling/addmeals.css";
import mealsBackArrow from "./Styling/graphics/meals_back-arrow.png";
import meals from "./Styling/graphics/meals_.svg";
import groceryListIcon from "./Styling/graphics/grocery-list-icon.png";
import mealSalad from "./Styling/graphics/meals_salad.png";
import plus from "./Styling/graphics/plus.png";
import logo from "./Styling/graphics/logo.png";

const Meals = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = location.state || {};
  const [mealNames, setMealNames] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedMeals, setSelectedMeals] = useState([]);
  const [eventHandlers, setEventHandlers] = useState({}); // Define eventHandlers state
  const [errors, setErrors] = useState({});
  const [showInput, setShowInput] = useState(false);
  const [existingIngredients, setExistingIngredients] = useState([]);

  const [values, setValues] = useState({
    meal_name: "",
    ingredients: [],
    ingredient_name: "",
    quantity: "",
    unit: "",
  });

  useEffect(() => {
    if (user && user.id_no) {
      axios
        .get(`http://localhost:8070/getmeals?id_no=${user.id_no}`)
        .then((response) => {
          const uniqueMealNames = Array.from(
            new Set(
              response.data.map((meal) => ({
                id: meal.meal_id,
                name: meal.meal_name,
              }))
            )
          );
          setMealNames(uniqueMealNames);
          console.log(
            "Meal IDs:",
            uniqueMealNames.map((meal) => meal.id)
          );
          console.log(
            "Meal Names:",
            uniqueMealNames.map((meal) => meal.name)
          );

          const handlers = {};
          uniqueMealNames.forEach((meal) => {
            handlers[meal.id] = {
              click: () => handleMealClick(meal.id),
              dblclick: () => handleMealDoubleClick(meal.id),
            };
          });
          setEventHandlers(handlers);

          response.data.forEach((meal) => {
            axios
              .get(
                `http://localhost:8070/getIngredients?meal_id=${meal.meal_id}`
              )
              .then((response) => {
                console.log(
                  "Existing Ingredients for meal",
                  meal.meal_name,
                  ":",
                  response.data
                );
                // Update existing ingredients state here
                setExistingIngredients((prevIngredients) => [
                  ...prevIngredients,
                  ...response.data,
                ]);
              })
              .catch((error) => {
                console.error("Error fetching ingredients:", error);
              });
          });
        })
        .catch((error) => {
          console.error("Error fetching meal names:", error);
        });
    }
  }, [user]);

  const viewMealHandler = (mealId, mealName) => () => {
    handleMealClick(mealId, mealName);
  };

  const handleMealClick = (mealId, mealName) => {
    console.log(`Meal clicked: ${mealId}`);
    viewMeal(mealId, mealName);
  };

  const handleMealDoubleClick = (mealId) => {
    console.log(`Meal double-clicked: ${mealId}`);
  };

  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  //                                        FOR MEALS PART: BUTTONS
  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  const handleEdit = () => {
    setIsEditing(true);
    document.getElementById("editbutton").style.display = "none";
    document.getElementById("cancelbutton").style.display = "block";
    document.getElementById("deletebutton").style.display = "block";

    let newRadio = document.createElement("input");
    newRadio.setAttribute("type", "checkbox");
    newRadio.className = "deleteSelect";

    let oldIcons = Array.from(document.getElementsByClassName("mealicon"));

    oldIcons.forEach(function (oldIcon) {
      oldIcon.parentNode.replaceChild(newRadio.cloneNode(true), oldIcon);
    });

    let meals = Array.from(document.getElementsByClassName("meal"));
    meals.forEach(function (meal) {
      meal.style.pointerEvents = "none";
      meal.removeEventListener("click", eventHandlers[meal.mealid].click);
      meal.removeEventListener("dblclick", eventHandlers[meal.mealid].dblclick);
    });
  };

  const handleCancel = () => {
    setIsEditing(false);

    document.getElementById("editbutton").style.display = "block";
    document.getElementById("cancelbutton").style.display = "none";
    document.getElementById("deletebutton").style.display = "none";

    let newImg = document.createElement("img");
    newImg.src = mealSalad;
    newImg.className = "mealicon";

    let checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(function (checkbox) {
      checkbox.parentNode.replaceChild(newImg.cloneNode(true), checkbox);
    });

    let meals = Array.from(document.getElementsByClassName("meal"));
    meals.forEach(function (meal) {
      meal.addEventListener("click", eventHandlers[meal.mealid].click);
      meal.addEventListener("dblclick", eventHandlers[meal.mealid].dblclick);
    });
  };

  const handleDeleteMeal = () => {
    console.log("INSIDE DELETE:");
    const mealsToDelete = [];
    const mealIdsToDelete = [];
    let checkboxes = document.querySelectorAll('input[type="checkbox"]');
    let checkedFlag = false;

    checkboxes.forEach(function (checkbox) {
      if (checkbox.checked) {
        checkedFlag = true;
        let parent = checkbox.closest(".meal");
        let mealName = parent.querySelector(".mealname").innerText;
        mealsToDelete.push(mealName);

        // Find the meal ID by matching the meal name
        const meal = mealNames.find((meal) => meal.name === mealName);
        if (meal) {
          mealIdsToDelete.push(meal.id);
        }
      }
    });

    if (!checkedFlag) {
      alert("Select a meal to delete first!");
      return;
    }

    console.log("INSIDE DELETE:", mealIdsToDelete);

    axios
      .delete("http://localhost:8070/deletemeals", {
        data: {
          id_no: user.id_no,
          meals: mealsToDelete,
        },
      })
      .then((response) => {
        console.log("Delete meals response:", response);

        axios
          .delete("http://localhost:8070/deleteIngredients", {
            data: {
              meal_id: mealIdsToDelete,
            },
          })
          .then((response) => {
            console.log("Delete ingredients response:", response);

            // Update the mealNames state to remove deleted meals
            setMealNames((prevMeals) =>
              prevMeals.filter((meal) => !mealsToDelete.includes(meal.name))
            );

            // Clear selected meals and reset editing state
            setSelectedMeals([]);
            setIsEditing(false);

            // Reload the page to reflect changes
            window.location.reload();
          })
          .catch((error) => {
            console.error("Error deleting ingredients:", error);
          });
      })
      .catch((error) => {
        console.error("Error deleting meals:", error);
      });
  };

  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  //                                        FOR MEALS PART: NAVIGATION
  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  const handleCreateMeal = () => {
    navigate("/createmeal", { state: { user: user } });
  };

  const handleHomeBack = () => {
    navigate("/home", { state: { user: user } });
  };

  const handleMealsBack = () => {
    window.location.reload();
  };

  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  //                                        FOR MEALS PART: TO VIEW MEAL
  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  const viewMeal = (mealID, mealName) => {
    console.log("INSIDE VIEWMEAL");
    document.getElementById("mealviewcontainer").style.display = "flex";
    document.getElementById("maincontainer").style.display = "none";

    document.getElementById("viewmealname").textContent = mealName;

    // Check if event listener is already added before adding it
    let editButton = document.getElementById("editmealbutton");
    if (!editButton.hasEventListener) {
      editButton.addEventListener("click", () =>
        editMealDetails(mealID, mealName)
      );
      editButton.hasEventListener = true;
    }

    axios
      .get(`http://localhost:8070/getIngredients?meal_id=${mealID}`)
      .then((response) => {
        console.log(
          `Viewing meal with ID VIEWMEAL: ${mealID}, Name: ${mealName}`
        );
        if (response.data && response.data.length > 0) {
          setExistingIngredients((prevIngredients) => {
            const updatedIngredients = [...prevIngredients, ...response.data];
            console.log("SHOWING INGRED 1:", updatedIngredients);
            return updatedIngredients;
          });

          const ingredients = response.data;
          ingredients.forEach((ingredient) => {
            const { ingredient_name, quantity, unit, ingred_id } = ingredient;
            let newRow = document.createElement("div");
            newRow.className = "row";
            newRow.ingId = ingred_id;
            let newNum = document.createElement("div");
            newNum.className = "blank";
            newNum.textContent = "";
            let newIng = document.createElement("div");
            newIng.className = "column2";
            newIng.textContent = ingredient_name;
            let newQ = document.createElement("div");
            newQ.className = "column3";
            newQ.textContent = quantity;
            let newUnit = document.createElement("div");
            newUnit.className = "column4";
            newUnit.textContent = unit;

            newRow.appendChild(newNum);
            newRow.appendChild(newIng);
            newRow.appendChild(newQ);
            newRow.appendChild(newUnit);

            document.getElementById("mealviewcontainer").appendChild(newRow);
          });
        } else {
          console.log("No ingredients found for meal_id:", mealID);
        }
      })
      .catch((error) => {
        console.error("Error fetching ingredients:", error);
      });
  };

  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  //                                FOR INGREDIENTS PART: BUTTONS
  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  const handleCancelEdit = (mealId, mealName) => {
    window.location.reload();
    // document.getElementById('editmealbutton').style.display = 'block';
    // document.getElementById('canceleditmealbutton').style.display = 'none';
    // document.getElementById('saveeditedmealbutton').style.display = 'none';
    // document.getElementById('addingredient').style.display = 'none';

    // let container = document.getElementById('mealviewcontainer');

    // // Restore event listeners
    // container.removeEventListener("click", editMealDetails);
    // container.removeEventListener("click", addRow);

    // let rows = container.getElementsByClassName('row');
    // for (let i = 1; i < rows.length; i++) {
    //   let row = rows[i];

    //   // Remove the "x" icon
    //   let oldNum = row.querySelector('.column1');
    //   if (oldNum) {
    //     oldNum.removeEventListener("click", deleteIngredient);
    //     row.removeChild(oldNum);
    //   }

    //   // Remove the "/" icon
    //   let oldCheck = row.querySelector('.column11');
    //   if (oldCheck) {
    //     row.removeChild(oldCheck);
    //   }

    //   let iname = document.createElement('div');
    //   iname.className = 'column2';
    //   iname.textContent = row.querySelector('.ingredient-name-input').value;

    //   let quantity = document.createElement('div');
    //   quantity.className = 'column3';
    //   quantity.textContent = row.querySelector('.ingredient-quantity-input').value;

    //   let unit = document.createElement('div');
    //   unit.className = 'column4';
    //   unit.textContent = row.querySelector('.ingredient-unit-select').value;

    //   row.replaceChild(iname, row.querySelector('.column2'));
    //   row.replaceChild(quantity, row.querySelector('.column3'));
    //   row.replaceChild(unit, row.querySelector('.column4'));
    // }

    // // Restore event listeners
    // let newIngredientButton = document.getElementById("newingredient");
    // newIngredientButton.addEventListener("click", addRow);

    // let cancelButton = document.getElementById("canceleditmealbutton");
    // cancelButton.addEventListener("click", () => handleCancelEdit(mealId, mealName));

    // let saveButton = document.getElementById("saveeditedmealbutton");
    // saveButton.addEventListener("click", () => saveEditMeal(mealId));
  };

  const saveEditMeal = (mealId) => {
    const mealNameInput = document.getElementById("viewmealname");

    if (!mealNameInput.value.trim()) {
      alert("Meal name cannot be blank.");
      return;
    }

    axios
      .get(`http://localhost:8070/getIngredients?meal_id=${mealId}`)
      .then((response) => {
        if (response.data.length === 0) {
          alert("Please input at least one ingredient");
          return;
        } else {
          // If ingredients are present, reload the page
          window.location.reload();
        }
      })
      .catch((error) => {
        console.error("Error fetching ingredients:", error);
        alert("Please input at least one ingredient");
        return;
      });
  };

  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  //                                  FOR INGREDIENTS PART: CHANGES
  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  const handleMealChange = (event, mealId) => {
    const { value } = event.target;

    if (!value.trim()) {
      alert("Meal name cannot be blank.");
      return;
    }

    console.log("Meal name:", value, mealId); // Logging the meal name

    setValues((prev) => ({
      ...prev,
      meal_name: value,
    }));

    // Update the meal name on the server
    axios
      .post(`http://localhost:8070/updateMealName`, {
        meal_id: mealId,
        meal_name: value,
        id_no: user.id_no,
      })
      .then((response) => {
        console.log("Meal name updated successfully:", response.data);
      })
      .catch((error) => {
        alert("Duplicate meal. Please use a different meal name.");
      });
  };

  const handleIngredientChange = (event, mealId, rowIndex, field) => {
    const value = event.target.value;
    console.log(
      `Meal ID: ${mealId}, Row Index: ${rowIndex}, Field: ${field}, New Value: ${value}`
    );

    setValues((prevValues) => {
      // Check for duplicate ingredient names if the field being changed is the ingredient name
      if (field === "name") {
        const isDuplicateIngredientName = existingIngredients.some(
          (ingredient, index) =>
            index !== rowIndex && ingredient.ingredient_name === value
        );
        if (isDuplicateIngredientName) {
          alert(
            "Duplicate ingredients. Please use a different ingredient name."
          );
          return prevValues; // Don't update the state if there's a duplicate
        }
      }

      axios
        .get(`http://localhost:8070/getIngredients?meal_id=${mealId}`)
        .then((response) => {
          console.log(`Viewing meal with ID VIEWMEAL: ${mealId}`);
          if (response.data && response.data.length > 0) {
            console.log("response data:", response.data);
            const ingredientToUpdate = response.data[rowIndex - 1];
            axios
              .post(`http://localhost:8070/updateIngredient`, {
                ingred_id: ingredientToUpdate.ingred_id,
                ingredient_name:
                  field === "name" ? value : ingredientToUpdate.ingredient_name,
                quantity:
                  field === "quantity" ? value : ingredientToUpdate.quantity,
                unit: field === "unit" ? value : ingredientToUpdate.unit,
              })
              .then((response) => {
                console.log("Ingredient updated successfully:", response.data);
              })
              .catch((error) => {
                console.error("Error updating ingredient:", error);
              });

            // Update existingIngredients state
            setExistingIngredients((prevIngredients) => {
              const newIngredients = [...prevIngredients];
              newIngredients[rowIndex] = {
                ...newIngredients[rowIndex],
                [field]: value,
              };
              return newIngredients;
            });

            // Update the meal values state
            return {
              ...prevValues,
              [field]: value,
            };
          } else {
            console.log("No ingredients found for meal_id:", mealId);
          }
        })
        .catch((error) => {
          console.error("Error fetching ingredients:", error);
        });
    });
  };

  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  //                               FOR INGREDIENTS PART: EDITING DETAILS
  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  const editMealDetails = (mealId, mealName) => {
    console.log("INSIDE EDIT");
    let newName = document.createElement("input");
    newName.setAttribute("type", "text");
    newName.id = "viewmealname";
    newName.value = mealName;
    newName.addEventListener("change", (event) =>
      handleMealChange(event, mealId)
    );
    newName.className = "meal-name-input";

    let label = document.getElementById("viewmeallabel");
    let oldName = label.querySelector("#viewmealname");
    if (oldName) {
      label.replaceChild(newName, oldName);
    }

    console.log("before FOR LOOP");
    let container = document.getElementById("mealviewcontainer");

    document.getElementById("editmealbutton").style.display = "none";
    document.getElementById("canceleditmealbutton").style.display = "block";
    document.getElementById("saveeditedmealbutton").style.display = "block";
    document.getElementById("addingredient").style.display = "block";

    // Check if event listener is already added before adding it
    let saveButton = document.getElementById("saveeditedmealbutton");
    if (!saveButton.hasEventListener) {
      saveButton.addEventListener("click", () => saveEditMeal(mealId));
      saveButton.hasEventListener = true;
    }

    // Check if event listener is already added before adding it
    let cancelButton = document.getElementById("canceleditmealbutton");
    if (!cancelButton.hasEventListener) {
      cancelButton.addEventListener("click", () =>
        handleCancelEdit(mealId, mealName)
      );
      cancelButton.hasEventListener = true;
    }

    // Check if event listener is already added before adding it
    let addButton = document.getElementById("addingredient");
    if (!addButton.hasEventListener) {
      addButton.addEventListener("click", () => addRow(mealId));
      addButton.hasEventListener = true;
    }

    let rows = container.getElementsByClassName("row");
    for (let i = 1; i < rows.length; i++) {
      let row = rows[i];

      let newNum = document.createElement("div");
      newNum.className = "column1";
      newNum.textContent = "x";

      let iname = document.createElement("input");
      iname.setAttribute("type", "text");
      iname.className = "column2 ingredient-name-input";
      iname.id = `ingredient-name-${i}`;
      iname.addEventListener("change", (event) =>
        handleIngredientChange(event, mealId, i, "name")
      );

      let quantity = document.createElement("input");
      quantity.setAttribute("type", "number");
      quantity.className = "column3 ingredient-quantity-input";
      quantity.id = `ingredient-quantity-${i}`;
      quantity.addEventListener("change", (event) =>
        handleIngredientChange(event, mealId, i, "quantity")
      );

      let unit = document.createElement("select");
      unit.className = "column4 ingredient-unit-select";
      unit.id = `ingredient-unit-${i}`;
      unit.addEventListener("change", (event) =>
        handleIngredientChange(event, mealId, i, "unit")
      );

      const options = [
        "Grams (g)",
        "Kilograms (kg)",
        "Milligrams (mg)",
        "Pieces",
        "Ounces (oz)",
        "Teaspoon (tsp)",
        "Tablespoon (tbsp)",
        "Cup",
        "Gallon",
        "Liter",
        "Pound (lb)",
        "Box",
        "Pack",
      ];

      options.forEach((optionText) => {
        const option = document.createElement("option");
        option.value = optionText;
        option.textContent = optionText;
        unit.appendChild(option);
      });

      console.log("AFTER FOR LOOP");
      let oldName = row.querySelector(".column2");
      let oldQuantity = row.querySelector(".column3");
      let oldUnit = row.querySelector(".column4");

      if (oldName) {
        iname.value = oldName.textContent;
      }
      if (oldQuantity) {
        quantity.value = oldQuantity.textContent;
      }
      if (oldUnit) {
        let selectedUnitText = oldUnit.textContent;
        let selectedUnit = Array.from(unit.options).find(
          (option) => option.textContent === selectedUnitText
        );
        if (selectedUnit) {
          selectedUnit.selected = true;
        } else {
          console.log("Selected unit not found.");
        }
      }

      let oldBlank = row.querySelector(".blank");
      if (oldBlank) {
        newNum.addEventListener("click", deleteIngredient);
        row.replaceChild(newNum, oldBlank);
      }
      if (oldName) {
        row.replaceChild(iname, oldName);
      }
      if (oldQuantity) {
        row.replaceChild(quantity, oldQuantity);
      }
      if (oldUnit) {
        row.replaceChild(unit, oldUnit);
      }
    }
  };

  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  //                               FOR INGREDIENTS PART: ADD AND DELETE
  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  const addRow = (mealId) => {
    console.log("INSIDE ADD");
    let newRow = document.createElement("div");
    newRow.className = "row";

    let newNum = document.createElement("div");
    newNum.className = "column1";
    newNum.textContent = "x";

    let check = document.createElement("div");
    check.className = "column11";
    check.textContent = "/";

    let iname = document.createElement("input");
    iname.setAttribute("type", "text");
    iname.className = "column2";
    iname.placeholder = "Enter an ingredient";

    let quantity = document.createElement("input");
    quantity.setAttribute("type", "number");
    quantity.className = "column3";
    quantity.placeholder = "0";

    let unit = document.createElement("select");
    unit.className = "column4";
    unit.id = "unit";

    const options = [
      "Grams (g)",
      "Kilograms (kg)",
      "Milligrams (mg)",
      "Pieces",
      "Ounces (oz)",
      "Teaspoon (tsp)",
      "Tablespoon (tbsp)",
      "Cup",
      "Gallon",
      "Liter",
      "Pound (lb)",
      "Box",
      "Pack",
    ];

    options.forEach((optionText) => {
      const option = document.createElement("option");
      option.value = optionText;
      option.textContent = optionText;
      unit.appendChild(option);
    });

    newRow.appendChild(newNum);
    newRow.appendChild(check);
    newRow.appendChild(iname);
    newRow.appendChild(quantity);
    newRow.appendChild(unit);

    document.getElementById("mealviewcontainer").appendChild(newRow);

    newNum.addEventListener("click", deleteIngredient);

    check.addEventListener("click", () => {
      console.log(
        "INSIDE ADD INGRED:",
        iname.value,
        quantity.value,
        unit.value
      );

      const ingredient_name = iname.value;
      const quantityValue = quantity.value;
      const unitValue = unit.value;

      if (ingredient_name && quantityValue && unitValue) {
        const newIngredient = {
          ingredient_name,
          quantity: quantityValue,
          unit: unitValue,
          meal_id: mealId, // Ensure mealID is defined in your scope
        };

        console.log("NEW INGRED", newIngredient.meal_id);
        axios
          .post("http://localhost:8070/insertIngredient", newIngredient)
          .then((response) => {
            if (response.data.error) {
              alert("Duplicate exists");
            } else {
              console.log("Ingredient added successfully:", response.data);
              setExistingIngredients((prevIngredients) => [
                ...prevIngredients,
                response.data,
              ]);
            }
            check.remove();
          })
          .catch((error) => {
            alert("Duplicate exists. Please try again.");
          });
      } else {
        alert("All fields are required.");
      }
    });
  };

  const deleteIngredient = (event) => {
    let target = event.target;

    setExistingIngredients((prev) => {
      const newIngredients = prev.filter(
        (ingredient) => ingredient.ingId !== target.parentNode.ingId
      );

      axios
        .delete(`http://localhost:8070/deleteIngredient`, {
          data: { ingred_id: target.parentNode.ingId },
        })
        .then((response) => {
          console.log("Ingredient deleted successfully:", response.data);
        })
        .catch((error) => {
          console.error("Error deleting ingredient:", error);
        });

      return newIngredients;
    });

    target.parentNode.remove();
  };

  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  //                                         RETURN
  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  return (
    <div>
      <Helmet>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>PantryPal - Home</title>
        <link rel="icon" href={logo} type="image/x-icon" />
        <link rel="stylesheet" href="meals.css" />
      </Helmet>
      <a href="welcome.html" className="PantryPalName">
        PantryPal.
      </a>
      {/* <button className="signout">Sign Out</button> */}
      <div onClick={handleHomeBack}>
        <img src={mealsBackArrow} className="backbutton" alt="Back" />
        <div className="backhomelabel">home</div>
      </div>
      <div id="maincontainer">
        <div className="label">
          <div className="mealslabel">Meals</div>
          <button id="deletebutton" onClick={handleDeleteMeal}>
            delete
          </button>
          <button id="editbutton" onClick={handleEdit}>
            edit
          </button>
          <button id="cancelbutton" onClick={handleCancel}>
            cancel
          </button>
        </div>
        <div className="addmeal" onClick={handleCreateMeal}>
          <img src={meals} alt="Add Meal" />
        </div>
        {/* Blank meal */}
        <Meal key="blank" id="blank" name="" viewMealHandler={() => {}} />
        {/* Render existing meals */}
        {mealNames.map((meal) => (
          <Meal
            key={meal.id}
            id={meal.id}
            name={meal.name}
            viewMealHandler={viewMealHandler(meal.id, meal.name)}
            isEditing={isEditing} // Pass isEditing as a prop
          />
        ))}
      </div>{" "}
      {/* Closing tag for maincontainer div */}
      <div id="mealviewcontainer">
        <div id="viewmeallabel">
          <img src={groceryListIcon} alt="Grocery List Icon" />
          <div id="viewmealname">meal name</div>
        </div>
        <div className="row" id="header">
          <div className="column1"></div>
          <div className="column2">ingredient</div>
          <div className="column3">quantity</div>
          <div className="column4">unit</div>
        </div>
        <button id="editmealbutton">edit</button>
        <button id="canceleditmealbutton">cancel</button>
        <button id="saveeditedmealbutton">save</button>
        <div onClick={handleMealsBack}>
          <img
            src={mealsBackArrow}
            className="backbutton"
            id="backtochoosebutton"
            alt="Back to Choose"
          />
          <div id="backtochooselabel">meals</div>
        </div>
        <div id="addingredient">
          <img src={plus} id="newingredient" alt="New Ingredient" />
          <div id="newingredientlabel">new</div>
        </div>
      </div>
    </div>
  );
};

////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                        TO LOAD MEALS
////////////////////////////////////////////////////////////////////////////////////////////////////////
const Meal = ({ id, name, viewMealHandler, isEditing }) => {
  const handleClick = () => {
    if (!isEditing) {
      viewMealHandler(id, name);
    }
  };

  return (
    <div className="meal" onClick={handleClick}>
      {name && (
        <React.Fragment key={id}>
          <img src={mealSalad} className="mealicon" alt="Meal Icon" />
          <div className="mealname">{name}</div>
        </React.Fragment>
      )}
    </div>
  );
};

export default Meals;
