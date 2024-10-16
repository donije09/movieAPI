//require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const path = require('path');
const passport = require('passport');
const cors = require('cors');
const { Movie, User } = require('./models'); // Adjusted to match models.js filename
const auth = require('./auth'); // Correctly import auth.js
require('./passport'); // Ensure passport strategies are loaded
const app = express();

/**
 * @description Middleware setup
 * @module middleware
 */
app.use(morgan('common'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(passport.initialize()); // Initialize passport middleware
/**
 * @description Connect to MongoDB
 * @module database
 */
mongoose.connect(process.env.CONNECTION_URI, {serverSelectionTimeoutMS: 5000 })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

/**
 * @description Initialize authentication routes
 */
auth(app);
/**
 * @description Default route for the API
 * @route GET /
 * @returns {string} Welcome message
 */
app.get("/", (req, res) => {
  res.send("Welcome to MyFlix");
});

/**
 * @description Get a list of all movies
 * @route GET /movies
 * @access Protected
 * @returns {Array} List of movies
 */
app.get('/movies', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (err) {
    console.error('Error fetching movies:', err);
    res.status(500).send('Internal server error');
  }
});
/**
 * @description Get details of a specific movie by title
 * @route GET /movies/:title
 * @param {string} title - The title of the movie to retrieve
 * @access Protected
 * @returns {Object} Movie details
 */
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
/**
 * @description Get movies of a specific genre
 * @route GET /genres/:name
 * @param {string} name - The name of the genre to retrieve
 * @access Protected
 * @returns {Object} Genre details
 */
app.get('/genres/:name', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const movies = await Movie.find({ genre: req.params.name });
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
/**
 * @description Get movies by a specific director
 * @route GET /directors/:name
 * @param {string} name - The name of the director to retrieve
 * @access Protected
 * @returns {Object} Director details
 */
app.get('/directors/:name', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const movies = await Movie.find({ director: req.params.name });
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
/**
 * @description Register a new user
 * @route POST /users
 * @param {Object} req.body - The user data (username, password, email, birthday)
 * @returns {Object} The created user
 */
app.post('/users', async (req, res) => {
  try {
    const { username, password, email, birthday } = req.body;
    const user = new User({ username, password, email, birthday });
    await user.hashPassword(); // Hash the password before saving
    await user.save();
    res.status(201).send(user);
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).send('Internal server error');
  }
});
/**
 * @description Update a user's information
 * @route PUT /users/:username
 * @param {string} username - The username to update
 * @param {Object} req.body - The new user data
 * @returns {Object} Updated user data
 * @access Protected
 */
app.put('/users/:username', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { username: req.params.username },
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
/**
 * @description Add a movie to a user's favorites
 * @route POST /users/:username/movies/:movieId
 * @param {string} username - The username to update
 * @param {string} movieId - The ID of the movie to add to favorites
 * @returns {Object} Updated user data with the movie added to favorites
 * @access Protected
 */
app.post('/users/:username/movies/:movieId', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { username: req.params.username },
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
/**
 * @description Remove a movie from a user's favorites
 * @route DELETE /users/:username/movies/:movieId
 * @param {string} username - The username to update
 * @param {string} movieId - The ID of the movie to remove from favorites
 * @returns {Object} Updated user data without the movie in favorites
 * @access Protected
 */
app.delete('/users/:username/movies/:movieId', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { username: req.params.username },
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
/**
 * @description Delete a user
 * @route DELETE /users/:username
 * @param {string} username - The username of the user to delete
 * @returns {Object} Deleted user data
 * @access Protected
 */
app.delete('/users/:username', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ username: req.params.username });
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.json(user);
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).send('Internal server error');
  }
});

/**
 * @description Error handler middleware
 * @param {Object} err - The error object
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 */
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(500).send('Something broke!');
});
/**
 * @description Start the server
 * @param {number} port - The port number for the server
 */
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

