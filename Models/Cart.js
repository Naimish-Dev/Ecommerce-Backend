
const mongoose = require("mongoose");

const cart_Schema = mongoose.Schema(
  {
    userid: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    products: [
      {
        productid: { type: mongoose.Types.ObjectId, ref: "Product" },
        titel: { type: String, required: true },
        img: { type: String, required: true },
        quantity: { type: Number, default: 1 },
        color: { type: String },
        size: { type: String },
      },
    ],
    amount: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Cart", cart_Schema);
