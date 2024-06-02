const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
app.use(express.json());

const corsOptions = {
  origin: "http://localhost:5173", // Replace with your React app's origin
  credentials: true, // Change to 'true' if needed for cookies
  optionSuccessStatus: 200, // some legacy browsers require this
};

app.use(cors(corsOptions));

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "pantrypal",
  port: 3306,
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
  const sql = "SELECT * FROM `user information` WHERE `email` = ? AND `password` = ?";

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

app.listen(8070, () => {
  console.log("Server is running on port 8070");
});
