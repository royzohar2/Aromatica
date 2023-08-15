// define the routs and the actions for a point object.

const express = require("express");
const router = express.Router();
const Point = require("../models/pointModel");
const authMiddleware = require("../middlewares/auth-middleware");

// Save a new point
router.post("/", authMiddleware.requireRole("admin"), (req, res) => {
  const { name, latitude, longitude } = req.body;

  const newPoint = new Point({
    name,
    latitude,
    longitude,
  });

  newPoint
    .save()
    //if save method successed
    .then(() => res.status(201).json({ message: "Point saved successfully" }))
    // else
    .catch((error) =>
      res
        .status(500)
        .json({ error: "An error occurred while saving the point" })
    );
});

// Get all points
router.get("/", authMiddleware.requireRole("admin"), (req, res) => {
  Point.find()
    .then((points) => res.json(points))
    .catch((error) =>
      res
        .status(500)
        .json({ error: "An error occurred while retrieving points" })
    );
});

router.delete("/", authMiddleware.requireRole("admin"), async (req, res) => {
  try {
    const { id } = req.body;
    // If the point was not found
    if (!id) {
      res.send("point was not found");
    }
    // Delete the point
    await Point.findByIdAndRemove({ _id: id });
    res.status(200).send("point deleted successfully");
  } catch (err) {
    res.status(400).send("Something went wrong -> deletePoint");
  }
});

module.exports = router;
