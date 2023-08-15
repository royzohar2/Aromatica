const orderService = require("../services/orderService");
const usersService = require("../services/usersService");
//getOrders
const getOrders = async (req, res) => {
  try {
    const userId = req.locals.currentUserId;
    if (!userId) {
      res.status(404).send({ message: "userId is require" });
    }
    const orders = await orderService.getOrders(userId);
    res.status(200).send(orders);
  } catch (error) {
    res.status(500).send({ message: "Error fetching orders" });
  }
};
const getAllOrders = async (req, res) => {
  try {
    const orders = await orderService.getOrders();
    res.status(200).send(orders);
  } catch (error) {
    res.status(500).send({ message: "Error fetching orders" });
  }
};
//createOrder
const createOrder = async (req, res, next) => {
  try {
    const order = req.body;
    const userId = req.locals.currentUserId;
    console.log(order);
    const newOrder = await orderService.createOrder(order, userId);
    const user = await usersService.getUserById(userId);
    user.orders.push(newOrder._id);
    await usersService.updateUser(user._id, user);
    // If the new order was not created successfully
    if (!newOrder) {
      res.status(400).send("Something went wrong");
    } else {
      res.status(200).send(newOrder);
    }
  } catch (err) {
    res
      .status(402)
      .send("All fields are required / Invalid input. -> createOrder");
  }
};

//getOrderById
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await orderService.getOrderById(id);
    res.status(200).json(order);
  } catch (err) {
    res.status(400).send("Something went wrong -> getOrderById");
  }
};

//updateOrder
const updateOrder = async (req, res) => {
  try {
    const { id, order } = req.body;
    const updateOrder = await orderService.updateOrder(id, order);
    if (!updateOrder) {
      res.status(400).send("Something went wrong -> updateOrder1");
    } else {
      res.status(200).send(updateOrder);
    }
  } catch (err) {
    res.status(400).send("Something went wrong -> updateOrder");
  }
};

//deleteOrder
const deleteOrder = async (req, res) => {
  try {
    const { id } = req.body;
    // If the order was not found
    if (!id) {
      res.send("no order id");
    }
    // Delete the order
    await orderService.deleteOrder(id);
    res.status(200).send("order deleted successfully");
  } catch (err) {
    res.status(400).send("Something went wrong -> deleteOrder");
  }
};
module.exports = {
  getOrders,
  getAllOrders,
  createOrder,
  getOrderById,
  updateOrder,
  deleteOrder,
};
