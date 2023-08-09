const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  //keep track of the perfumes that a user has added to their shopping cart.
  cart: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "perfume",
    },
  ],
  //maintain a history of the user's orders
  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "order",
    },
  ],
});

module.exports = mongoose.model("user", userSchema);
