import jwt from "jsonwebtoken";
import { catchErrors } from "../utils/index.js";

const authMiddleware = catchErrors(async (req, _, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    throw new Error("No token provided, authorization denied");
  }

  const token = header.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    throw new Error("Invalid token, authorization denied");
  }
});

export default authMiddleware;
