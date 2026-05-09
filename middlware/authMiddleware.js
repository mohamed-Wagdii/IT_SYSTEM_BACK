const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeaders = req.headers.authorization;

    if (!authHeaders) return res.status(401).json({ msg: "Token Not Found" });

    const token = authHeaders.split(" ")[1];

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decodedToken.user;

    next();
  } catch (error) {
    return res.status(401).json({ msg: "Invalid or expired token. Please login again." });
  }
};

const adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ msg: "please, login" });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ msg: "only for Admin" });
  }
  next();
};

module.exports = {authMiddleware, adminOnly};


