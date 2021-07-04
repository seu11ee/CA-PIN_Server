import mongoose from "mongoose";
import config from "../config";
import User from "../models/User"
import Cafeti from "../models/Cafeti";
import Category from "../models/Category";

const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoURI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });

    console.log("Mongoose Connected ...");

    User.createCollection().then(function(collection){
      console.log("User Collection is created!");
    });

    Cafeti.createCollection().then(function(collection){
      console.log("Cafeti Collection is created!");
    });

    Category.createCollection().then(function(collection){
      console.log("Category Collection is created!");
    });

  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

export default connectDB;