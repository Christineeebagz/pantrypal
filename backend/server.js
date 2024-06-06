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
  console.log("reached here");
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
      return res.json("Error");
    }
    const userId = result.insertId; // Get the id_no of the inserted user
    res.json({ ...req.body, id_no: userId });
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

// app.get("/getmeals", (req, res) => {
//   const { id_no } = req.query; // Use req.query for GET requests
//   const sql = "SELECT meal_id, meal_name FROM `customer meal` WHERE id_no = ?";
//   db.query(sql, [id_no], (err, result) => {
//     if (err) {
//       console.error("Database query error:", err);
//       return res.status(500).json("Error");
//     }
//     if (result.length > 0) {
//       console.log("Meals found for id_no:", id_no, result); // Log the result to check what is being returned
//       res.json(result);
//     } else {
//       console.log("No meals found for id_no:", id_no);
//       res.status(404).json("Meals not found");
//     }
//   });
// });
app.get("/getmeals", (req, res) => {
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

app.post("/getingredients", (req, res) => {
  const { meal_ID_list } = req.body;
  const sql = `SELECT ingred_id, ingredient_name, quantity, unit FROM \`customer ingredients\` WHERE meal_id IN (?)`;
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

app.listen(8070, () => {
  console.log("Server is running on port 8070");
});
