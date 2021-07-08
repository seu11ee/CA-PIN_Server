"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const CategorySchema = new mongoose_1.default.Schema({
    cafes: {
        type: [mongoose_1.default.SchemaTypes.ObjectId],
        ref: "Cafe",
        required: true
    },
    user: {
        type: mongoose_1.default.SchemaTypes.ObjectId,
        ref: "User",
        required: true
    },
    color: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    isDefault: {
        type: Boolean,
        required: true
    }
}, {
    collection: "category"
});
exports.default = mongoose_1.default.model("Category", CategorySchema);
//# sourceMappingURL=Category.js.map