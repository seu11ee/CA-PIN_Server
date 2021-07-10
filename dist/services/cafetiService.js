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
const User_1 = __importDefault(require("../models/User"));
const Cafeti_1 = __importDefault(require("../models/Cafeti"));
const createError = require('http-errors');
const statusCode = require("../modules/statusCode");
const responseMessage = require("../modules/responseMessage");
const fetchCafetiResult = (userId, answers) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.default.findOne({ _id: userId });
    if (user == null) {
        throw createError(statusCode.BAD_REQUEST, responseMessage.READ_USER_FAIL);
    }
    else if (answers.length != 4) {
        throw createError(statusCode.BAD_REQUEST, responseMessage.INVALID_IDENTIFIER);
    }
    let result = "";
    switch (answers[0]) {
        case 0:
            result += "C";
            switch (answers[1]) {
                case 0:
                    result += "A";
                    break;
                case 1:
                    result += "S";
                    break;
                case 2:
                    result += "X";
                    break;
            }
            break;
        case 1:
            result += "N";
            switch (answers[1]) {
                case 0:
                    result += "T";
                    break;
                case 1:
                    result += "L";
                    break;
                case 2:
                    result += "J";
                    break;
            }
            break;
    }
    switch (answers[2]) {
        case 0:
            result += "M";
            break;
        case 1:
            result += "V";
            break;
        case 2:
            result += "H";
            break;
        case 3:
            result += "F";
            break;
        case 4:
            result += "C";
            break;
    }
    switch (answers[3]) {
        case 0:
            result += "D";
            break;
        case 1:
            result += "P";
            break;
        case 2:
            result += "B";
            break;
        case 3:
            result += "W";
            break;
    }
    const cafeti = yield Cafeti_1.default.findOne({ type: result });
    const cafetiResult = yield User_1.default.findOneAndUpdate({ _id: userId }, { cafeti: cafeti }, { new: true });
});
module.exports = {
    fetchCafetiResult
};
//# sourceMappingURL=cafetiService.js.map