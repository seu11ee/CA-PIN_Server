"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const CategoryColorSchema = new mongoose_1.default.Schema({
    color_id: {
        type: Number,
        required: true,
        unique: true
    },
    color_code: {
        type: String,
        required: true,
        unique: true
    },
}, {
    collection: "category_colors",
    versionKey: false
});
exports.default = mongoose_1.default.model("CategoryColor", CategoryColorSchema);
//# sourceMappingURL=CategoryColor.js.map