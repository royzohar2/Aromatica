const perfumesService = require("../services/perfumesService");
const mongoose = require("mongoose");

//get all the perfumes
const getAllPerfumes = async (req, res) => {
  try {
    const perfumes = await perfumesService.getAllPerfumes();
    res.status(200).json(perfumes);
  } catch (err) {
    res.status(400).send("Something went wrong -> getAllPerfumes");
  }
};
//get perfume by ID
const getPerfumeById = async (req, res) => {
  try {
    const { id } = req.params;
    const perfume = await perfumesService.getPerfumeById(id);
    res.status(200).json(perfume);
  } catch (err) {
    res.status(400).send("Something went wrong -> getPerfumeById");
  }
};

/**
 * Middleware to validate Perfume creation.
 * Checks if all required fields are provided and if the requesting user is an admin.
 */
async function validatePerfume(req, res, next) {
  const { name, brand, image, price, numberOfPurchase, id, category } =
    req.body;

  // Check if all required fields are provided
  if (
    !name ||
    !brand ||
    !image ||
    !price ||
    !numberOfPurchase ||
    !id ||
    !category
  ) {
    return res.status(400).json("Missing required fields");
  }
  next();
}

/**
 * Creates a new perfume.
 * Adds the new perfume and  sends a response with the new perfume ID.
 */
const createPerfume = async (req, res, next) => {
  try {
    const perfume = req.body;
    const perfumeId = await perfumesService.createPerfume(perfume);

    // If the new game was not created successfully
    if (!perfumeId) {
      res.status(400).send("Something went wrong");
    } else {
      res.status(200).send(perfumeId);
    }
  } catch (err) {
    res
      .status(402)
      .send("All fields are required / Invalid input. -> createPerfume");
  }
};

//validatePerfumeUpdate
async function validatePerfumeUpdate(req, res, next) {
  const { id } = req.body;

  if (id) {
    res.status(400);
  } else {
    next();
  }
}

/**
 * Updates a perfume.
 * Sends a response with the updated perfume.
 */
const updatePerfume = async (req, res) => {
  try {
    const { id, perfume } = req.body;
    const updatedPerfume = await perfumesService.updatePerfume(id, perfume);

    // If the game was not updated successfully
    if (!updatedPerfume) {
      res.status(400).send("Something went wrong -> updatePerfume");
    } else {
      res.status(200).send(updatedPerfume);
    }
  } catch (err) {
    res.status(400).send("Something went wrong -> updatePerfume");
  }
};

//deletePerfume
const deletePerfume = async (req, res) => {
  try {
    const { id } = req.body;
    const perfume = await perfumesService.getPerfumeById(id);

    // If the perfume was not found
    if (!perfume) {
      res.send("Something went wrong");
    } else {
      // Delete the game
      await perfumesService.deletePerfume(id);
      res.status(200).send("Game deleted successfully");
    }
  } catch (err) {
    res.status(400).send("Something went wrong -> deletePerfume");
  }
};
module.exports = {
  getAllPerfumes,
  getPerfumeById,
  validatePerfume,
  createPerfume,
  validatePerfumeUpdate,
  updatePerfume,
  deletePerfume,
};
