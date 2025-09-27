// utils/validators.js
const { param, body } = require("express-validator");
const mongoose = require("mongoose");

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

const idParamValidator = [
  param("id")
    .custom((value) => isValidObjectId(value))
    .withMessage("Invalid product ID format"),
];

const bulkIdsValidator = [
  body("productIds")
    .isArray({ min: 1 })
    .withMessage("productIds must be a non-empty array"),
  body("productIds.*")
    .custom((value) => isValidObjectId(value))
    .withMessage("Each productId must be a valid MongoDB ObjectId"),
];

module.exports = {
  idParamValidator,
  bulkIdsValidator,
};
