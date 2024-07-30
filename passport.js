const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require('passport-jwt');

const { User } = require('./models');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

passport.use(new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password'
}, (username, password, callback) => {
  User.findOne({ username: username }, (error, user) => {
    if (error) {
      console.error(error);
      return callback(error);
    }

    if (!user) {
      console.log('Incorrect username');
      return callback(null, false, { message: 'Incorrect username.' });
    }

    if (!user.validatePassword(password)) {
      console.log('Incorrect password');
      return callback(null, false, { message: 'Incorrect password.' });
    }

    console.log('Finished');
    return callback(null, user);
  });
}));

passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}, (jwtPayload, callback) => {
  return User.findById(jwtPayload.id)
    .then((user) => {
      return callback(null, user);
    })
    .catch((error) => {
      return callback(error);
    });
}));
