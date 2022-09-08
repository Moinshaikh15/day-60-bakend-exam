const express = require("express");
const UserModel = require("../modules/userSchema");
const bcrypt = require("bcryptjs");
let router = express.Router();

//Sign up
router.post("/signup", async (req, res) => {
  let { name, email, password, confirmPassword } = req.body;
  if (!name || !email || !password || !confirmPassword) {
    return res.status(400).send("All fields are required");
  }
  if (password !== confirmPassword) {
    return res.status(400).send("passwords don't match");
  }

  let existingUser = await UserModel.findOne({ email: email });
  if (existingUser !== null) {
    return res.status(400).send("Email alreday exists");
  }
  let salt = await bcrypt.genSalt(10);
  let hash = await bcrypt.hash(password, salt);

  let newUser = new UserModel({
    name,
    email,
    password: hash,
  });
  try {
    let savedUser = await newUser.save();
    res.status(200).send("User created" + savedUser);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Login
router.post("/login", async (req, res) => {
  let { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send("All fields are required");
  }

  try {
    let existingUser = await UserModel.findOne({ email: email });
    if (existingUser === null) {
      return res.status(400).send("Email does not  exists");
    }
    let usersPassword = existingUser.password;
    let response = await bcrypt.compare(password, usersPassword);
    if (!response) {
      return res.status(400).send("Password is Wrong");
    }
    return res.status(200).send("User logged in successfully" + existingUser);
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
