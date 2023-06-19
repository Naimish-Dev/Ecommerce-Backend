const router = require("express").Router();
const Order = require("../Models/Order");
const {
  verifyToken,
  verifiedTokenAndAdmin,
} = require("../middleware/VerifyToken");



// add Order
router.post("/", verifyToken, async (req, res) => {
  try {
    const Orderdata = new Order(req.body);
    const AddedTocart = await Orderdata.save();
    res.status(200).json(AddedTocart);
  } catch (e) {
    res.status(500).json(e);
    console.log(e);
  }
});
router.get("/", verifyToken, async (req, res) => {
  try {
    const responce = await Order.find().sort({ createdAt: -1 });
    res.status(200).json(responce);
  } catch (e) {
    res.status(500).json(e);
    console.log(e);
  }
});

router.get("/data/:id", verifyToken, async (req, res) => {
     const id = req.params.id;

  try {
    const responce = await Order.findById({ _id: id })
      .populate({ path: "userid" })
      .populate({ path: "cartid" })
      .populate({ path: "transactionid" })
      .populate({ path: "addressid" })
    res.status(200).json(responce);
  } catch (e) {
    res.status(500).json(e);
    console.log(e);
  }
});

//users Update Order by admin only
router.put("/:id", verifiedTokenAndAdmin, async (req, res) => {
  try {
    const id = req.params.id;
    const updateorder = await Order.findByIdAndUpdate(
      { _id: id },
      { $set: req.body },
      { new: true }
    );
    res.status(200).send(updateorder);
  } catch (e) {
    res.status(500).json(e);
    console.log(e);
  }
});

//use Delete  order
router.delete("/:id", verifiedTokenAndAdmin, async (req, res) => {
  try {
    const deleteOrder = await Order.findByIdAndDelete(req.params.id);
    res.status(200).json({ deleteOrder, status: "User has been deleted" });
  } catch (e) {
    res.status(500).json(e);
  }
});

// get Order product.
router.get("/find/:userid", verifiedTokenAndAdmin, async (req, res) => {
  try {
    const userOrder = await Order.findOne({ userid: req.params.userid });
    res.status(200).json(userOrder);
  } catch (e) {
    res.status(500).json(e);
  }
});


// how much order in this month
router.get("/totalorder", verifiedTokenAndAdmin, async (req, res) => {


const currentDate = new Date();
const previousmonth = new Date();
previousmonth.setMonth(currentDate.getMonth() - 1);
  try {
    const allOrders = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: previousmonth },
        },
      },
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          orders: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);
    res.status(200).json(allOrders);
  } catch (e) {
    res.status(500).json(e);
  }
});


// get all latest transition of all users
router.get("/latesttransition", verifiedTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const customMonth = date.getMonth() + 1;
  const customYear = date.getFullYear();
  try {
    const allOrders = await Order.aggregate([
      {
        $lookup: {
          from: "carts",
          localField: "cartid",
          foreignField: "_id",
          as: "cartdata",
        },
      },
      {
        $match: {
          $expr: {
            $and: [
              { $eq: [{ $month: "$createdAt" }, customMonth] }, // Compare month
              { $eq: [{ $year: "$createdAt" }, customYear] }, // Compare year
            ],
          },
        },
      },
      {
        $project: {
          "cartdata.amount": 1,
          "cartdata.status": 1,
          userid: 1,
          createdAt: 1,
        },
      },
    ]);
    res.status(200).json(allOrders);
  } catch (e) {
    res.status(500).json(e);
  }
});

// get monthly incom
router.get("/income", verifiedTokenAndAdmin, async (req, res) => {
 

const currentDate = new Date();
const previousmonth = new Date();
previousmonth.setMonth(currentDate.getMonth() - 1);
  try {
    const allOrders = await Order.aggregate([
      // it get last two moth of data  {
      {
        $lookup: {
          from: "carts",
          localField: "cartid",
          foreignField: "_id",
          as: "cartdata",
        },
      },
      {
        $match: {
          createdAt: { $gte: previousmonth },
        },
      },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$cartdata.amount",
        },
      },
      {
        $unwind: "$sales",
      },
      { $group: { _id: "$month", total: { $sum: "$sales" } } },
      { $sort: { _id: 1 } },
    ]);
    res.status(200).json(allOrders);
  } catch (e) {
    res.status(500).json(e);
  }
});


router.get("/state", verifiedTokenAndAdmin, async (req, res) => {
  try {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
    const data = await Order.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      { $project: { month: { $month: "$createdAt" } } },
      { $group: { _id: "$month", Orders: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json(e);
  }
});

// // order of particular products
// router.get("/productsell", verifiedTokenAndAdmin,async(req,res)=>{
//   
// const currentDate = new Date();
// const previousmonth = new Date();
// previousmonth.setMonth(currentDate.getMonth() - 1);
// const serch='6420853b63f6e1fbf817c7f6';
// const responce = await Order.aggregate([]);
// 
//   try {
//     res.status(200).json(responce)
//   } catch (error) {
//     res.status(500).json(error)
//   }
// });


module.exports = router;
