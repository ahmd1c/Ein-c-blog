const joi = require("joi");
const asyncHandler = require("../utils/asyncHandler");

const postValidation =  asyncHandler(async(req , res , next) => {
  const postSchemaJoi = joi.object({
    title: 
    joi.string().required().trim().min(5).max(500),
    description : 
    joi.string().required().trim().min(5).max(1000),
    subject: 
    joi.string().required().min(25),
    postPhoto : joi.any()
  });

  const value =  await postSchemaJoi.validateAsync(req.body, { abortEarly: false });
  if(value) return next()
});

module.exports = postValidation;
