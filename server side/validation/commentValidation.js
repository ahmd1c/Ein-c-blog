const joi = require("joi");
const asyncHandler = require("../utils/asyncHandler");

const commentValidation =  asyncHandler(async(req , res , next) => {
  const commentSchemaJoi = joi.object({
    message: 
    joi.string().required().trim().max(450)
  });

  const value =  await commentSchemaJoi.validateAsync(req.body, { abortEarly: false });
  if(value) return next()
});

module.exports = commentValidation;
