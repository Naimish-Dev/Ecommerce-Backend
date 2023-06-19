const router = require("express").Router();
const Cart = require("../Models/Cart");
const {
    verifyToken,
    verifiedTokenAndAuthorization,
    verifiedTokenAndAdmin,
} = require("../middleware/VerifyToken");

// add To cart product by User
router.post("/", verifyToken, async (req, res) => {
  try {
    const cart = new Cart(req.body);
    const AddedTocart = await cart.save();
    res.status(200).json(AddedTocart);
  } catch (e) {
    res.status(500).json(e);
    console.log(e);
  }
});

//users Update product in cart
router.put("/:id", verifiedTokenAndAuthorization, async (req, res) => {
  try {
    const id = req.params.id;
    const CartProduct = await Cart.findByIdAndUpdate(
      { _id: id },
      { $set: req.body },
      { new: true }
    );
    res.status(200).send(CartProduct);
  } catch (e) {
    res.status(500).json(e);
  }
});

//Delete cart
router.delete("/:id", verifiedTokenAndAuthorization, async (req, res) => {
  try {
    const deleteCartproduct = await Cart.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ deleteCartproduct, status: "User has been deleted" });
  } catch (e) {
    res.status(500).json(e);
  }
});

// get user cart
router.get("/find/:userid",verifiedTokenAndAuthorization, async (req, res) => {
  try {
    const userProduct = await Cart.findOne({userid: req.params.userid,})
    res.status(200).json(userProduct);
  } catch (e) {
    res.status(500).json(e);
  }
});
//  get product sell

router.get("/productsell/:id" ,verifiedTokenAndAuthorization, async (req, res) => {
  const currentDate = new Date();
  const previousmonth = new Date();
  previousmonth.setMonth(currentDate.getMonth() - 1);
  try {
    const userProduct = await Cart.aggregate([
      {
        $match: {
          createdAt: { $gte: previousmonth },
        },
      },
      {
        $lookup: {
          from: "productss",
          localField: "products",
          foreignField: "_id",
          as: "productdata",
        },
      },
      {
        $unwind: "$products",
      },
      {
        $project: {
          date: "$createdAt",
          productid: "$products.productid",
          price: "$products.price",
          quantity: "$products.quantity",
        },
      },
      {
        $match: {
          $expr: {
            $eq: [{ $toString: "$productid" }, req.params.id],
          },
        },
      },
      {
        $group: {
          _id: { $month: "$date" },
          sellingamount: {
            $sum: { $multiply: ["$quantity", "$price"] },
          },
        },
      },{
        $sort:{_id:1}
      }
    ]);
    res.status(200).json(userProduct);
  } catch (e) {
    res.status(500).json(e);
    console.log(e);
  }
});

// get secific cart
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const usercart = await Cart.findById(req.params.id).populate({
      path: "products",
    });
    res.status(200).json(usercart);
  } catch (e) {
    res.status(500).json(e);
    console.log(e);
  }
});

// admin get all cart of all users
router.get("/", verifiedTokenAndAdmin, async (req, res) => {

  try {
const allcart = await Cart.find().populate({ path: "userid", select: ["userName ","_id","email"] });
    res.status(200).json(allcart);
  } catch (e) {
    res.status(500).json(e);
  }
});



// get product selling 
module.exports = router;
