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
  // Find a user with the provided email
  const user = await User.findOne({ email });
  // If user doesn't exist or password doesn't match, throw an error
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error("Invalid email or password");
  }
  // Prepare payload for creating a JWT token
  const payload = {
    userId: user._id,
  };
  // Create a JWT token with the payload and a secret key
  // The token will expire after 24 hours (1 day)
  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: "24h",
  });

  return token;
}

module.exports = {
  registerUser,
  loginUser,
};
