const express = require("express");
const router = new express.Router();

const auth = require("../middleware/auth");
const User = require("../db/models/user");

router.post("/", async (req, res) => {
  const exsitingUser = await User.findOne({ email: req.body.email });
  if (exsitingUser) {
    return res.status(400).send({
      success: false,
      message: "User is already Registered",
    });
  }
  const user = new User(req.body);

  try {
    await user.save();
    res.status(201).send({
      success: true,
      message: "Registration successful",
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error.message || "Invalid Registration Inputs",
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findByCredential(req.body.email, req.body.password);
    const token = await user.generateAuthToken();
    res.status(200).send({
      success: true,
      message: "Login successful",
      token,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error.message || "Login Failed",
    });
  }
});

router.get("/logout", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.status(200).send({
      success: true,
      message: "Successfully Logout",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message || "Failed to Logout!",
    });
  }
});

module.exports = router;
