import jwt from "jsonwebtoken";
import config from "../config";
import createError from "http-errors";
const responseMessage = require("../modules/responseMessage");
const statusCode = require("../modules/statusCode");

export default (req, res, next) => {
  // Get token from header
  const token = req.header("token");
  // Check if not token
  if (!token) {
    next(createError(statusCode.BAD_REQUEST,responseMessage.NO_TOKEN))
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, config.jwtSecret);

    res.locals.tokenValue = token;
    res.locals.userId = decoded.sub;
    // req.body.user = decoded.user;
    next();
  } catch (err) {
    next(createError(statusCode.UNAUTHORIZED,responseMessage.EXPIRED_TOKEN));
  }
};