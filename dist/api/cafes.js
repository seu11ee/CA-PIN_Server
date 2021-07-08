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
const mongoose_1 = __importDefault(require("mongoose"));
const router = express_1.default.Router();
const cafeService = require("../services/cafeService");
const statusCode = require("../modules/statusCode");
const responseMessage = require("../modules/responseMessage");
/**
 *  @route GET cafes?tags={tagIndex},..,{}
 *  @desc get a cafe location list
 *  @access Public
 */
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tagQuery = req.query.tags;
    var tags = [];
    try {
        if (tagQuery) {
            tags = tagQuery.split(",").map(x => +x);
        }
        const cafeLocationList = yield cafeService.getCafeLocationList(tags);
        return res.status(statusCode.OK).json({
            message: responseMessage.CAFE_LOCATION_SUCCESS,
            cafeLocations: cafeLocationList
        });
    }
    catch (error) {
        switch (error.message) {
            case responseMessage.NO_CONTENT:
                res.status(statusCode.NO_CONTENT).send();
            case responseMessage.INVALID_IDENTIFIER:
                res.status(statusCode.BAD_REQUEST).send({ message: error.message });
            default:
                res.status(statusCode.INTERNAL_SERVER_ERROR).send({ message: responseMessage.INTERNAL_SERVER_ERROR });
        }
    }
}));
/**
 *  @route GET cafes/:cafeId
 *  @desc get a cafe detail
 *  @access Private
 */
router.get("/:cafeId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cafeId = req.params.cafeId;
    try {
        if (!mongoose_1.default.isValidObjectId(cafeId)) {
            throw (Error(responseMessage.INVALID_IDENTIFIER));
        }
        else {
            const cafeDetail = yield cafeService.getCafeDetail(cafeId);
            res.status(statusCode.OK).send({ message: responseMessage.CAFE_DETAIL_SUCCESS, cafeDetail });
        }
    }
    catch (error) {
        switch (error.message) {
            case responseMessage.INVALID_IDENTIFIER:
                res.status(statusCode.BAD_REQUEST).send({ message: error.message });
            case responseMessage.NO_CONTENT:
                res.status(statusCode.NO_CONTENT).send();
            default:
                res.status(statusCode.INTERNAL_SERVER_ERROR).send({ message: responseMessage.INTERNAL_SERVER_ERROR });
        }
    }
}));
module.exports = router;
//# sourceMappingURL=cafes.js.map