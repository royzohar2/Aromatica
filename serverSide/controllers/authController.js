const authService = require("../services/authService");
const mongoose = require("mongoose");

//registerUser

async function registerUser(req, res) {
  const { name, email, password } = req.body;

  // Name validation
  const nameRegex = /^[a-zA-Z0-9\s]+$/;
  if (!nameRegex.test(name)) {
    return res.status(400).json({ error: "Invalid name format" });
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format." });
  }

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    const newUser = await authService.registerUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function loginUser(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.send({ error: "Missing email and/or password" });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.json({ error: "Invalid email format." });
    }

    const token = await authService.loginUser(email, password);
    res.status(200).json({ token });
  } catch (error) {
    res.status(401).json({ message: "Authentication failed" });
  }
}

module.exports = {
  registerUser,
  loginUser,
};
