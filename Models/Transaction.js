const mongoose = require("mongoose");

const transaction_Schema = mongoose.Schema(
  {
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tid:{
        type:String,
        required:true,
    },
    amount:{
        type:Number,
        required:true,
    },
    status:{
        type:String,
        required:true,
        default:"pendding"
      },
    card:{
        type:Number,
        required:true
    }
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Transaction", transaction_Schema);
