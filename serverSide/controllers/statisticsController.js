const Order = require("../models/orderModel");
const Perfume = require("../models/perfumeModel");

//getSalesByDate
const getSalesByDate = async (req, res) => {
  try {
    const salesByDate = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$orderDate" } },
          totalSales: { $sum: "$totalAmount" },
        },
      },
      { $sort: { _id: 1 } }, // Sort by date in ascending order
    ]);

    res.status(200).json(salesByDate);
  } catch (error) {
    res.status(500).json({ message: "Error fetching sales by date" });
  }
};

const getProductInfo = async (req, res) => {
  try {
    const productsInfo = await Perfume.find({}, "brand name price").sort(
      "brand"
    );
    res.status(200).json(productsInfo);
  } catch (error) {
    res.status(500).json({ message: "Error fetching product information" });
  }
};

const getOrdersCountByProductCount = async (req, res) => {
  try {
    const ordersCountByProductCount = await Order.aggregate([
      {
        $project: {
          productsCount: { $size: "$products" }, // Calculate the count of products in each order
        },
      },
      {
        $group: {
          _id: "$productsCount", // Group by the count of products
          ordersCount: { $sum: 1 }, // Calculate the count of orders for each product count
        },
      },
    ]);

    res.status(200).json(ordersCountByProductCount);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching orders count by product count" });
  }
};

module.exports = {
  getSalesByDate,
  getProductInfo,
  getOrdersCountByProductCount,
};
