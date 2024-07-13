const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the schema for Movies
const movieSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  genre: {
    name: { type: String, required: true },
    description: { type: String, required: true }
  },
  director: {
    name: { type: String, required: true },
    bio: { type: String, required: true },
    birthYear: Number,
    deathYear: Number
  },
  imageUrl: String,
  featured: Boolean
});

// Define the schema for Users
const userSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  birthDate: Date,
  favoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
});

// Create the models
const Movie = mongoose.model('Movie', movieSchema);
const User = mongoose.model('User', userSchema);

// Export the models
module.exports = { Movie, User };
