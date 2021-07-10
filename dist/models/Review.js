"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ReviewSchema = new mongoose_1.default.Schema({
    cafe: {
        type: mongoose_1.default.SchemaTypes.ObjectId,
        ref: "Cafe",
        required: true
    },
    user: {
        type: mongoose_1.default.SchemaTypes.ObjectId,
        ref: "User",
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    created_at: {
        type: Date,
        required: true
    },
    updated_at: {
        type: Date
    },
    imgs: {
        type: [String]
    },
    recommend: {
        type: [Number]
    },
    content: {
        type: String,
        required: true
    }
}, {
    collection: "reviews",
    versionKey: false
});
exports.default = mongoose_1.default.model("Review", ReviewSchema);
//# sourceMappingURL=Review.js.map