const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);

//logout
//JWT tokens are issued upon successful login and are typically stored on the client side (e.g., in cookies or local storage). When a user wants to "log out," you would generally clear the token from the client side to invalidate their authentication.
//simply send a response to confirm the logout

module.exports = router;
