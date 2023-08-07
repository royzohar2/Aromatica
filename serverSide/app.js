const express = require("express");
const app = express();
const PORT = 3000;

// Install packages
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

//const perfumeRoutes = require("./routes/perfumesRoute");

// Middleware
app.use(bodyParser.json());

// Routes
app.use("/perfumes", require("./routes/perfumesRoute"));

// Connect to the MongoDB database
mongoose
  .connect("mongodb://localhost:27017/perfume-store", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
  });

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
