const User = require("../models/userModel");
//getAllUsers
const getAllUsers = async () => {
  try {
    const users = await User.find({});
    return users;
  } catch (error) {
    throw new Error("Error fetching users: " + error.message);
  }
};

//getUserById
const getUserById = async (id) => {
  try {
    const user = await User.findById({ _id: id });
    return user;
  } catch (error) {
    throw new Error("Error fetching user by id: " + error.message);
  }
};

//getUserByEmail
const getUserByEmail = async (email) => {
  try {
    const user = await User.findOne({ email });
    return user;
  } catch (error) {
    throw new Error("Error fetching user by email: " + error.message);
  }
};

//updateUser
const updateUser = async (id, user) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(id, user, {
      new: true,
    });
    if (updatedUser) {
      return updatedUser;
    }
  } catch (error) {
    throw new Error("Error update user: " + error.message);
  }
};

//deleteUser
const deleteUser = async (id) => {
  try {
    await User.findByIdAndRemove({ _id: id });
  } catch (error) {
    throw new Error("Error delete user: " + error.message);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  getUserByEmail,
  updateUser,
  deleteUser,
};
