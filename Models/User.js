const mongoose=require("mongoose")


const User_Schema = mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    unique: true,
  },
  is_Admin: {
    type: Boolean,
    default:false
  },
  number:{
    type:Number,
    required:true
  },
  img:{
    type:String
  },
},{
    timestamps:true
});
module.exports =mongoose.model("User",User_Schema);