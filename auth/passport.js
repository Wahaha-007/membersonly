//js
const bcrypt = require("bcryptjs");
LocalStrategy = require("passport-local").Strategy;

//Load model
const User = require("../models/user");

const loginCheck = passport => {
  // 1. Setting up strategy
  // 1.1 Function One
  passport.use(
    new LocalStrategy((username, password, done) => {
      User.findOne({ username: username }, (err, user) => {
        if (err) {
          console.log('Error1');
          return done(err);
        }
        if (!user) {
          console.log('Error2');
          return done(null, false, { message: "Incorrect username" });
        }

        bcrypt.compare(password, user.password, (err, res) => {
          if (res) {
            console.log('Error3');
            // passwords match! log user in
            return done(null, user)
          } else {
            console.log('Error4');
            // passwords do not match!
            return done(null, false, { message: "Incorrect password" })
          }
        })
      });
    })
  );

  // 1.2 Function Two
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // 1.3 Function Three
  passport.deserializeUser((id, done) => {
    User.findById(id, (error, user) => {
      done(error, user);
    });
  });
};
module.exports = {
  loginCheck,
};