const mongoose = require("mongoose");
require("dotenv").config();

const mongoURI = process.env.MONGODB_URI;

module.exports = async function (callback) {
  try {
    await mongoose.connect(mongoURI);

    console.log("Connected to MongoDB");

    const foodData = await mongoose.connection.db
      .collection("food_items")
      .find({})
      .toArray();

    const foodCategory = await mongoose.connection.db
      .collection("food_category")
      .find({})
      .toArray();
    callback(null, foodData, foodCategory);
  } catch (err) {
    callback(err);
  }
};