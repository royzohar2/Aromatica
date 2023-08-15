const perfumesService = require("../services/perfumesService");
//const mongoose = require("mongoose");

//get all the perfumes
const getPerfumes = async (req, res) => {
  try {
    const filters = req.query;
    const perfumes = await perfumesService.getPerfumes(filters);
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
    const perfumeDB = await perfumesService.createPerfume(perfume);

    // If the new game was not created successfully
    if (!perfumeDB) {
      res.status(400).send("Something went wrong");
    } else {
      res.status(200).send(perfumeDB);
    }
  } catch (err) {
    res
      .status(402)
      .send("All fields are required / Invalid input. -> createPerfume");
  }
};

//validatePerfumeUpdate
async function validatePerfumeUpdate(req, res, next) {
  // Check if the 'userId' is provided
  // Check if the user exists
  // Check if the user is an admin

  //const id = req.body;
  //console.log(id);

  //if (!id) {
  //  res.status(400);
  // } else {
  next();
  // }
}

/**
 * Updates a perfume.
 * Sends a response with the updated perfume.
 */
const updatePerfume = async (req, res) => {
  try {
    const { id, perfume } = req.body;
    const updatedPerfume = await perfumesService.updatePerfume(id, perfume);
    if (!updatedPerfume) {
      res.status(400).send("Something went wrong -> updatePerfume1");
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
    // const perfume = await perfumesService.getPerfumeById(id);
    // If the perfume was not found
    if (!id) {
      res.send("Something went wrong");
    }
    // Delete the perfume
    await perfumesService.deletePerfume(id);
    res.status(200).send("Perfume deleted successfully");
  } catch (err) {
    res.status(400).send("Something went wrong -> deletePerfume");
  }
};
module.exports = {
  getPerfumes,
  getPerfumeById,
  validatePerfume,
  createPerfume,
  validatePerfumeUpdate,
  updatePerfume,
  deletePerfume,
};
