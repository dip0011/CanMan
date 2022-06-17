const mongoose = require("mongoose");
const mongodbURL = process.env.MONGODB_URL;

//Connect MongoDB
mongoose.connect(mongodbURL).then(() => {
  console.log("Connected to MongoDB");
});
