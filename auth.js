const jwtSecret = 'your_jwt_secret';
const jwt = require('jsonwebtoken');
const passport = require('passport');
require('./passport'); // Include local passport file

const express = require('express');
const router = express.Router();

router.post('/login', (req, res) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) {
      console.error('Authentication error:', err);
      return res.status(400).json({
        message: 'Something is not right',
        error: err
      });
    }

    if (!user) {
      console.error('User not found or incorrect password:', info);
      return res.status(400).json({
        message: 'Something is not right',
        info: info
      });
    }

    req.login(user, { session: false }, (err) => {
      if (err) {
        console.error('Login error:', err);
        res.send(err);
      }

      const token = jwt.sign(user.toJSON(), jwtSecret, {
        expiresIn: '1h'
      });

      return res.json({ user, token });
    });
  })(req, res);
});

module.exports = router;