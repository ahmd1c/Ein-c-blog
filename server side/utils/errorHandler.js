const joi = require('joi')

exports.errorHandler = (err , req , res , next)=>{

  let customError = err.message || 'some thing went wrong' 
    
  if(joi.isError(err)){
    customError = {}
      Object.values( err.details ).forEach((error,ind)=>{
        if(error.path[0]==="repeatPassword"){
          error.message = "passwords don't match"
        }
        customError[`${ind}`] = error.message
    })
  }

  if(err.message?.includes('user validation failed')){
      customError = {}
      Object.values( err.errors ).forEach(error=>{
      })
  }

  if( err.code && err.code===11000){
      customError = 'this email is arleady registered'
  }
  console.log(err);
  console.log('wwwwwhhhhy');
  res.status(400).json({
    state : "failed" ,
    error : customError
  })
}




// error handler from net ninja

// handle errors
const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = { email: "", password: "" };
  
    // duplicate email error
    if (err.code === 11000) {
      errors.email = "that email is already registered";
      return errors;
    }
  
    // validation errors
    if (err.message.includes("user validation failed")) {
      // console.log(err);
      Object.values(err.errors).forEach(({ properties }) => {
        // console.log(val);
        // console.log(properties);
        errors[properties.path] = properties.message;
      });
    }
  
    return errors;
  };
  