const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const path = require('path');
const { Movie, User } = require('./models'); // Ensure models are imported correctly

const app = express();


app.use(morgan('common'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect('mongodb://localhost:27017/movieDB', { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'documentation.html'));
});


app.get('/movies', async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Get a movie by title
app.get('/movies/:title', async (req, res) => {
  try {
    const movie = await Movie.findOne({ title: req.params.title });
    res.json(movie);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Get genre data by name
app.get('/genres/:name', async (req, res) => {
  try {
    const movies = await Movie.find({ 'genre.name': req.params.name });
    const genre = movies[0]?.genre;
    res.json(genre);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Get director data by name
app.get('/directors/:name', async (req, res) => {
  try {
    const movies = await Movie.find({ 'director.name': req.params.name });
    const director = movies[0]?.director;
    res.json(director);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Register a new user
app.post('/users', async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).send(newUser);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Update user info
app.put('/users/:username', async (req, res) => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { username: req.params.username },
      { $set: req.body },
      { new: true }
    );
    res.json(updatedUser);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Add a movie to user's favorites
app.post('/users/:username/movies/:movieId', async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { username: req.params.username },
      { $addToSet: { favoriteMovies: req.params.movieId } },
      { new: true }
    );
    res.json(user);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Remove a movie from user's favorites
app.delete('/users/:username/movies/:movieId', async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { username: req.params.username },
      { $pull: { favoriteMovies: req.params.movieId } },
      { new: true }
    );
    res.json(user);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Deregister a user
app.delete('/users/:username', async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ username: req.params.username });
    res.json(user);
  } catch (err) {
    res.status(500).send(err);
  }
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});


const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
