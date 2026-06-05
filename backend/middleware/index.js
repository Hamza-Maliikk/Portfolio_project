import jwt from "jsonwebtoken";
import { secret } from "../controllers/user.js";

const authChecker = async (req, res, next) => {
  try {
    // 1. Token nikalo header se
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // 2. Token verify karo
    const decoded = jwt.verify(token, secret, {
      algorithms: ["HS256"],
    });

    // 4. User info request mein attach karo
    req.user = decoded;
    next();

  } catch (error) {
    // Token expired ho ya invalid ho — dono cases handle
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Unauthorized: Token expired, please login again" });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }

    return res.status(500).json({ error: "Server error" });
  }
};

export { authChecker };