const express = require("express");
const router = express.Router();
const statisticsController = require("../controllers/statisticsController");
const authMiddleware = require("../middlewares/auth-middleware");

router.get(
  "/sales-by-date",
  authMiddleware.requireRole("admin"),
  statisticsController.getSalesByDate
);
router.get(
  "/product-info",
  authMiddleware.requireRole("admin"),
  statisticsController.getProductInfo
);

router.get(
  "/Product-Count",
  authMiddleware.requireRole("admin"),
  statisticsController.getOrdersCountByProductCount
);

module.exports = router;
