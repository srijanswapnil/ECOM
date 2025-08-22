import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";

// Protected Routes middleware
export const requireSignIn = async (req, res, next) => {
  try {
    const decode = JWT.verify(req.headers.authorization, process.env.JWT_SECRET);
    req.user=decode
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).send({ success: false, message: "Invalid or expired token" });
  }
};



export const isAdmin = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);
    if (!user) {
      return res.status(404).send({ success: false, message: "User not found" });
    }
    if (user.role !== 1) {
      return res.status(403).send({ success: false, message: "Unauthorized Access" });
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Error in admin middleware", error });
  }
};
