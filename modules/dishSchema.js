const mongoose = require("mongoose");

const DishSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  description: {
    type: String,
  },
  restaurantId: {
    type: mongoose.Schema.ObjectId,
    ref: "Restaurant",
  },
  quantity: {
    type: Number,
    require: true,
    default:1
  },
  price: {
    type: Number,
    require: true,
    
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Dish", DishSchema);
