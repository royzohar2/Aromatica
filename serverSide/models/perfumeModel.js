const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create the schema for a perfume
const perfumeSchema = new Schema({
  name: {
    type: String,
  },
  brand: {
    type: String,
  },
  image: {
    type: String,
  },
  price: {
    type: Number,
  },
  numberOfPurchase: {
    type: Number,
  },
  id: {
    type: Number,
  },
  category: {
    type: String, // Assuming a simple string for the category name
  },
});

// Export the perfume model
module.exports = mongoose.model("perfume", perfumeSchema, "perfumes");
