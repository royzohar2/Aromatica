const Perfume = require("../models/perfumeModel");

// Get a list of all perfumes
async function getAllPerfumes() {
  try {
    const perfumes = await Perfume.find({});
    return perfumes;
  } catch (error) {
    throw new Error("Error fetching perfumes: " + error.message);
  }
}

const getPerfumeById = async (id) => {
  try {
    const perfume = await Perfume.findById({ _id: id });
    if (perfume) {
      return perfume;
    }
  } catch (error) {
    throw new Error("Error fetching perfume by ID: " + error.message);
  }
};

//createPerfume
const createPerfume = async (perfume) => {
  try {
    const newPerfume = await Perfume.create({
      name: perfume.name,
      brand: perfume.brand,
      image: perfume.image,
      price: perfume.price,
      numberOfPurchase: perfume.numberOfPurchase,
      id: perfume.id,
      category: game.category,
    });
    const perfume_db = await newPerfume.save();
    if (perfume_db) {
      return perfume_db;
    }
  } catch (error) {
    throw new Error("Error saving perfume: " + error.message);
  }
};

//updatePerfume
const updatePerfume = async (id, perfume) => {
  try {
    const updatedPerfume = await Perfume.findByIdAndUpdate(id, perfume);
    if (updatedPerfume) {
      return updatedPerfume;
    }
  } catch (error) {
    throw new Error("Error update perfume: " + error.message);
  }
};
//deletePerfume
const deletePerfume = async (id) => {
  try {
    await Perfume.findByIdAndDelete(id);
  } catch (error) {
    throw new Error("Error delete perfume: " + error.message);
  }
};

module.exports = {
  getAllPerfumes,
  getPerfumeById,
  createPerfume,
  updatePerfume,
  deletePerfume,
};
