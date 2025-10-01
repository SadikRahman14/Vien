import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, _res, next) => {
  // Prefer Authorization header, fall back to cookie
  const auth = req.header("Authorization") || "";
  const headerToken = auth.startsWith("Bearer ") ? auth.slice(7).trim() : null;
  const cookieToken = req.cookies?.accessToken || null;
  const token = headerToken || cookieToken;

  if (!token) {
    throw new ApiError(401, "Unauthorized request: no token provided");
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (_e) {
    throw new ApiError(401, "Invalid or expired token");
  }

  const user = await User.findById(decoded?._id).select("-password -refreshToken");
  if (!user) {
    throw new ApiError(401, "Invalid access token: user not found");
  }

  req.user = user;
  next();
});

export const verifyAdmin = asyncHandler(async (req, _, next) => {
  try {
    const raw = req.header("Authorization") || "";
    const token = raw.startsWith("Bearer ") ? raw.slice(7) : null;

    if (!token) {
      throw new ApiError(401, "Unauthorized request (no admin token)");
    }

    const decoded = jwt.verify(token, process.env.ADMIN_TOKEN_SECRET);

    // Expect the shape issued by adminLogin: { role: "admin", email: ... }
    if (!decoded || decoded.role !== "admin" || decoded.email !== process.env.ADMIN_EMAIL) {
      throw new ApiError(401, "Invalid admin token");
    }

    req.admin = { name: "Admin", email: decoded.email, role: "admin" };
    next();
  } catch (err) {
    throw new ApiError(401, err?.message || "Invalid admin token");
  }
});