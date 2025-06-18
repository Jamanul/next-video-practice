import mongoose, {Schema,model,models} from "mongoose";
import bcrypt from "bcrypt";
// export it so i can use it everywhere
export interface IUser {
    email:string;
    password:string;
    _id?: mongoose.Types.ObjectId;
    createdAt:Date;
    updatedAt:Date;
}
// you have to create a schema for mongooses type 
const userSchema = new Schema<IUser>(
    {email:{type:String,unique:true,required:true },
    password:{type:String,required:true}},
    {
        timestamps:true // adds createdAt and updatedAt automatically
    }
)
// Schema(...) expects two separate arguments:
// The first is an object defining the schema fields (like email, password).
// The second is an optional configuration object (like { timestamps: true }).

userSchema.pre('save',async function(next){
    if(this.isModified("password")){
        this.password=await  bcrypt.hash(this.password,10)
    }
     next();
})
// Create the Mongoose model (reusing if it already exists)
const User = models?.User || model<IUser>("User",userSchema)
export default User