import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {User} from "../models/user.models.js";
import { uploadCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const registerUser = asyncHandler( async (req, res) => {
    // get user details from frontend
    // validation - not empty
    //check if user already exists: username and email
    // check for images ,  check for avatar
    //upload them to cloudinary, avatar
    //create user object - create entry in db 
    // remove password and refersh token field from response
    // check for user creation 
    //return res

    const {fullname, password, email, usernmae} = req.body
    console.log("email:",email);

    // if (fullname === "") {
    //     throw new ApiError(400, "Full name is required")
    // }

    //same you can follow for all the compuslory fi0eld 
    //that is check if the field is empty or not
    // but there is a better but a little complex code
    
    if (
        [fullname,email,usernmae,password].some((field) => field?.trim() === "")) 
        {
            throw new ApiError(400, "All the fields are compulsory")    
    }

    const existedUser = User.findOne({
        $or: [{ username },{ email }]
    
    })
    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists ")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImagelocalPath =req.files?.coverImage[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400,"Avatar file is required")

    }


    const avatar = await uploadCloudinary(avatarLocalPath)
    const coverImage = await uploadCloudinary(coverImagelocalPath)

    if (!avatar) {
        throw new ApiError(400,"Avatar file is required")      
    }

    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        password,
        username: username.lowercase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshTokens"
    )
    
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registring")
    }

    return res.status(200).json(
        new ApiResponse(200,createdUser,"User Regsitered sucessfully")
    )

} )

export {registerUser}