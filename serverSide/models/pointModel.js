const mongoose = require("mongoose");

// This schema represent the location of a store on a map
const pointSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
});

const Point = mongoose.model("Point", pointSchema);

module.exports = Point;
