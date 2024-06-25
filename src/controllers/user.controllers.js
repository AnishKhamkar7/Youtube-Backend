import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {User} from "../models/user.models.js";
import { uploadCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { upload } from "../middlewares/multer.middleware.js";

// create a sigle method to geenrate the access and refreh tokens

const generateAccessAndRefreshToken = async(userId) =>{
    try {
        const user = await User.findOne(userId)
        const accessToken = await user.generateAccessToken()
        const refreshToken = await user.generateRefreshToken()
        user.refreshTokens = refreshToken 
    
       await user.save({ validateBeforeSave: false })
       return {refreshToken,accessToken}
    
    } catch (error) {
        throw new ApiError(500,"Something went wrong while generating access and refresh token")
    }
}   

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

    const {fullname, password, email, username} = req.body
    // console.log("email:",email);

    // if (fullname === "") {
    //     throw new ApiError(400, "Full name is required")
    // }

    //same you can follow for all the compuslory fi0eld 
    //that is check if the field is empty or not
    // but there is a better but a little complex code
    
    if (
        [fullname,email,username,password].some((field) => field?.trim() === "")) 
        {
            throw new ApiError(400, "All the fields are compulsory")    
    }

    const existedUser = await User.findOne({
        $or: [{ username },{ email }]
    
    })
    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists ")
    }

    // console.log(req.files)

    const avatarLocalPath =  req.files?.avatar[0]?.path;
    // const coverImagelocalPath =  req.files?.coverImage[0]?.path;

    let coverImagelocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0 ) {
        coverImagelocalPath = req.files.coverImage[0].path
    }

    if (!avatarLocalPath) {
        throw new ApiError(400,"Avatar file is required")
    }

    const Avatar = await uploadCloudinary(avatarLocalPath)
    const coverImage = await uploadCloudinary(coverImagelocalPath)

    
    // console.log(Avatar)


    if (!Avatar) {
        throw new ApiError(400,"Avatarrrrrrrr file is required")      
    }

    const user = await User.create({
        fullname,
        avatar: Avatar.url,
        coverImage: coverImage?.url || "",
        password,
        email,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshTokens"
    )
    
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registring")
    }

    return res.status(201).json(
        new ApiResponse(200,createdUser,"User Regsitered sucessfully")
    )

} )

const loginuser = asyncHandler( async (req,res) =>{
    // get user detials from frontend    | req.body --> data
    //validate all the fields               | username or email
    //check the fields to the databse       |find the user
    //if ! return "login failed"            | password check
    //else give the access token to the user | access and refresh token
    // with the speicifc duration
    //also save the refresh token for futher authentication | send cookie



    const {username,email,password} = req.body //req.body into data


    //either one of the field is mandatory
    if (!username || !email) {
        throw new ApiError(400, "username or email is required")
    }

    //find either username or email from the model database 
    const user = await User.findOne({
        $or: [{username},{email}]
    }) 

    if (!user) {
        throw new ApiError(404, "User does not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials")
    }

    const {accessToken,refreshTokens} = await genZerateAccessAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshTokens")

    const options = {
       httpOnly: true,
       secure: true 
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken,options)
    .cookie("refreshToken",refreshTokens,options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser, accessToken, refreshTokens
            },
            "User Logged In Sucessfully"
        )
    )



})

const logoutuser = asyncHandler(async (req,res) =>{
    //clear cookies
    //clear refresh tokens
    //because of the middleware we have the acces to the object
    // req.user which we created in the middleware

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshTokens: undefined
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true 
    }

    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCokkie("refreshToken",options)
    .json(
        new ApiResponse(200,{},"User Logged Out")
    )
})



export {
    registerUser,
    loginuser,
    logoutuser
}