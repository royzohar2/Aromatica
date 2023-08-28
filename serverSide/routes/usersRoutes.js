const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const authMiddleware = require("../middlewares/auth-middleware");

// Routes for managing users
router.get("/", authMiddleware.requireRole("admin") , usersController.getAllUsers);
//router.get("/:id", usersController.getUserById);
router.get("/email/:email",authMiddleware.requireRole("admin"), usersController.getUserByEmail);
router.patch("/update",authMiddleware.requireRole("admin"), usersController.updateUser);
router.delete("/delete", authMiddleware.requireRole("admin"),usersController.deleteUser);

router.get(
  "/:id",
  authMiddleware.requireRole("user"),
  usersController.getUserById
);

module.exports = router;
