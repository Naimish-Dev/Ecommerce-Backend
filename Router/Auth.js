require("dotenv").config()
const router = require("express").Router();
const User = require("../Models/User");
const crypto=require("crypto-js")
const jwt =require("jsonwebtoken")

// register new user
router.post("/register", async (req, res) => {
  
  const newuser = new User({
    userName: req.body.userName,
    email: req.body.email,
    number: req.body.number,
    img: req.body.img,
    password: crypto.AES.encrypt(
      req.body.password,
      process.env.PASSWORD_KEY
    ).toString(),
  });
  try {
    const responce = await newuser.save();
    res.status(200).send(responce);
    
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
});


// login user
router.post("/login", async (req, res) => {

const email = req.body.username;
  try{
  const user=await User.findOne({email:email})
  // if user is not found 
  !user && res.status(401).json("Wrong Credential!")
  // password decript
  const hasedpassword = crypto.AES.decrypt( user.password, process.env.PASSWORD_KEY );
  
  // password convert String
  const d_password=hasedpassword.toString(crypto.enc.Utf8);
// console.log(d_password);
  // if password is not matched with seted password
  d_password !== req.body.password && res.status(401).json("Wrong password!");

// token generated and also send id and admin state so we cna use in middleware
// const accesstoken = jwt.sign({ id: user._id, isAdmin: user.is_Admin },process.env.JWT_KEY,{expiresIn:"1d"});
/// this tokek is not expired 
const accesstoken = jwt.sign({ id: user._id, isAdmin: user.is_Admin },process.env.JWT_KEY);
const {password,...other}=user._doc
res.status(200).json({...other,accesstoken});
}catch(e){
  res.status(500)
}
});

module.exports = router;