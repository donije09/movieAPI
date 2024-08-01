 const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const { User } = require('./models');

passport.use(new LocalStrategy({
  usernameField: 'name',
  passwordField: 'password'
}, async (name, password, done) => {
  try {
    const user = await User.findOne({ name });
    if (!user) {
      return done(null, false, { message: 'Incorrect username.' });
    }
    const isValid = await user.validatePassword(password);
    if (!isValid) {
      return done(null, false, { message: 'Incorrect password.' });
    }
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

const jwtSecret = 'your_jwt_secret'; // Replace with your actual secret

passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtSecret
}, (jwtPayload, done) => {
  return User.findById(jwtPayload._id)
    .then(user => {
      return done(null, user);
    })
    .catch(err => {
      return done(err);
    });
}));
 
