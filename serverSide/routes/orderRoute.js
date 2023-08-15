const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const authMiddleware = require("../middlewares/auth-middleware");

//permition user
router.get("/", authMiddleware.requireRole("user"), orderController.getOrders);
//permition admin
router.get(
  "/all",
  authMiddleware.requireRole("admin"),
  orderController.getAllOrders
);
//permition user
router.get(
  "/:id",
  authMiddleware.requireRole("user"),
  orderController.getOrderById
);
//permition user
router.post(
  "/",
  authMiddleware.requireRole("user"),
  orderController.createOrder
);
//permition admin
router.patch(
  "/",
  authMiddleware.requireRole("admin"),
  orderController.updateOrder
);
//permition admin
router.delete(
  "/",
  authMiddleware.requireRole("admin"),
  orderController.deleteOrder
);

module.exports = router;
