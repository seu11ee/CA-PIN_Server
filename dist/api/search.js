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
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const statusCode = require("../modules/statusCode");
const responseMessage = require("../modules/responseMessage");
const cafeService = require("../services/cafeService");
router.get("/cafe", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const searchQuery = req.query.query;
    if (!searchQuery) {
        return res.status(statusCode.NO_CONTENT).send();
    }
    try {
        const cafes = yield cafeService.getCafeByName(searchQuery);
        if (!cafes)
            return res.status(statusCode.NO_CONTENT).send();
        return res.status(statusCode.OK).json({
            "message": responseMessage.SEARCH_SUCCESS,
            "searchResults": cafes
        });
    }
    catch (error) {
        next(error);
    }
}));
module.exports = router;
//# sourceMappingURL=search.js.map