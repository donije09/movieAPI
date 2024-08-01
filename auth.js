const passport = require('passport');
const jwt = require('jsonwebtoken');
const { User } = require('./models');

const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret'; // Use environment variable

module.exports = function(app) {
  // Sign-up route
  app.post('/signup', async (req, res) => {
    try {
      const { username, password, email, birthday } = req.body;
      const user = new User({ username, password, email, birthday });
      await user.hashPassword(); // Hash the password before saving
      await user.save();
      res.status(201).send(user);
    } catch (err) {
      console.error('Error signing up:', err);
      res.status(500).send('Internal server error');
    }
  });

  // Login route
  app.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).json(info);
      }
      req.logIn(user, { session: false }, (err) => {
        if (err) {
          return next(err);
        }
        const token = jwt.sign(user.toJSON(), jwtSecret, { expiresIn: '1h' });
        res.json({ token });
      });
    })(req, res, next);
  });

  // Middleware to check if user is authenticated
  app.use(passport.authenticate('jwt', { session: false }));
};
