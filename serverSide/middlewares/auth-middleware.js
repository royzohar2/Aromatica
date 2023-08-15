// roleAuth.js
jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const JWT_SECRET = process.env.jwtSecret;

function requireRole(role) {
  return async function (req, res, next) {
    const authHeader = req.header("Authorization");
    const token = authHeader?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await User.findById({ _id: decoded.userId });
      if (!user?.roles?.includes(role)) {
        return res.status(403).json({ error: "Access denied" });
      }

      req.locals = { currentUserId: user._id };
      next(); // User has the required role, proceed to the next middleware
    } catch (err) {
      console.log(err);
      res.status(401).json({ error: "Token is not valid" });
    }
  };
}
module.exports = {
  requireRole,
};
