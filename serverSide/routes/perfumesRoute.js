//define the routs for the perfumes in my server.
const express = require("express");
const perfumesController = require("../controllers/perfumesController");
const router = express.Router();

// GET endpoint to return the list of perfumes
router.get("/", perfumesController.getAllPerfumes);
// GET endpoint to get details of a specific perfume
router.get("/:id", perfumesController.getPerfumeById);
//middleware: if the first function will run without errors, it will continue to the second one.
//create new prfume
router.post(
  "/",
  perfumesController.validatePerfume,
  perfumesController.createPerfume
);
//update perfume
router.patch(
  "/",
  perfumesController.validatePerfumeUpdate,
  perfumesController.updatePerfume
);
//delete perfume
router.delete(
  "/",
  perfumesController.validatePerfumeUpdate,
  perfumesController.deletePerfume
);

module.exports = router;
