"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express")); // [1]
const app = express_1.default(); // [2]
const db_1 = __importDefault(require("./loader/db"));
const config_1 = __importDefault(require("./config"));
// Connect Database
db_1.default();
app.use(express_1.default.json()); // [3]
// Define Routes
app.use("/cafes", require("./api/cafes")); // [4]
app.use("/user", require("./api/user"));
app.use("/reviews", require("./api/reviews"));
app.use("/category", require("./api/category"));
app.use("/cafeti", require("./api/cafeti"));
app.use("/geocoder", require("./api/geocoder"));
// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "production" ? err : {};
    // render the error page
    res.status(err.status || 500).json({
        message: err.message
    });
});
app // [5]
    .listen(config_1.default.port, () => {
    console.log(`
    ################################################
    🛡️  Server listening on port: 5000 🛡️
    ################################################
  `);
})
    .on("error", (err) => {
    console.error(err);
    process.exit(1);
});
//# sourceMappingURL=index.js.map