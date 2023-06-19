const router = require("express").Router();
const Product = require("../Models/Prodect");
const {
  verifiedTokenAndAuthorization,
  verifiedTokenAndAdmin,
  verifyToken,
} = require("../middleware/VerifyToken");
const { route } = require("./Auth");

// add new product
router.post("/", verifiedTokenAndAdmin, async (req, res) => {
  try {
    const peoduct = new Product(req.body);
    const AddedProduct = await peoduct.save();
    res.status(200).json(AddedProduct);
  } catch (e) {
    res.status(500).json(e);
  }
});

//only can admin Update product
router.put("/:id", verifiedTokenAndAdmin, async (req, res) => {
  try {
    console.log(id);
    const updatedProduct = await Product.findByIdAndUpdate(
      { _id: id },
      { $set: req.body },
      { new: true }
    );
   
    res.status(200).send(updatedProduct);
  } catch (e) {
    res.status(500).json(e); 
  }
});

//    amin can delete product
router.delete("/:id", verifiedTokenAndAdmin, async (req, res) => {
  try {
    const deleteProduct = await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ deleteProduct, status: "User has been deleted" });
  } catch (e) {
    res.status(500).json(e);
  }
});

//any one can get all product.
router.get("/find/:id", async (req, res) => {
  try {
    const indProduct = await Product.findById(req.params.id);
    res.status(200).json(indProduct);
  } catch (e) {
    res.status(500).json(e);
  }
});

//any one can get all product.
router.get("/", async (req, res) => {
  const Qnew = req.query.new;
  const Qcategory = req.query.category;
  let indProduct = "";
  try {
    if (Qnew) {
      indProduct = await Product.find().sort({ createdAt: -1 }).limit(5);
    } else if (Qcategory) {
      // categories is a array and we will find a inside of this array so the we used $in[value]
      indProduct = await Product.find({ categories: { $in: [Qcategory] } });
    } else {
      indProduct = await Product.find();
    }
    res.status(200).json(indProduct);
  } catch (e) {
    res.status(500).json(e);
  }
});

module.exports = router;
