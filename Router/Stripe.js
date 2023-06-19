const router=require("express").Router()
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

router.get("/payment",(req,res)=>{
    try{
        res.status(200).send("accessecable")

    }catch(e){
        res.status(500).send("not accessecable")
    }
});


router.post("/payment",  (req,res)=>{
  

stripe.paymentIntents.create(
  {
    amount: req.body.amount,
    currency: "INR",
    payment_method_types: ["card"],
    metadata: { ...req.body.user_details },
  },
  (striperror, striperes) => {
 
    if (striperror) {
      res.status(500).json(striperror);
    } else {
      res.status(200).json(striperes);
    }
  }
);
})
module.exports =router