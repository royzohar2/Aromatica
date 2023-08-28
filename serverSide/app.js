// Install packages
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const cors = require("cors");
const PORT = 3000;

// define the communication between the host and server
const http = require("http");
const socketIo = require("socket.io");
const server = http.createServer(app);
const io = socketIo(server);
// const { handleClient } = require("./utills/socket");
// handleClient(io);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// load routers
app.use("/perfumes", require("./routes/perfumesRoute"));
app.use("/account", require("./routes/usersRoutes"));
app.use("/auth", require("./routes/authRoute"));
app.use("/order", require("./routes/orderRoute"));
app.use("/statistic", require("./routes/statisticsRoute"));
app.use("/point", require("./routes/pointsRoute"));
app.use("/currency", require("./routes/currencyRoute"));

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // Listen for the "orderCreated" event
  socket.on("orderCreated", (order) => {
    console.log("Order created:", order);

    // Emit the "orderConfirmation" event to the client
    socket.emit("orderConfirmation", "Your order has been confirmed!");
  });
});


// Connect to the MongoDB database
mongoose.connect(
  "mongodb+srv://adimor87:205851587@cluster0.povfaxl.mongodb.net/",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
// when we connect to mongo at the first time, we will print this note.
mongoose.connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

server.listen(3005,()=>{
  console.log(`ServerSocket is running on port 3005`);
});
