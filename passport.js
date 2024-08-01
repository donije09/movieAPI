/* const passport = require('passport');
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
 */
const passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  Models = require('./models.js'),
  passportJWT = require('passport-jwt');
//LocalStrategy takes a username and password from the request body and uses Mongoose to check your database for a user with the same username. Password is not checked here. 


let Users = Models.User,
  JWTStrategy = passportJWT.Strategy,
  ExtractJWT = passportJWT.ExtractJwt;

passport.use(
  new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
    },
    async (username, password, callback) => {
      console.log(`${username} ${password}`);
      await Users.findOne({username: username })
      .then((user) => {
        if (!user) {
          console.log('incorrect username');
          return callback(null, false, {
            message: 'Incorrect username or password.'
          });
        }
        if (!user.validatePassword(password)) {
          console.log('incorrect password');
          return callback(null, false, { message: 'Incorrect password.' });
        }
        console.log('finished');
        return callback(null, user);
      })
      .catch((error) => {
        if (error) {
          console.log(error);
          return callback(error);
        }
      })
    }
  )
);

// if (!user.validatePassword(password)) Hash any password entered by the user when logging in before comparing it to the password stored in MongoDB (user.validatePassword(password)) in LocalStrategy within your “passport.js” file).


passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'your_jwt_secret'
}, async (jwtPayload, callback) => {
  return await Users.findById(jwtPayload._id)
    .then((user) => {
      return callback(null, user);
    })
    .catch((error) => {
      return callback(error)
    });
}));

// In this code, two Passport strategies are defined. The first one, called “LocalStrategy,” defines your basic HTTP authentication for login requests. LocalStrategy takes a username and password from the request body and uses Mongoose to check your database for a user with the same username—keep in mind that the password doesn't get checked here. You'll be working on that in the next Exercise. If there’s a match, the callback function will be executed (this will be your login endpoint, which you’ll be exploring further in the next section).

// If an error occurs, or if the username can’t be found within the database, an error message is passed to the callback:

// return callback(null, false, { message: 'Incorrect username.' })

// Setting up the JWT authentication code is a bit more complicated. This strategy is called, appropriately, “JWTStrategy,” and it allows you to authenticate users based on the JWT submitted alongside their request. In the code above, the JWT is extracted from the header of the HTTP request. This JWT is called the “bearer token” (you’ll see how this bearer token is submitted in a bit):

// jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),

// You also need to use a “secret” key to verify the signature of the JWT. As mentioned earlier, this signature verifies that the sender of the JWT (the client) is who it says it is—and also that the JWT hasn’t been altered.

// secretOrKey : 'your_jwt_secret'

// With your JWT code set up, you can now use JWT authentication for the rest of the endpoints in your API. When registered users want to read movie data, for example, you can write logic that will authenticate them based on the JWT submitted in their GET requests.