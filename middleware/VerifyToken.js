const jwt = require("jsonwebtoken");
require("dotenv").config();

// verify token
// check user is Authorized in or not 
const verifyToken =  (req, res, next) => {
  const authHeader = req.headers.token;
  if (authHeader) {
    // get Orignal Token Which will pass throw the header 
    const Token=authHeader.split(" ")[1]
    // user data provide with token when user is login then after we can use here 
   jwt.verify(Token, process.env.JWT_KEY, (error, user) => {
      if (error) {
        res.status(403).json("Token is  not Valid");
      }
      req.user = user;
      next();
    });
  } else {
    res.status(401).json("You are not authenticated");
  }
};

// verify token or  check user is authorized 
// check user is auth or is it admin ?
const verifiedTokenAndAuthorization =  (req, res, next) => {
    verifyToken(req,res,()=>{
          if (req.user.id === req.params.id || req.user.isAdmin) {
            next();
          } else {
            res.status(403).json("you are not alowed to do that!");
          }
        })
    }

// check is it Admin. admin can only take some acion  like  Add-producet, delete upser
const verifiedTokenAndAdmin =  (req, res, next) => {
    verifyToken(req,res,()=>{
              if (req.headers.token) {
                if (req.user.isAdmin) {
                  next();
                } else {
                  res.status(403).json("user not alowed to do that!");
                }
              } else {
                res.status(403).json("user not alowed to do that!");
              }
    })
}


module.exports = {
  verifyToken,
  verifiedTokenAndAuthorization,
  verifiedTokenAndAdmin,
};