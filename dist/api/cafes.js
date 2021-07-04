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
const Cafe_1 = __importDefault(require("../models/Cafe"));
/*
테스트용 api
**/
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tag = "60dc1623d2c7be7b98198014";
    const tag2 = "60dc17698a5e06c2a33645d2";
    console.log(req.query.tags);
    console.log(req.query.userid);
    try {
        // var cafes = await Cafe.find().populate({
        //     path:"tags",
        //     match:{ _id:tag}
        // });
        if (req.query.tags) {
            var cafes = yield Cafe_1.default.find({
                tags: { "$all": [tag] }
            }).populate("tags");
            if (!cafes) {
                return res.status(204).send();
            }
            return res.json({ cafes: cafes });
        }
        else {
            var cafes = yield Cafe_1.default.find();
            return res.json({ cafes: cafes });
        }
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send({ message: "Server Error" });
    }
}));
module.exports = router;
//# sourceMappingURL=cafes.js.map