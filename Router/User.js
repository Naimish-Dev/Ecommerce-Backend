const {
  verifiedTokenAndAuthorization,
  verifiedTokenAndAdmin,
  verifyToken,
} = require("../middleware/VerifyToken");
const router = require("express").Router();
const User_Model = require("../Models/User");
const cryptos = require("crypto-js");
const User = require("../Models/User");
const { aggregate } = require("../Models/User");
require("dotenv").config()

// Update user details by it self or admin
router.put("/:id", verifiedTokenAndAuthorization, async (req, res) => {
  if (req.body.password) {
    req.body.password = cryptos.AES.encrypt( req.body.password, process.env.PASSWORD_KEY
    ).toString();
  }
  try {
    const id = req.params.id;
    const updatedusers = await User_Model.findByIdAndUpdate(
      { _id: id },
      { $set: req.body },
      { new: true }
    );
    res.status(200).send(updatedusers);
  } catch (e) {
    res.status(500).json(e);
  }
});


//use Delete  it self or amin can delete user
router.delete("/:id", verifiedTokenAndAuthorization, async (req, res) => {
  try {
    const deleteuser = await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ deleteuser, status: "User has been deleted" });
  } catch (e) {
    res.status(500).json(e);
  }
});

// //only admin get perticular user info.
router.get("/find/:id", verifiedTokenAndAdmin, async (req, res) => {
  try {
    const indUser = await User.findById({_id:req.params.id});
    const { password, ...otherdata } = indUser._doc;
    res.status(200).json(otherdata);
  } catch (e) {
    res.status(500).json(e);
  }
});

// //only admin get all user info.
router.get("/", verifiedTokenAndAdmin, async (req, res) => {
  try {
    // we cal also get last new 5 resentley register user
    const query_users = req.query.new;
    const indUser = query_users
      ? await User.find().sort({ _id: -1 }).limit(1)
      : await User.find();

    res.status(200).json(indUser);
  } catch (e) {
    res.status(500).json(e);
  }
});

router.get("/state", verifiedTokenAndAdmin, async (req, res) => {
  try {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
    const data = await User.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      { $project: { month: { $month: "$createdAt" } } },
      { $group: { _id: "$month", total: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json(e);
  }
});

module.exports = router;
