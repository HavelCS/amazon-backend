// IMPORTING
const express = require("express");
const mongoose = require("mongoose");
const authRouter = require("./routes/auth.js")
const productRouter = require("./routes/product.js");
const adminRouter = require("./routes/admin.js");
const userRouter = require("./routes/user.js");

//INIT
const app = express();
const DB = "";
const PORT = "3000";




//middlewares
app.use(express.json());
app.use(authRouter);
app.use(productRouter);
app.use(userRouter);
app.use(adminRouter);





//Connections

mongoose.connect(DB).then(() => {
    console.log("Connected to the database")
}).catch((e) => {
    console.log(e);
});

app.listen(PORT, "0.0.0.0", async() => {
  console.log(`Connected at ${PORT}`);
});

