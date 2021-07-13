import Menu from "../models/Menu";
import createError from "http-errors";
import { IMenu, IMenuOutputDTO } from "../interfaces/IMenu";
import mongoose from "mongoose";
const responseMessage = require("../modules/responseMessage");
const statusCode = require("../modules/statusCode");

const getCafeMenuList = async (cafeId) => {
    const menus = await Menu.find().where("cafe").equals(cafeId);
    if (menus.length == 0){
        return null
    }
    var outputMenus:IMenuOutputDTO[] = []
    for (let menu of menus){
        var outputMenu: IMenuOutputDTO = {
            name: menu.name,
            price: menu.price
        }
        outputMenus.push(outputMenu);
    }
    return outputMenus;
};

module.exports = {
    getCafeMenuList
}