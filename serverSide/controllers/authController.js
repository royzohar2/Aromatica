const authService = require("../services/authService");
const mongoose = require("mongoose");

//registerUser
async function registerUser(req, res) {
  const { name, email, password } = req.body;
  //console.log(req.body);

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
