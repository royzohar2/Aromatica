const bcrypt = require("bcrypt"); // for password hashing
const jwt = require("jsonwebtoken"); //for generating JWT tokens
const User = require("../models/userModel");

const JWT_SECRET = process.env.jwtSecret;

// Function to register a new user
async function registerUser(userData) {
  const checkUser = await User.findOne({ email: userData.email });
  //console.log(checkUser);
  if (checkUser) {
    throw new Error("Email already exists");
  }
  try {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUser = new User({
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      roles: ["user"],
      // ... other user data
    });
    const savedUser = await newUser.save();
    return savedUser;
  } catch (error) {
    throw new Error("Error registering user: " + error.message);
  }
}

// Function to log in a user and generate a JWT token
async function loginUser(email, password) {
  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error("Invalid email or password");
  }
  const payload = {
    userId: user._id,
  };
  //The JWT token generated during login includes the user's userId and expires after 1 hour.
  console.log(process.env.jwtSecret);
  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: "24h",
  });

  return token;
}

module.exports = {
  registerUser,
  loginUser,
};
