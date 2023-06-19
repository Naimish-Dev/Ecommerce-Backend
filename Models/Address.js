const mongoose = require("mongoose");

const Address_Schema = mongoose.Schema(
  {
    userid: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
        uname: { type: String, required: true },
        number: { type: Number, required: true },
        location: { type: String, required: true },
        pin: { type: Number, required: true },      
    },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Address", Address_Schema);
