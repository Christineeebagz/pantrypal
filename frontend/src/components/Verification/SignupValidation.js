import axios from "axios";

async function checkUnique(field, value) {
  try {
    const response = await axios.post(
      "http://localhost:8070/api/check-unique",
      { field, value }
    );
    return response.data.exists; // Assuming the API returns an object { exists: boolean }
  } catch (error) {
    console.error("Error checking uniqueness:", error);
    return false; // Default to false on error
  }
}

async function Validation(values) {
  let error = {};
  const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const password_pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/;

  if (values.username === "") {
    error.username = "Name should not be empty";
  } else {
    const usernameTaken = await checkUnique("username", values.username);
    if (usernameTaken) {
      error.username = "Username is already taken";
    } else {
      error.username = "";
    }
  }

  if (values.firstName === "") {
    error.firstName = "Name should not be empty";
  } else {
    error.firstName = "";
  }

  if (values.lastName === "") {
    error.lastName = "Name should not be empty";
  } else {
    error.lastName = "";
  }

  if (values.email === "") {
    error.email = "Email should not be empty";
  } else if (!email_pattern.test(values.email)) {
    error.email = "Email format is invalid";
  } else {
    const emailTaken = await checkUnique("email", values.email);
    if (emailTaken) {
      error.email = "Email is already taken";
    } else {
      error.email = "";
    }
  }

  if (values.password === "") {
    error.password = "Password should not be empty";
  } else if (!password_pattern.test(values.password)) {
    error.password = "Password format is invalid";
  } else {
    error.password = "";
  }

  return error;
}

export default Validation;
