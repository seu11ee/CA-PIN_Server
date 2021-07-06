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
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        return res.status(400).json({ errors: errors.array() });
    }
    const { nickname, email, password } = req.body;
    try {
        const user = yield userService.signupUser(nickname, email, password);
        // const token
        return res.status(statusCode.OK).json({
            user: {
                nickname: user.nickname,
                email: user.email,
                password: user.password
            },
            // token: token,
            message: '유저 생성 성공'
        });
    }
    catch (error) {
        switch (error.message) {
            case responseMessage.ALREADY_EMAIL:
                res.status(400).send({ message: error.message });
                break;
            case responseMessage.ALREADY_NICKNAME:
                res.status(400).send({ message: error.message });
                break;
            default:
                res.status(500).send({ message: responseMessage.INTERNAL_SERVER_ERROR });
        }
    }
}));
module.exports = router;
//# sourceMappingURL=user.js.map