const joi = require('joi')

exports.errorHandler = (err, req, res, next) => {

  let customError = err.message || 'some thing went wrong'

  if (joi.isError(err)) {
    customError = {}
    Object.values(err.details).forEach((error, ind) => {
      if (error.path[0] === "repeatPassword") {
        error.message = "passwords don't match"
      }
      customError[`${ind}`] = error.message
    })
  }

  if (err.message?.includes('user validation failed')) {
    customError = {}
    Object.values(err.errors).forEach(error => {
    })
  }

  if (err.code && err.code === 11000) {
    customError = 'this email is arleady registered'
  }
  res.status(400).json({
    state: "failed",
    error: customError
  })
}

