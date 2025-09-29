import {asyncHandler} from "../utils/asyncHandler.js"
import validator from "validator"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { User } from "../models/user.model.js" 


const options = {
    httpOnly: true,
    secure: true
}


const generateAccessTokenAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);

        if (!user) {
            throw new Error("User Not Found")
        }

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        return {accessToken, refreshToken}

    } catch (error) {
        console.error("Generate Access and Refresh Token Error:", error);
        throw new ApiError(500, "Something Went Wrong")
    }
}

const refreshAccessToken = asyncHandler(async (req, res) => { 
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized Request")
    }

    try {
        const decodedToken = jwt.verify(refreshAccessToken, process.env.REFRESH_TOKEN_SECRET);
        
        const user = await User.findById(decodedToken?._id);

        if (!user) {
            throw new ApiError(401, "Invalid Refresh Token")
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh Token is expired or used");
        }


        const { accessToken, newRefreshToken } = await generateAccessTokenAndRefreshToken(user._id);

        return res
            .status(200)
            .cookie("accessToken", accessToken)
            .cookie("refreshToken", newRefreshToken)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken: newRefreshToken },
                    "Access Token Refreshed"
                )
            )

    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Refresh Token")
    }
})


const loginUser = asyncHandler(async (req, res) => { 
    const { email, password } = req.body;

    if (!email) {
        throw new ApiError(400, "Email is Required");
    }

    const user = await User.findOne({
        $or: [{email}]
    })

    if (!user) {
        throw new ApiError(401, "Invalid User Credentials");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid User Credentials")
    }

    const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id)
        .select("-password -refreshToken")
    
    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser, accessToken, refreshToken
                },
                "User logged in Successfully"
            )
        )
})

const registerUser = asyncHandler(async (req, res) => { 
    const { name, email, password } = req.body;

    if (
        [email, name, password].some((fields) => fields.trim() === "")
    ) {
        throw new ApiError(400, "All Fields are required")
    }

    if (!validator.isEmail(email)) {
        throw new ApiError(400, "Please Enter a Valid E-mail");
    }

    const isUserExists = await User.findOne({
        $or: [{email}]
    })

    if (isUserExists) {
        throw new ApiError(409, "User with same e-mail already exists")
    }

    const user = await User.create({
        name,
        email,
        password
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken" 
    )

    if(!createdUser){
        throw new ApiError(500, "Something Went Wrong while registering user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User Registered Successfully")
    )


})

const adminLogin = asyncHandler(async (req, res) => { 

})




export { 
    loginUser,
    registerUser,
    adminLogin
}