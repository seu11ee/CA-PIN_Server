import mongoose from "mongoose";
import { ICafe } from "../interfaces/ICafe";
import Category from "../models/Category";
import CategoryColor from "../models/CategoryColor";
import User from "../models/User";
import Cafe from "../models/Cafe";
const responseMessage = require("../modules/responseMessage");

const createCategory = async(user_id, colorIdx, categoryName, isDefault) => {
    const hexacode = await CategoryColor.findOne({color_id: colorIdx},{_id:false}).select("color_code");
    const user = await User.findOne({_id: user_id}).select("_id");
    const cafeList: mongoose.Types.ObjectId[]= [] 
    console.log(hexacode.color_code);
    console.log(user_id);
    
    if (user == null) {
        throw Error(responseMessage.READ_USER_FAIL);
    } else if (hexacode == null) {
        throw Error(responseMessage.OUT_OF_VALUE);
    }

    const category = new Category({
        cafes: cafeList,
        user: user_id,
        color: hexacode.color_code,
        name: categoryName,
        isDefault: isDefault
    });

    await category.save();

    return category;
};

const addCafe = async(cafe_ids, category_id) => {
    const category = await Category.findOne({_id: category_id});
 
    if (cafe_ids.length == 0) {
        // 추가하려는 카페가 없이 넘어온 경우
        throw Error(responseMessage.BAD_REQUEST);
    } else if (category == null) {
        // id가 일치하는 카테고리가 없는 경우
        throw Error(responseMessage.INVALID_IDENTIFIER);
    }

    const cafeList: mongoose.Types.ObjectId[]= []
    for (let id of cafe_ids) {
        const cafe = await Cafe.findOne({_id: id});
        if (cafe == null) {
            // id가 일치하는 카페가 없는 경우
            throw Error(responseMessage.INVALID_IDENTIFIER);
        }
        cafeList.push(cafe._id);
    }
    
    await Category.updateOne({
        _id: category._id
      },
      {
        $addToSet: {cafes: cafeList}
      });
};

const deleteCategory = async(category_id) => {
    const category = await Category.findOne({_id: category_id});
    if (category == null) {
        throw Error(responseMessage.INVALID_IDENTIFIER);
    } else if (category.isDefault) {
        throw Error(responseMessage.DELETE_DEFAULT_FAIL);
    }

    await Category.remove({_id: category._id}, function(err) {
        if (err) {
            throw err;
        }
    });
}

module.exports = {
    createCategory,
    addCafe,
    deleteCategory
}