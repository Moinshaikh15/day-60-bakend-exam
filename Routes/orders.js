const express = require("express");
const OrderModel = require("../modules/orderSchema");
const RestaurantModel = require("../modules/restaurantSchema");

let router = express.Router();

//create new order
router.post("/", async (req, res) => {
  let { dishes, deliveryAddress, restaurantId } = req.body;
  if (!dishes || !deliveryAddress) {
    res.status(400).send("please dishes and delivery address to your order");
  }
  let newOrder = new OrderModel({
    dishes,
    deliveryAddress,
    restaurantId,
  });
  try {
    let savedOrder = await newOrder.save();

    try {
      await RestaurantModel.updateOne(
        { _id: restaurantId },
        { $push: { orders: savedOrder._id } }
      );
      return res.status(200).send("Order created" + savedOrder);
    } catch (er) {
      console.log(er);
      return res.status(400).send(er);
    }
  } catch (err) {
    res.status(400).send(err);
  }
});

//Get details of any order
router.get("/:id", async (req, res) => {
  let id = req.params.id;
  try {
    let order = await OrderModel.find({ _id: id })
      .populate("dishes", "name")
      .populate("restaurantId", "name");
    return res.status(200).send(order);
  } catch (err) {
    return res.status(400).send(err);
  }
});

//Change status of any order
router.post("/:id/update", async (req, res) => {
  let { status } = req.body;
  let id = req.params.id;
  try {
    let resp = await OrderModel.updateOne({ _id: id }, { status: status });
    res.status(200).send("Status update " + resp);
  } catch (er) {
    res.status(400).send(er);
  }
});

module.exports = router;
