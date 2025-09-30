import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Beaver ", "")

        if (!token || typeof token !== "string") {
            throw new ApiError(401, "Unauthorized Request");
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        
        const user = await User.findById(decodedToken?._id)
            .select("-password -refreshToken")
        
        if (!user) {
            throw new ApiError(401, "Invalid Access Token!");
        }

        req.user = user;
        next();
        
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Access Token")
    }
}) 


export const verifyAdmin = asyncHandler(async (req, _, next) => { 
    try {
        const token =
            req.cookies?.accessToken ||
            req.header("Authorization")?.replace("Bearer ", "");
        
        if(!token || typeof token !== "string"){
            throw new ApiError(401, "Unauthorized Request");
        }

        const decodedToken = jwt.verify(token, process.env.ADMIN_TOKEN_SECRET);
        
        const expected = process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD;
        
        if(decodedToken !== expected){
            throw new ApiError(401, "Invalid Admin Token");
        }

        req.admin = {
            name: "Admin",
            email: process.env.ADMIN_EMAIL,
            role: "admin"
        }
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Admin Token")
    }
})