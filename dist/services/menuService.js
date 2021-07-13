"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Menu_1 = __importDefault(require("../models/Menu"));
const responseMessage = require("../modules/responseMessage");
const statusCode = require("../modules/statusCode");
const getCafeMenuList = (cafeId) => __awaiter(void 0, void 0, void 0, function* () {
    const menus = yield Menu_1.default.find().where("cafe").equals(cafeId);
    if (menus.length == 0) {
        return null;
    }
    var outputMenus = [];
    for (let menu of menus) {
        var outputMenu = {
            name: menu.name,
            price: menu.price
        };
        outputMenus.push(outputMenu);
    }
    return outputMenus;
});
module.exports = {
    getCafeMenuList
};
//# sourceMappingURL=menuService.js.map