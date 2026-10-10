import jwt from "jsonwebtoken";
import config from "../config/index.js";
import { Student, Faculty, Admin } from "../models/User.js";

const models = { student: Student, faculty: Faculty, admin: Admin };

export async function protect(req, res, next) {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const decoded = jwt.verify(token, config.jwtSecret);
    const Model = models[decoded.role];
    if (!Model) {
      return res.status(401).json({ message: "Invalid token role" });
    }

    const user = await Model.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    req.user.role = decoded.role;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
}

export function authorize(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: `Role '${req.user.role}' is not authorized` });
    }
    next();
  };
}
