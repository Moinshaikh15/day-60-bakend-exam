const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({

  dishes: [
    {
      _id: false,
      dish: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "items",
        required: true,
      },
      quantity: { type: Number },
    },
  ],
  restaurantId: {
    type: mongoose.Schema.ObjectId,
    ref: "Restaurant",
  },
  deliveryAddress: {
    type: String,
    require: true,
  },
  status: {
    type: String,
    default: "pending",
  },
  orderedAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Order", OrderSchema);
