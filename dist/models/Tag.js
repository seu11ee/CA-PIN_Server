"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const TagSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    tagIdx: {
        type: Number,
        required: true,
        unique: true,
        index: true
    }
}, {
    collection: "tags"
});
exports.default = mongoose_1.default.model("Tag", TagSchema);
//# sourceMappingURL=Tag.js.map