const usersService = require("../services/usersService");

//all users
const getAllUsers = async (req, res) => {
  try {
    const users = await usersService.getAllUsers();
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send({ message: "Error fetching users" });
  }
};

//getUserById
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await usersService.getUserById(id);
    res.status(200).json(user);
  } catch (err) {
    res.status(400).send("Something went wrong -> getUserById");
  }
};

//getUserByEmail
const getUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await usersService.getUserByEmail(email);
    res.status(200).json(user);
  } catch (err) {
    res.status(400).send("Something went wrong -> getUserByEmail");
  }
};

//updateUser
const updateUser = async (req, res) => {
  try {
    const { id, user } = req.body;
    const updatedUser = await usersService.updateUser(id, user);
    if (!updatedUser) {
      res.status(400).send("Something went wrong -> updateUser");
    } else {
      res.status(200).send(updatedUser);
    }
  } catch (err) {
    res.status(400).send("Something went wrong -> updateUser");
  }
};

//deleteUser
const deleteUser = async (req, res) => {
  try {
    const { id } = req.body;
    // If the perfume was not found
    if (!id) {
      res.send("the user was not found");
    }
    // Delete the user
    await usersService.deleteUser(id);
    res.status(200).send("user deleted successfully");
  } catch (err) {
    res.status(400).send("Something went wrong -> deleteUser");
  }
};
module.exports = {
  getAllUsers,
  getUserById,
  getUserByEmail,
  updateUser,
  deleteUser,
};
