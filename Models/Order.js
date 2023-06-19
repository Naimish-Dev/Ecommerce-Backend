const mongoose = require("mongoose");

const order_Schema = mongoose.Schema(
  {
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cartid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart",
      required: true,
    },
    transactionid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transaction",
      required: true,
    },
    addressid: { type: mongoose.Schema.Types.ObjectId, ref: "Address" },
    status: { type: String, default: "pending" },
  },    

  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Order", order_Schema);
