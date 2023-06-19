const router = require("express").Router();
const Transaction = require("../Models/Transaction");
const {
  verifiedTokenAndAuthorization,
  verifiedTokenAndAdmin,
  verifyToken,
} = require("../middleware/VerifyToken");

// add new transaction
router.post("/", verifyToken, async (req, res) => {
  try {
    const peoduct = new Transaction(req.body);
    const responce = await peoduct.save();
    res.status(200).json(responce);
  } catch (e) {
    res.status(500).json(e);
  }
});

// get all transaction 
router.get("/", verifyToken, async (req, res) => {
    console.log("call");
  try {
    const responce = await Transaction.find();
    res.status(200).json(responce);
  } catch (e) {
    res.status(500).json(e);
  }
});

//    delete trasaction
router.delete("/:id", verifiedTokenAndAdmin, async (req, res) => {
  try {
    const deleteAddress = await Address.findByIdAndDelete(req.params.id);
    res.status(200).json({ deleteAddress, status: "User has been deleted" });
  } catch (e) {
    res.status(500).json(e);
  }
});

//any one can get all Address.
router.get("/find/:id", verifiedTokenAndAdmin, async (req, res) => {
  
  try {

    const responce = await Transaction.findById({
      _id: req.params.id,
    }).populate({ path: "userid", select: "-password" });
    res.status(200).json(responce);
  } catch (e) {
    res.status(500).json(e);
    console.log(e);
  }
});


router.get("/state", verifiedTokenAndAdmin, async (req, res) => {
  try {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
    const data = await Transaction.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      {
        $project: {
          month: { $month: "$createdAt" },
          totalAmount:  "$amount" ,
        },
      },
      { $group: { _id: "$month", Amount: {$sum:"$totalAmount"} } },
      { $sort: { _id: 1 } },
    ]);
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json(e);
  }
});
module.exports = router;
