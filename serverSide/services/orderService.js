const Order = require("../models/orderModel");
//getOrders
const getOrders = async (userId) => {
  try {
    const query = {};
    //console.log(userId);
    if (userId) {
      query.user = userId;
    }
    const orders = await Order.find(query);
    return orders;
  } catch (error) {
    throw new Error("Error fetching orders: " + error.message);
  }
};
//createOrder
const createOrder = async (order, userId) => {
  try {
    const newOrder = await Order.create({
      user: userId,
      products: order.products,
      totalAmount: order.totalAmount,
    });
    const order_db = await newOrder.save();
    if (order_db) {
      return order_db;
    }
  } catch (error) {
    throw new Error("Error saving order: " + error.message);
  }
};
//updateOrder
const updateOrder = async (id, order) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(id, order, {
      new: true,
    });

    if (updatedOrder) {
      return updatedOrder;
    }
  } catch (error) {
    throw new Error("Error update order: " + error.message);
  }
};
//getOrderById
const getOrderById = async (id) => {
  try {
    const order = await Order.findById({ _id: id });
    if (order) {
      return order;
    }
  } catch (error) {
    throw new Error("Error fetching order by ID: " + error.message);
  }
};

//deleteOrder
const deleteOrder = async (id) => {
  try {
    await Order.findByIdAndRemove({ _id: id });
  } catch (error) {
    throw new Error("Error delete order: " + error.message);
  }
};
module.exports = {
  getOrders,
  createOrder,
  getOrderById,
  updateOrder,
  deleteOrder,
};
