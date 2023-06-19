const mongoose = require("mongoose");

const Product_Schema = mongoose.Schema(
  {
    titel: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    img: {
      type: String,
      required: true,
    },
    categories: {
      type: Array,
    },
    color: {
      type: Array,
    },
    size: {
      type: Array,
    },
    price: {
      type: Number,
      required: true,
    },
    instock: {
      type: Boolean,
      default: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Product", Product_Schema);
