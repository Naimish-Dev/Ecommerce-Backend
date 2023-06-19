const router = require("express").Router();
const Address = require("../Models/Address");
const {
  verifiedTokenAndAuthorization,
  verifyToken,
} = require("../middleware/VerifyToken");

// add new address
router.post("/", verifyToken, async (req, res) => {
  try {
      const peoduct = new Address(req.body);
    const AddedAddress = await peoduct.save();
    res.status(200).json(AddedAddress);
  } catch (e) {
    res.status(500).json(e);
  }
});

// Update Address
router.put("/:id", verifyToken, async (req, res) => {
  console.log("uucall");
  try {
    const id = req.params.id;

    const updatedAddress = await Address.findByIdAndUpdate(
      { _id: id },
      { $set: req.body },
      { new: true }
    );
    res.status(200).send(updatedAddress);
  } catch (e) {
    res.status(500).json(e);
    console.log(e);
  }
});

//    delete Address
router.delete("/:id", verifiedTokenAndAuthorization, async (req, res) => {
  try {
    const deleteAddress = await Address.findByIdAndDelete(req.params.id);
    res.status(200).json({ deleteAddress, status: "User has been deleted" });
  } catch (e) {
    res.status(500).json(e);
  }
});

//any one can get all Address.
router.get("/find/:id", verifiedTokenAndAuthorization, async (req, res) => {
  try {
    const indAddress = await Address.find({userid :req.params.id} );
    res.status(200).json(indAddress);
  } catch (e) {
    res.status(500).json(e);
    console.log(e);
  }
});



module.exports = router;
