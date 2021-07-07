"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const UserSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    nickname: {
        type: String,
        required: true,
        unique: true
    },
    cafeti: {
        type: String,
    },
    profileImg: {
        type: String,
    },
    created_at: {
        type: Date,
    },
    deleted_at: {
        type: Date,
    }
}, {
    collection: "user"
});
exports.default = mongoose_1.default.model("User", UserSchema);
//# sourceMappingURL=User.js.map