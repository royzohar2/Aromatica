// Import required dependencies and models
jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// Get JWT_SECRET from environment variables
const JWT_SECRET = process.env.jwtSecret;

// Middleware function to check if the user has the required role
function requireRole(role) {
  return async function (req, res, next) {
    // Get the JWT token from the Authorization header
    const authHeader = req.header("Authorization");
    const token = authHeader?.split(" ")[1];
    // If no token is provided, return Unauthorized
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      // Verify the token using the JWT_SECRET
      const decoded = jwt.verify(token, JWT_SECRET);
      // Find the user by userId from the decoded token
      const user = await User.findById({ _id: decoded.userId });
      // Check if the user has the required role
      if (!user?.roles?.includes(role)) {
        return res.status(403).json({ error: "Access denied" });
      }
      // Attach userId to req.locals for future use
      req.locals = { currentUserId: user._id };
      // User has the required role, proceed to the next middleware
      next();
    } catch (err) {
      //console.log(err);
      // Token verification failed, return Token is not valid
      res.status(401).json({ error: "Token is not valid" });
    }
  };
}
module.exports = {
  requireRole,
};
