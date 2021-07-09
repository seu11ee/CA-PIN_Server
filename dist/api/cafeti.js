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
const express_validator_1 = require("express-validator");
const auth_1 = __importDefault(require("../middleware/auth"));
const router = express_1.default.Router();
const cafetiService = require("../services/cafetiService");
const statusCode = require("../modules/statusCode");
const responseMessage = require("../modules/responseMessage");
/**
 *  @route Post /cafeti/
 *  @desc Do Cafeti test(카페티아이 검사)
 *  @access Private
 */
router.post("/", [
    express_validator_1.check("answers", "answers is required").not().isEmpty(),
], auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(statusCode.BAD_REQUEST).json({ errors: errors.array() });
    }
    const { answers } = req.body;
    try {
        const result = yield cafetiService.fetchCafetiResult(res.locals.userId, answers);
        res.status(statusCode.OK).json({
            message: responseMessage.CAFETI_TEST_SUCCESS,
        });
    }
    catch (error) {
        switch (error.message) {
            default:
                res.status(statusCode.INTERNAL_SERVER_ERROR).send({ message: error.message });
        }
    }
}));
module.exports = router;
//# sourceMappingURL=cafeti.js.map