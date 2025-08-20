import jwt from "jsonwebtoken";
import { catchErrors } from "../utils/index.js";

const authMiddleware = catchErrors(async (req, _, next) => {
  console.log("authMiddleware called");
  const header = req.headers.authorization;
  console.log("Authorization header:", header);

  if (!header || !header.startsWith("Bearer ")) {
    console.log("No token provided");
    throw new Error("No token provided, authorization denied");
  }

  const token = header.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log("Token decoded:", decoded);
    next();
  } catch (err) {
    console.log("JWT error:", err.message);
    throw new Error("Invalid token, authorization denied");
  }
});

export default authMiddleware;
