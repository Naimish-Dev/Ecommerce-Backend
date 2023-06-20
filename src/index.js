const express=require("express")
const app=express();
// const router = require("../Router/Auth");
const Auth_router=require("../Router/Auth")
const User_router=require("../Router/User")
const Product_router=require("../Router/Prodect")
const Cart_router =require("../Router/Cart")
const Order_router =require("../Router/Order")
const Address_router =require("../Router/Addres")
const Strip_router =require("../Router/Stripe")
const Transaction_router = require("../Router/Transaction");
const dotenv=require("dotenv");
dotenv.config();
const cors =require("cors")
    const corsOptions = {
      origin: '*',
      credentials: true,
      optionSuccessStatus: 200
    }
    app.use(cors(corsOptions))
// to get data from body  which have in json format
app.use(express.json())

const mongoose =require("mongoose")
// DB Connect  
mongoose.set("strictQuery", true);
mongoose.connect(process.env.MONGODB_KEY).then(()=>{console.log("DB Was connectyed")}).catch((e)=>{console.log("DB => "+e);})


app.use("/api/users", User_router);
app.use("/api/auth", Auth_router);
app.use("/api/products", Product_router);
app.use("/api/cart", Cart_router);
app.use("/api/orders", Order_router);
app.use("/api/address", Address_router);
app.use("/api/checkout", Strip_router);
app.use("/api/transaction", Transaction_router);


const PORT=process.env.PORT || 5000
app.listen(PORT, () => {
  console.log("Server start");
});
