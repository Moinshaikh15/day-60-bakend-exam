const mongoose = require("mongoose");

const RestaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  owner:{
    type: mongoose.Schema.ObjectId,
    ref:'User'
  },
  dishes: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Dish",
    },
  ],
  orders: [{ type: mongoose.Schema.ObjectId, ref: "Order" }],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Restaurant", RestaurantSchema);
