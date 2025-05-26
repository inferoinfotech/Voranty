const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ msg: "Access denied. No token provided." });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ msg: "No token provided, authorization denied." });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded || !decoded.id) {
      return res.status(401).json({ msg: "Invalid token." });
    }

    const user = await User.findById(decoded.id).select("-Password");
    if (!user) {
      return res.status(404).json({ msg: "User not found." });
    }

    req.user = user;

    next();
  } catch (err) {
    console.error("Error in auth middleware:", err.message);

    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ msg: "Token is invalid." });
    }

    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ msg: "Token has expired." });
    }

    res.status(500).json({ msg: "An error occurred during authentication." });
  }
};
