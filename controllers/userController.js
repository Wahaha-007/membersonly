const passport = require("passport");
const User = require('../models/user');
const Message = require('../models/message');
const bcrypt = require("bcryptjs");

// Date Validation
const { body, validationResult } = require('express-validator');

// Handle user create on GET
exports.user_signup_get = (req, res) => {
  res.render('signup', { title: 'Sign Up' });
};

// Handle user create on POST
exports.user_signup_post = [

  // Validate and sanitize fields.

  body('first_name', 'First name required').trim().isLength({ min: 1 }).escape(),
  body('last_name', 'Last name required').trim().isLength({ min: 1 }).escape(),
  body('username', 'User name required').trim().exists().escape(),
  body('password', 'Password required').trim().exists(),
  body('confirmPassword', 'Passwords do not match').trim().exists()
    .custom((value, { req }) => value === req.body.password),

  // Process request after validation and sanitization.
  (req, res, next) => {

    const status_codes = ['Guest', 'Regular', 'Member', 'Admin'];
    let status_member = req.body.refer;

    console.log(req.body.refer);

    if (status_codes.indexOf(status_member) == -1) { // Here, we use Referal code as the User type
      status_member = 'Guest';
    }

    // Extract the validation errors from a request.
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      // res.render('vendor_form', { title: 'Create Vendor', vendor: req.body, errors: errors.array() });
      res.redirect('/signup');
      return;
    }
    else {

      // Data from form is valid.
      bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {

        if (err) { // hash error
          return next(err);
        }
        else {
          const user = new User(
            {
              first_name: req.body.first_name,
              last_name: req.body.last_name,
              username: req.body.username,
              password: hashedPassword,
              status: status_member,
              avatar: 0,
            }).save(err => {
              if (err) {
                return next(err); // DB save error
              }
              res.redirect("/login");
            });
        }
      });
    }
  }
];


// Handle user login on GET
exports.user_login_get = (req, res) => {
  res.render('login', { title: 'Log In' });
};

// Handle user login on POST

// 0. Wrong coding, passport.authenticate returns FUNCTION ! 
// exports.user_login_post = (req, res, next) => {

//   console.log('user_login_post');
//   // 1.4 Implement passport strategy starts here
//   passport.authenticate("local", {
//     successRedirect: "/",
//     failureRedirect: "/"
//   })
// }

// 1. Correct way 1 : Really invoke function 
//    From https://stackoverflow.com/questions/20626183/more-passport-js-woes-hangs-on-form-submission

// exports.auth = function (req, res, next) {
//   console.log(req.body);
//   passport.authenticate('local', {
//     successRedirect: '/home',
//     failureRedirect: '/',
//     failureFlash: true
//   })(req, res, next);  // <-- NEED TO INVOKE WITH req, res, next
// };

// 2. Correct way 2 : Supply only function as varibale to user.get
exports.user_login_post = passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/'
});

// Handle user logout on GET
exports.user_logout_get = (req, res) => {
  req.logout();
  res.redirect("/");
}

