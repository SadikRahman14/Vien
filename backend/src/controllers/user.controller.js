// controllers/auth.controller.js (or your current file)
import { asyncHandler } from "../utils/asyncHandler.js";
import validator from "validator";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

const isProd = process.env.NODE_ENV === "production";
const cookieOptions = {
    httpOnly: true,
    secure: isProd,                        // false on localhost (HTTP), true in prod (HTTPS)
    sameSite: isProd ? "none" : "lax",     // "none" requires secure:true (HTTPS)
    path: "/",
};

const generateAccessTokenAndRefreshToken = async (userId) => {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // persist the latest refresh token (for rotation & invalidation)
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
};

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
    if (!incomingRefreshToken) throw new ApiError(401, "Unauthorized request");

    try {
        const decoded = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decoded?._id);
        if (!user) throw new ApiError(401, "Invalid refresh token");

        // ensure the token the client sent is the one we last issued
        if (incomingRefreshToken !== user.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or already used");
        }

        // rotate tokens
        const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id);

        return res
            .status(200)
            .cookie("accessToken", accessToken, cookieOptions)
            .cookie("refreshToken", refreshToken, cookieOptions)
            .json(new ApiResponse(200, { accessToken }, "Access token refreshed"));
    } catch (err) {
        throw new ApiError(401, err?.message || "Invalid refresh token");
    }
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body || {};
    if (!email || !password) throw new ApiError(400, "Email and password are required");

    const user = await User.findOne({ email });
    if (!user) throw new ApiError(401, "Invalid user credentials");

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) throw new ApiError(401, "Invalid user credentials");

    const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id);

    const safeUser = await User.findById(user._id).select("-password -refreshToken");

    return res
        .status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        // If your frontend stores accessToken in memory, you may return it too:
        .json(new ApiResponse(200, { user: safeUser, accessToken }, "User logged in successfully"));
});

const adminLogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body || {};
    if (!email || !password) throw new ApiError(400, "Email and password are required");

    if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
        throw new ApiError(401, "Invalid admin credentials");
    }

    // Use an object payload + expiry
    const token = jwt.sign(
        { role: "admin", email: process.env.ADMIN_EMAIL },
        process.env.ADMIN_TOKEN_SECRET,
        { expiresIn: "1d" }
    );

    const adminUser = { name: "Admin", email: process.env.ADMIN_EMAIL };

    return res
        .status(200)
        .json(new ApiResponse(200, { user: adminUser, token }, "Admin logged in successfully"));
});

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body || {};

    // robust empty check that won't throw on undefined
    if (![name, email, password].every(v => typeof v === "string" && v.trim() !== "")) {
        throw new ApiError(400, "All fields are required");
    }

    if (!validator.isEmail(email)) throw new ApiError(400, "Please enter a valid e-mail");

    const exists = await User.findOne({ email });
    if (exists) throw new ApiError(409, "User with same e-mail already exists");

    const user = await User.create({ name, email, password });
    const createdUser = await User.findById(user._id).select("-password -refreshToken");
    if (!createdUser) throw new ApiError(500, "Something went wrong while registering user");

    return res
        .status(201)
        .json(new ApiResponse(201, createdUser, "User registered successfully"));
});


const logoutUser = asyncHandler(async (req, res) => {
  const rt = req.cookies?.refreshToken || req.body?.refreshToken;

  if (rt) {
    try {
      const decoded = jwt.verify(rt, process.env.REFRESH_TOKEN_SECRET);
      // remove stored refresh token so it can't be reused
      await User.findByIdAndUpdate(
        decoded?._id,
        { $unset: { refreshToken: 1 } },   // ✅ UNSET the field
        { new: false }
      );
    } catch {
      // ignore invalid/expired token; still clear cookies
    }
  }

  return res
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .status(200)
    .json(new ApiResponse(200, null, "User logged out successfully"));
});


const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password -refreshToken");
  return res.status(200).json(new ApiResponse(200, { user }, "OK"));
});

export {
    loginUser,
    registerUser,
    adminLogin,
    refreshAccessToken,
    logoutUser,
    getCurrentUser,
};
