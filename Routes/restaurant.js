const express = require("express");
const RestaurantModel = require("../modules/restaurantSchema");
const DishModel = require("../modules/dishSchema");
const OrderModel = require("../modules/orderSchema");
const { route } = require("./auth");
const { json } = require("express");
let router = express.Router();

//create new restaurants
router.post("/", async (req, res) => {
  let { name, owner } = req.body;
  if (!name || !owner) {
    res.status(400).send("restaurant name required and owner name required");
  }
  let newRestaurant = new RestaurantModel({
    name,
    owner,
  });
  try {
    let savedRestaurant = await newRestaurant.save();
    res.status(200).send("restaurant created" + savedRestaurant);
  } catch (err) {
    res.status(400).send(err);
  }
});

//get all restaurants
router.get("/", async (req, res) => {
  try {
    let resp = await RestaurantModel.find({});
    return res.status(200).send(resp);
  } catch (err) {
    return res.status(400).send(err);
  }
});

//Details of restaurants with all dishes offered
router.get("/:id", async (req, res) => {
  try {
    let resp = await RestaurantModel.find({ _id: req.params.id })
      .populate("dishes", "name")
      .populate("owner", "name");
    return res.status(200).send(resp);
  } catch (err) {
    return res.status(400).send(err);
  }
});

//Add new dish for a restaurant
router.post("/:id/add-dish", async (req, res) => {
  let { name, description, price, quantity } = req.body;
  let restaurantId = req.params.id;
  if (!name || !price) {
    res.status(400).send("restaurant name and price required");
  }
  let newDish = new DishModel({
    name,
    description,
    price,
    restaurantId,
    quantity,
  });
  try {
    let savedDish = await newDish.save();
    console.log("dish created");
    try {
      await RestaurantModel.updateOne(
        { _id: restaurantId },
        { $push: { dishes: savedDish._id } }
      );
      res.status(200).send("dish created and added " + savedDish);
    } catch (er) {
      res.status(400).send(er);
    }
  } catch (err) {
    res.status(400).send(err);
  }
});

//get all orders
router.get("/:id/orders", async (req, res) => {
  let id = req.params.id;
  let query = req.query;
  try {
    let restaurant;
    if (query) {
      restaurant = await RestaurantModel.find({
        _id: id,
        status: query.status,
      });
    } else {
      restaurant = await RestaurantModel.find({ _id: id });
    }

    return res.status(200).send(restaurant.orders);
  } catch (err) {
    return res.status(400).send(err);
  }
});

//Get revenue of a restaurant for given time range
router.get("/:id/revenue", async (req, res) => {
  let id = req.params.id;
  let query = req.query;
  let revenue = 0;

  let date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  if (month < 10) month = `0${month}`;
  if (day < 10) {
    day = `0${day}`;
  }

  let fullDate = `${year}-${month}-${day}`;
  try {
    let restaurant = await RestaurantModel.find({ _id: id });

    restaurant[0].orders.map(async (el) => {
      try {
        let order = await OrderModel.find({ _id: el });
        order = order[0];
        console.log(order);
        let orderDate = JSON.stringify(order.orderedAt).slice(1, 11);
        console.log(
          order.status === "completed" &&
            orderDate >= query.start_date &&
            orderDate <= fullDate
        );
        
        if (
          order.status === "completed" &&
          orderDate >= query.start_date &&
          orderDate <= fullDate
        ) {
        
          order.dishes.map(async (elem) => {
            
            try {
              let dish = await DishModel.find({ _id: elem.dish });
              revenue += dish.price * elem.quantity;
              console.log('l')
            } catch (e) {
              console.log(e);
            }
          });
        }
        return res.send(revenue)
      } catch (er) {
        console.log(er);
      }
    });

    return res.status(200).send(revenue);
  } catch (err) {
    return res.status(400).send(err);
  }
});

module.exports = router;
