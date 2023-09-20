const joi = require("joi");
const asyncHandler = require("../utils/asyncHandler");

exports.signUpValidation = asyncHandler(async(req , res , next) => {
  const signUpSchemaJoi = joi.object({
  
    name: joi.string().required().alphanum().trim().min(3).max(15),

    password: joi.string().required().min(8).pattern(new RegExp("^[a-zA-Z0-9]{8,64}$"))
      .messages({
        'string.min' : "password must be at least 8 characters",
        'string.pattern.base' : "invalid password"
      }),
      
    repeatPassword: joi.ref('password'),

    email: joi.string().required().trim().email({ minDomainSegments: 2 }),

  });

  const value =  await signUpSchemaJoi.validateAsync(req.body, { abortEarly: false });
  if(value) return next()
});

exports.signInValidation = asyncHandler(async(req , res , next) => {
  const signInSchemaJoi = joi.object({
  
    password: joi.string().required().min(8).max(64).pattern(new RegExp("^[a-zA-Z0-9]{8,64}$"))
      .messages({
        'string.min' : "password must be at least 8 characters",
        'string.pattern.base' : "invalid password"
      }),
      

    email: joi.string().required().trim().email({ minDomainSegments: 2 }),

  });

  const value =  await signInSchemaJoi.validateAsync(req.body, { abortEarly: false });
  if(value) return next()
})

exports.updateProfileValidation = asyncHandler(async(req , res , next) => {
  const updateProfileSchemaJoi = joi.object({
  
    name: joi.string().alphanum().trim().min(3).max(15).optional(),

    bio :  joi.string().alphanum().trim().min(8).max(800).optional(),

    image : joi.any().optional()


  });

  const value =  await updateProfileSchemaJoi.validateAsync(req.body, { abortEarly: false });
  if(value) return next()
})

exports.changePasswordValidation = asyncHandler(async(req , res , next) => {
  const changePasswordSchemaJoi = joi.object({
  
    currentPassword: joi.string().required().min(8).pattern(new RegExp("^[a-zA-Z0-9]{8,64}$"))
    .messages({
      'string.min' : "password must be at least 8 characters",
      'string.pattern.base' : "invalid password"
    }),
    
    newPassword: joi.string().required().min(8).pattern(new RegExp("^[a-zA-Z0-9]{8,64}$"))
      .messages({
        'string.min' : "password must be at least 8 characters",
        'string.pattern.base' : "invalid password"
      }),
      
    repeatNewPassword: joi.ref('newPassword'),

  });

  const value =  await changePasswordSchemaJoi.validateAsync(req.body, { abortEarly: false });
  if(value) return next()

})