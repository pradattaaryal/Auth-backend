import mongoose from "mongoose";

 
 

const userSchema = new mongoose.Schema({
    googleId:String,
    displayName:String,
    email:String,
    image:String,
    password: String,
},{timestamps:true});
const userdb = new mongoose.model("users",userSchema);
export default userdb