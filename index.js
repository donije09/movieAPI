require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const path = require('path');
const passport = require('passport');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { Movie, User } = require('./models');
const auth = require('./auth'); // Correctly import auth.js
require('./passport'); // Ensure passport strategies are loaded
const User = require('./models/user');
const app = express();

app.use(morgan('common'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Use the auth routes
auth(app);

app.get("/", (req, res) => {
  res.send("Welcome to MyFlix");
});

// Define all other routes
app.get('/movies', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (err) {
    console.error('Error fetching movies:', err);
    res.status(500).send('Internal server error');
  }
});

app.get('/movies/:title', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const movie = await Movie.findOne({ title: req.params.title });
    if (!movie) {
      return res.status(404).send('Movie not found');
    }
    res.json(movie);
  } catch (err) {
    console.error('Error fetching movie by title:', err);
    res.status(500).send('Internal server error');
  }
});

app.get('/genres/:name', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const movies = await Movie.find({ 'genre.name': req.params.name });
    if (movies.length === 0) {
      return res.status(404).send('Genre not found');
    }
    const genre = movies[0].genre;
    res.json(genre);
  } catch (err) {
    console.error('Error fetching genre:', err);
    res.status(500).send('Internal server error');
  }
});

app.get('/directors/:name', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const movies = await Movie.find({ 'director.name': req.params.name });
    if (movies.length === 0) {
      return res.status(404).send('Director not found');
    }
    const director = movies[0].director;
    res.json(director);
  } catch (err) {
    console.error('Error fetching director:', err);
    res.status(500).send('Internal server error');
  }
});

app.post('/users', async (req, res) => {
  try {
    const hashedPassword = await User.hashPassword(req.body.password); // Assume hashPassword is async
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      favoriteMovies: req.body.favoriteMovies || []
    });
    await newUser.save();
    res.status(201).send(newUser);
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).send('Internal server error');
  }
});
app.post('/users', async (req, res) => {
  try {
    // Validate the incoming request data
    const { name, email, password, favoriteMovies } = req.body;
    if (!name || !email || !password) {
      return res.status(400).send('Name, email, and password are required');
    }

    // Check for an existing user with the same email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).send('Email already in use');
    }

    // Hash the password
    const hashedPassword = await User.hashPassword(password);

    // Create a new user instance
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      favoriteMovies: favoriteMovies || []
    });

    // Save the user to the database
    await newUser.save();

    // Send the created user as a response
    res.status(201).send(newUser);
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).send('Internal server error');
  }
});


app.put('/users/:name', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { name: req.params.name },
      { $set: req.body },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).send('User not found');
    }
    res.json(updatedUser);
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).send('Internal server error');
  }
});

app.post('/users/:name/movies/:movieId', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { name: req.params.name },
      { $addToSet: { favoriteMovies: req.params.movieId } },
      { new: true }
    );
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.json(user);
  } catch (err) {
    console.error('Error adding movie to favorites:', err);
    res.status(500).send('Internal server error');
  }
});

app.delete('/users/:name/movies/:movieId', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { name: req.params.name },
      { $pull: { favoriteMovies: req.params.movieId } },
      { new: true }
    );
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.json(user);
  } catch (err) {
    console.error('Error removing movie from favorites:', err);
    res.status(500).send('Internal server error');
  }
});

app.delete('/users/:name', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ name: req.params.name });
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.json(user);
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).send('Internal server error');
  }
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(500).send('Something broke!');
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
