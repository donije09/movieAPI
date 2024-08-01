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

// Middleware
app.use(morgan('common'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(passport.initialize()); // Initialize passport middleware
// Connect to MongoDB
mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Use the auth routes
auth(app);

app.get("/", (req, res) => {
  res.send("Welcome to MyFlix");
});

// Routes
app.get('/movies', async (req, res) => {
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

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(500).send('Something broke!');
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
