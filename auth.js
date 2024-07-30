const passport = require('passport');
const jwt = require('jsonwebtoken');
const { User } = require('./models');

require('./passport'); // Ensure passport strategies are loaded

const jwtSecret = 'your_jwt_secret'; // Replace with your actual secret

const generateJWTToken = (user) => {
  return jwt.sign(user, jwtSecret, {
    subject: user.username,
    expiresIn: '7d',
    algorithm: 'HS256'
  });
};

module.exports = (app) => {
  app.post('/login', (req, res) => {
    passport.authenticate('local', { session: false }, (error, user, info) => {
      if (error || !user) {
        return res.status(400).json({
          message: 'Something is not right',
          user: user
        });
      }
      req.login(user, { session: false }, (err) => {
        if (err) {
          res.send(err);
        }
        const token = generateJWTToken(user.toJSON());
        return res.json({ user, token });
      });
    })(req, res);
  });
};