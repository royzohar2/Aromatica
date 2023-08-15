const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const authMiddleware = require("../middlewares/auth-middleware");

// Routes for managing users
router.use(authMiddleware.requireRole("admin"));
router.get("/", usersController.getAllUsers);
router.get("/:id", usersController.getUserById);
router.get("/email/:email", usersController.getUserByEmail);
router.patch("/update", usersController.updateUser);
router.delete("/delete", usersController.deleteUser);

module.exports = router;
