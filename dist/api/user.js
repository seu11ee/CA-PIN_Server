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
const router = express_1.default.Router();
const userService = require("../services/userService");
const statusCode = require("../modules/statusCode");
const responseMessage = require("../modules/responseMessage");
/**
 *  @route Post api/user/login
 *  @desc Authenticate user & get token(로그인)
 *  @access Public
 */
router.post("/login", [
    express_validator_1.check("email", "Please include a valid email").not().isEmpty(),
    express_validator_1.check("password", "password is required").not().isEmpty(),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(statusCode.BAD_REQUEST).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
        const user = yield userService.loginUser(email, password);
        const userToken = yield userService.generateToken(user._id);
        return res.status(statusCode.OK).json({
            message: responseMessage.SIGN_IN_SUCCESS,
            loginData: {
                nickname: user.nickname,
                token: userToken
            },
        });
    }
    catch (error) {
        switch (error.message) {
            case responseMessage.NO_EMAIL:
                res.status(statusCode.BAD_REQUEST).send({ message: error.message });
                break;
            case responseMessage.MISS_MATCH_PW:
                res.status(statusCode.BAD_REQUEST).send({ message: error.message });
                break;
            default:
                res.status(statusCode.INTERNAL_SERVER_ERROR).send({ message: responseMessage.INTERNAL_SERVER_ERROR });
        }
    }
}));
/**
 *  @route Post api/user/signup
 *  @desc generate user(회원가입)
 *  @access Public
 */
router.post("/signup", [
    express_validator_1.check("nickname", "nickname is required").not().isEmpty(),
    express_validator_1.check("email", "Please include a valid email").isEmail(),
    express_validator_1.check("password", "password is required").not().isEmpty(),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(statusCode.BAD_REQUEST).json({ errors: errors.array() });
    }
    const { nickname, email, password } = req.body;
    try {
        const user = yield userService.signupUser(nickname, email, password);
        return res.status(statusCode.CREATED).json({
            message: responseMessage.SIGN_UP_SUCCESS
        });
    }
    catch (error) {
        switch (error.message) {
            case responseMessage.ALREADY_EMAIL:
                res.status(statusCode.BAD_REQUEST).send({ message: error.message });
                break;
            case responseMessage.ALREADY_NICKNAME:
                res.status(statusCode.BAD_REQUEST).send({ message: error.message });
                break;
            default:
                res.status(statusCode.INTERNAL_SERVER_ERROR).send({ message: responseMessage.INTERNAL_SERVER_ERROR });
        }
    }
}));
module.exports = router;
//# sourceMappingURL=user.js.map