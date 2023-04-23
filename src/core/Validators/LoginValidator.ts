const { body, checkSchema, validationResult } = require("express-validator");
const userModel = require("../../Models/User");
const loginSchema: any = {
  email: {
    isString: {
      errorMessage: "userName must be an string",
    },
    notEmpty: {
      errorMessage: "Fill the username",
    },
  },
  password: {
    isString: {
      errorMessage: "userName must be an string",
    },
    notEmpty: {
      errorMessage: "Fill the username",
    },
  },
};
export default loginSchema;

//  }

// }),
// body("email")
// .isEmail()
// .normalizeEmail()
// .notEmpty()
// .withMessage("Fill the email")
// .custom((value) => {
//   return userModel
//     .find({
//       email: value,
//     })
//     .then((user: any) => {
//       if (user.length > 0) {
//         throw "email is taken!"; //custom error message
//       }
//     });
// }),
// body("password")
// .isLength({
//   min: 6,
// })
// .notEmpty()
// .withMessage("Fill the email")
// // }}
