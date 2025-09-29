import {asyncHandler} from "../utils/asyncHandler.js"
import validator from "validator"
import { ApiError } from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {User} from "../models/user.model.js" 

const loginUser = asyncHandler(async (req, res) => { 
    
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