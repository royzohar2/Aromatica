// Install packages
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const cors = require("cors");
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// load routers
app.use("/perfumes", require("./routes/perfumesRoute"));
app.use("/account", require("./routes/usersRoutes"));

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
