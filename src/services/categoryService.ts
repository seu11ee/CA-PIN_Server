import mongoose from "mongoose";
import { ICafe } from "../interfaces/ICafe";
import Category from "../models/Category";
import CategoryColor from "../models/CategoryColor";
import User from "../models/User";
const responseMessage = require("../modules/responseMessage");

const createCategory = async(user_id, colorIdx, categoryName) => {
    const hexacode = await CategoryColor.findOne({color_id: colorIdx},{_id:false}).select("color_code");
    console.log(hexacode.color_code);
    console.log(user_id);
    
    if (hexacode == null) {
        throw Error(responseMessage.OUT_OF_VALUE);
    }

    const category = new Category({
        user: user_id,
        color: hexacode.color_code,
        name: categoryName
    });

    await category.save();

    return category;
};

module.exports = {
    createCategory,
}