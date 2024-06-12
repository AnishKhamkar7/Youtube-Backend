import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";


const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`mongodb+srv://anishkhamkar123:Anishkhamkar1234@cluster0.ta4nxnb.mongodb.net/$(DB_NAME)`)
        console.log("MONGO CONNECTED !!!!!!!")
        
    } catch (error) {
        console.error("ERROR HERE",error)
        process.exit(1)
        
    }
}

export default connectDB