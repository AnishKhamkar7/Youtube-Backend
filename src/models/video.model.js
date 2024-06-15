import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";


const videoSchema = new Schema(
    {
        videoFile: {
            type: String, //cloudinary url
            required: true
        },
        thumbnail:{
            type: String, //cloudinary url
            required: true
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        title: {
            type :String,
            reqired: true
        },
        description: {
            type :String,
            reqired: true
        },
        duration: {
            type :Number,
            reqired: true
        },
        views: {
            type :Number,
            default: 0
        },
        title: {
            type :String,
            reqired: true
        },


    },
    {
        timestamps:true
    }
)

videoSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("Video", videoSchema)

