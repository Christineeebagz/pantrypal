const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
app.use(express.json());

const corsOptions = {
  origin: "http://localhost:5174", // Replace with your React app's origin
  credentials: true, // Change to 'true' if needed for cookies
  optionSuccessStatus: 200, // some legacy browsers require this
};

app.use(cors(corsOptions));

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "pantrypal",
  port: 3308,
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("Connected to the database");
});

app.post("/signup", (req, res) => {
  const sql =
    "INSERT INTO `user information` (`username`, `firstName`, `lastName`, `email`, `password`) VALUES (?)";
  const values = [
    req.body.username,
    req.body.firstName,
    req.body.lastName,
    req.body.email,
    req.body.password,
  ];

  db.query(sql, [values], (err, result) => {
    if (err) {
      console.error("Signup query error:", err);
      return res.status(500).json("Error");
    }

    // Get the id_no of the inserted user
    const userId = result.insertId;

    // Return the full user data, including id_no
    res.json({ ...req.body, id_no: userId });
  });
});

app.post("/signin", (req, res) => {
  const { email, password } = req.body;
  const sql =
    "SELECT * FROM `user information` WHERE `email` = ? AND `password` = ?";

  db.query(sql, [email, password], (err, data) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ message: "Error" });
    }
    if (data.length > 0) {
      const user = data[0]; // Get the first matching user
      return res.status(200).json({ ...user, message: "Success" });
    } else {
      return res.status(401).json({ message: "Failed" });
    }
  });
});

app.post("/api/check-unique", (req, res) => {
  const { field, value } = req.body;
  const sql = `SELECT * FROM \`user information\` WHERE \`${field}\` = ?`;

  db.query(sql, [value], (err, data) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ exists: false });
    }
    if (data.length > 0) {
      return res.status(200).json({ exists: true });
    } else {
      return res.status(200).json({ exists: false });
    }
  });
});

app.post("/getid", (req, res) => {
  const { username } = req.body;
  const sql = "SELECT id_no FROM `user information` WHERE username = ?";
  db.query(sql, [username], (err, result) => {
    if (err) {
      return res.status(500).json("Error");
    }
    if (result.length > 0) {
      res.json({ id_no: result[0].id_no });
    } else {
      res.status(404).json("User not found");
    }
  });
});

app.get("/getmealslist", (req, res) => {
  const { id_no } = req.query; // Use req.query for GET requests
  const sql = "SELECT meal_id, meal_name FROM `customer meal` WHERE id_no = ?";
  db.query(sql, [id_no], (err, result) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json("Error");
    }
    if (result.length > 0) {
      console.log("Meals found for id_no:", id_no, result); // Log the entire result object
      // Modify the result to include both meal_id and meal_name in an array for each meal
      const meals = result.map((row) => ({
        meal_id: row.meal_id,
        meal_name: row.meal_name,
      }));
      res.json(meals);
    } else {
      console.log("No meals found for id_no:", id_no);
      res.status(404).json("Meals not found");
    }
  });
});

app.post("/getingredientslist", (req, res) => {
  const { meal_ID_list } = req.body;
  const sql = `SELECT ingred_id, ingredient_name, quantity, unit, meal_id  FROM \`customer ingredients\` WHERE meal_id IN (?)`;
  db.query(sql, [meal_ID_list], (err, result) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json("Error");
    }
    if (result.length > 0) {
      res.json(result);
    } else {
      res.status(404).json("Ingredients not found");
    }
  });
});

////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                          TO GET
////////////////////////////////////////////////////////////////////////////////////////////////////////
app.get("/getmeals", (req, res) => {
  const { id_no } = req.query; // Use req.query for GET requests
  const sql = "SELECT meal_id, meal_name FROM `customer meal` WHERE id_no = ?";
  db.query(sql, [id_no], (err, result) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json("Error");
    }
    if (result.length > 0) {
      result.forEach((meal) => {});
      res.json(result);
    } else {
      res.status(404).json("Meals not found");
    }
  });
});

app.get("/getingredients", (req, res) => {
  const { meal_id } = req.query; // Use req.query for GET requests
  const sql =
    "SELECT `ingred_id`,`ingredient_name`,`quantity`,`unit` FROM `customer ingredients` WHERE `meal_id` = ?";
  db.query(sql, [meal_id], (err, result) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json("Error");
    }
    if (result.length > 0) {
      console.log("Ingredients found for meal_id:", meal_id);
      result.forEach((ingredient) => {
        console.log("Ingredient ID:", ingredient.ingred_id);
      });
      res.json(result); // Send the result directly as JSON
    } else {
      console.log("No ingredients found for meal_id:", meal_id);
      res.status(404).json("Ingredients not found");
    }
  });
});

app.get("/getmealId", (req, res) => {
  const { id_no, meal_name } = req.query; // Use req.query for GET requests
  console.log("inside getmeal:", id_no, meal_name);
  const sql =
    "SELECT `meal_id` FROM `customer meal` WHERE `id_no` = ? AND `meal_name` = ?";
  db.query(sql, [id_no, meal_name], (err, result) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json("Error");
    }
    if (result.length > 0) {
      console.log("Inside getidmeal:", id_no, "and meal_name:", meal_name);
      res.json(result);
    } else {
      console.log(
        "No meal ID found for id_no:",
        id_no,
        "and meal_name:",
        meal_name
      );
      res.status(404).json("Meal ID not found");
    }
  });
});

////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                        TO INSERT INGREDIENTS
////////////////////////////////////////////////////////////////////////////////////////////////////////

app.post("/insertIngredient", (req, res) => {
  const checkDuplicateSql =
    "SELECT * FROM `customer ingredients` WHERE `meal_id` = ? AND `ingredient_name` = ?";
  const checkDuplicateValues = [req.body.meal_id, req.body.ingredient_name];

  // Check for duplicate ingredient
  db.query(checkDuplicateSql, checkDuplicateValues, (err, duplicateResult) => {
    if (err) {
      return res.json("Error");
    }

    if (duplicateResult.length > 0) {
      // If duplicate ingredient exists, return error response
      return res.status(409).json({ error: "Duplicate ingredient exists" });
    } else {
      // If no duplicate, insert the new ingredient
      const insertSql =
        "INSERT INTO `customer ingredients` (`meal_id`, `ingredient_name`,`quantity`,`unit`) VALUES (?, ?, ?, ?)";
      const insertValues = [
        req.body.meal_id,
        req.body.ingredient_name,
        req.body.quantity,
        req.body.unit,
      ];

      db.query(insertSql, insertValues, (err, result) => {
        if (err) {
          return res.json("Error");
        }
        const ingredId = result.insertId; // Get the id_no of the inserted user
        console.log("Ingredient inserted with id_no:", ingredId);
        res.json({ ...req.body, ingred_id: ingredId });
      });
    }
  });
});

app.post("/insertMeal", (req, res) => {
  const mealName = req.body.meal_name;
  const idNo = req.body.id_no;

  // Check if the meal already exists
  db.query(
    "SELECT * FROM `customer meal` WHERE `meal_name` = ? AND `id_no` = ?",
    [mealName, idNo],
    (err, results) => {
      if (err) {
        return res.json("Error");
      }

      // If the meal already exists, return an error
      if (results.length > 0) {
        return res.status(500).json("Meal Already Exists");
      }

      // If the meal doesn't exist, insert it into the database
      const sql =
        "INSERT INTO `customer meal` (`id_no`, `meal_name`) VALUES (?, ?)";
      const values = [idNo, mealName];

      db.query(sql, values, (err, result) => {
        if (err) {
          return res.json("Error");
        }
        const mealId = result.insertId; // Get the id_no of the inserted meal
        console.log("Meal inserted with id_no:", mealId);
        res.json({ ...req.body, meal_id: mealId });
      });
    }
  );
});

////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                        TO DELETE
////////////////////////////////////////////////////////////////////////////////////////////////////////

app.delete("/deletemeals", (req, res) => {
  const { id_no, meals } = req.body;
  console.log("inside delete meals");
  if (!id_no || !meals || !meals.length) {
    return res.status(440).json({ error: "NOE" });
  }

  const sql =
    "DELETE FROM `customer meal` WHERE `id_no` = ? AND `meal_name` IN (?)";
  db.query(sql, [id_no, meals], (err, result) => {
    if (err) {
      console.error("Error deleting meals:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json({ success: true, deleted: result.affectedRows });
  });
});

app.delete("/deleteIngredients", (req, res) => {
  const { meal_id } = req.body;
  console.log("inside delete ingredient");

  if (!meal_id) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const sql = "DELETE FROM `customer ingredients` WHERE `meal_id` = ? ";
  db.query(sql, [meal_id], (err, result) => {
    if (err) {
      console.error("Error deleting ingredient:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json({ success: true, deleted: result.affectedRows });
  });
});

app.delete("/deleteIngredient", (req, res) => {
  const { ingred_id } = req.body;
  console.log("inside delete ingredient");

  if (!ingred_id) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const sql = "DELETE FROM `customer ingredients` WHERE `ingred_id` = ? ";
  db.query(sql, [ingred_id], (err, result) => {
    if (err) {
      console.error("Error deleting ingredient:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json({ success: true, deleted: result.affectedRows });
  });
});

////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                        TO UPDATE
////////////////////////////////////////////////////////////////////////////////////////////////////////
app.post("/updateIngredient", (req, res) => {
  const { ingred_id, ingredient_name, quantity, unit } = req.body;

  console.log(
    "Updating ingredient:",
    ingred_id,
    ingredient_name,
    quantity,
    unit
  );

  const sql =
    "UPDATE `customer ingredients` SET `ingredient_name` = ?, `quantity` = ?, `unit` = ? WHERE `ingred_id` = ?";
  db.query(sql, [ingredient_name, quantity, unit, ingred_id], (err, result) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json("Error");
    }
    if (result.affectedRows > 0) {
      console.log("Ingredient updated successfully:", ingredient_name);
      res.json("Ingredient updated successfully");
    } else {
      console.log("No ingredient found with ID:", ingredient_id);
      res.status(404).json("Ingredient not found");
    }
  });
});

app.post("/updateMealName", (req, res) => {
  const { meal_id, meal_name, id_no } = req.body;

  console.log("Updating meal name:", meal_id, meal_name, id_no);

  // Check if the new meal name already exists
  const checkDuplicateSql =
    "SELECT * FROM `customer meal` WHERE `meal_name` = ? AND `meal_id` != ? AND `id_no` = ?";
  db.query(
    checkDuplicateSql,
    [meal_name, meal_id, id_no],
    (err, duplicateResult) => {
      if (err) {
        console.error("Database query error:", err);
        return res.status(500).json("Error");
      }

      // If a meal with the same name already exists, return an error
      if (duplicateResult.length > 0) {
        console.log("Meal name already exists:", meal_name);
        return res.status(400).json("Meal name already exists");
      }

      // Update the meal name if no duplicates found
      const updateSql =
        "UPDATE `customer meal` SET `meal_name` = ? WHERE `meal_id` = ? AND `id_no` = ?";
      db.query(updateSql, [meal_name, meal_id, id_no], (err, result) => {
        if (err) {
          console.error("Database query error:", err);
          return res.status(500).json("Error");
        }
        if (result.affectedRows > 0) {
          console.log("Meal name updated successfully:", meal_id);
          res.json("Meal name updated successfully");
        } else {
          console.log("No meal found with ID:", meal_id);
          res.status(404).json("Meal not found");
        }
      });
    }
  );
});

app.listen(8070, () => {
  console.log("Server is running on port 8070");
});
