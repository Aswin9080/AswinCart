

module.exports = (err, req, res, next) => {
       // Ensure that statusCode is set, defaulting to 500 if not set
       err.statusCode = err.statusCode || 500;
       console.log('---------------------')
       if (process.env.NODE_ENV == 'Development') {
              console.log("Error:", err);
              return res.status(err.statusCode).json({
                     success: false,
                     message: err.message,
                     stack: err.stack,
                     error: err,
              });
       }


       if (process.env.NODE_ENV == 'Production') {

              let message = err.message;
              let error = new Error(message)

              if (err.name == 'ValidationError') {
                     message = Object.values(err.errors).map(value => value.message)
                     error = new Error(message)
               
                     console.log('error',error)
                     err.statusCode = 400
              }

              if (err.name == 'CastError') {
                     message = `Resolve not found ${err.path}`
                     error = new Error(message)
                     err.statusCode = 400
              }

              if (err.code == '11000') {
                     message = `Duplicate ${Object.keys(err.keyValue)} error`
                     error = new Error(message)
                     err.statusCode = 400
              }

              if (err.name == 'JSONWebTokenError') {
                     let message = `JSON Web Token is invalid. Try again`;
                     error = new Error(message)
                     err.statusCode = 400
              }

              if (err.name == 'TokenExpiredError') {
                     let message = `JSON Web Token is expired. Try again`;
                     error = new Error(message)
                     err.statusCode = 400
              }


              console.log('error', error)

              res.status(err.statusCode).json({
                     sucess: false,
                     message: error.message || 'internal server error',
              })
       }

}