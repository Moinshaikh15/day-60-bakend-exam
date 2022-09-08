const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const authRouter = require("./Routes/auth");
const restaurantRouter = require("./Routes/restaurant");
const orderRouter=require('./Routes/orders')
const app = express();

//Middleware
app.use(express.json());
app.use(morgan("dev"));

let DB_URL =
  "mongodb+srv://test:test123@cluster0.pkvnn0u.mongodb.net/Restaurants?retryWrites=true&w=majority";

mongoose
  .connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("connected To DB"))
  .catch((err) => console.log("error", err.message));

//Routes
app.use("/auth", authRouter);
app.use("/restaurants", restaurantRouter);
app.use('/orders',orderRouter)
app.listen(process.env.PORT || 8000);
