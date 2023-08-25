const Perfume = require("../models/perfumeModel");

// Get a list of all perfumes
async function getPerfumes(filters) {
  try {
    const query = {};
    if (filters.search) {
      query.name = { $regex: filters.search, $options: "i" };
      query.brand = { $regex: filters.search, $options: "i" };
      //query.discripyion = { "$regex": filters.search, "$options": "i" }
    }
    if (filters.category) {
      query.category = filters.category;
    }
    if (filters.brand) {
      query.brand = filters.brand;
    }
    if (filters.maxCost) {
      query.price = { $lte: parseInt(filters.maxCost) };
    }
    const perfumes = await Perfume.find(query);
    return perfumes;
  } catch (error) {
    throw new Error("Error fetching filtered perfumes: " + error.message);
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
      category: perfume.category,
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
    const updatedPerfume = await Perfume.findByIdAndUpdate(id, perfume, {
      new: true,
    });
    //console.log(updatedPerfume);
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
    await Perfume.findByIdAndRemove({ _id: id });
  } catch (error) {
    throw new Error("Error delete perfume: " + error.message);
  }
};

module.exports = {
  getPerfumes,
  getPerfumeById,
  createPerfume,
  updatePerfume,
  deletePerfume,
};
