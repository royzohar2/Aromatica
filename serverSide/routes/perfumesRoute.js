//define the routs for the perfumes in my server.
const express = require("express");
const perfumesController = require("../controllers/perfumesController");
const router = express.Router(); //allows us to create different router in a separate file
const authMiddleware = require("../middlewares/auth-middleware");

// GET endpoint to return the list of perfumes
//permition user+admin
router.get(
  "/",
  authMiddleware.requireRole("user"),
  perfumesController.getPerfumes
);
// GET endpoint to get details of a specific perfume
//permision user+admin
router.get(
  "/:id",
  authMiddleware.requireRole("user"),
  perfumesController.getPerfumeById
);

//create new prfume
//permition admin
router.post(
  "/",
  authMiddleware.requireRole("admin"),
  perfumesController.validatePerfume,
  perfumesController.createPerfume
);
//update perfume
//permition admin
router.patch(
  "/",
  authMiddleware.requireRole("admin"),
  perfumesController.validatePerfumeUpdate,
  perfumesController.updatePerfume
);
//delete perfume
//permition admin
router.delete(
  "/",
  authMiddleware.requireRole("admin"),
  perfumesController.validatePerfumeUpdate,
  perfumesController.deletePerfume
);

//so we can use it in the app.js
module.exports = router;
