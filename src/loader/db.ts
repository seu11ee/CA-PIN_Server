import mongoose from "mongoose";
import config from "../config";
import Cafe from "../models/Cafe";
import Review from "../models/Review";
import Tag from "../models/Tag";

const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoURI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });

    console.log("Mongoose Connected ...");

    Cafe.createCollection().then(function(collection){
      console.log("Cafe Collection is created!");
    });

    Review.createCollection().then(function(collection){
      console.log("Review Collection is created!");
    });

    Tag.createCollection().then(function(collection){
      console.log("Tag Collection is created!");
    });

  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

export default connectDB;