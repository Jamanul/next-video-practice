import mongoose, {Mongoose, Schema,model,models} from "mongoose";
import bcrypt from "bcrypt";
import { timeStamp } from "console";

export const Video_Dimentions = {
    width: 1080,
    height:1920,
} as const;

export interface IVideo {
    _id?:mongoose.Types.ObjectId;
    title : string;
    description: string;
    videoUrl:string;
    thumbnailUrl:string;
    controls?:boolean;
    transformation?:{
        height:number;
        width:number;
        quality?:number;
    };
}

const videoSchema = new Schema<IVideo>(
    {
        title:{type:String,required:true},
        description:{type:String,required:true},
        thumbnailUrl:{type:String,required:true},
        videoUrl:{type:String,required:true},
        controls:{type:Boolean,default:true},
        transformation: {
             height:{type:Number,default:Video_Dimentions.height},
            width:{type:Number,default:Video_Dimentions.width},
            quality:{type:Number,min:1,max:100}
        }
    },
    {
        timestamps:true
    }
)

const Video = models?.Video ||  model<IVideo>("Video",videoSchema)

export default Video;