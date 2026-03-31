const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "secretkey"
    );

    // ✅ FIX: ensure email exists in token
    if (!decoded.email) {
      return res.status(400).json({ message: "Token missing email" });
    }

    
    req.user = {
      email: decoded.email
    };

    next();

  } catch (err) {
    console.error("Auth error:", err);
    res.status(401).json({ message: "Unauthorized" });
  }
};