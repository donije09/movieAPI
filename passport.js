const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const { User } = require('./models');

passport.use(new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password'
}, async (username, password, callback) => {
  try {
    const user = await User.findOne({ username: username });
    if (!user) {
      console.error('User not found');
      return callback(null, false, { message: 'Incorrect username or password.' });
    }

    if (!user.validatePassword(password)) {
      console.error('Incorrect password');
      return callback(null, false, { message: 'Incorrect username or password.' });
    }

    return callback(null, user);
  } catch (err) {
    console.error('Error finding user:', err);
    return callback(err);
  }
}));

const jwtSecret = 'your_jwt_secret';
passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtSecret
}, async (jwtPayload, callback) => {
  try {
    const user = await User.findById(jwtPayload._id);
    return callback(null, user);
  } catch (err) {
    return callback(err);
  }
}));