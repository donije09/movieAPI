const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define the User schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  birthday: {
    type: Date
  },
  favoriteMovies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie'
  }]
});

// Method to hash password before saving
userSchema.methods.hashPassword = async function() {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
};

// Method to validate password
userSchema.methods.validatePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

// Create the User model
const User = mongoose.models('User', userSchema);

// Define the Movie schema
const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  year: {
    type: Number,
    required: true
  },
  director: {
    type: String,
    required: true
  },
  genre: {
    type: [String], // Array of strings
    required: true
  },
  rating: {
    type: Number,
    required: true
  },
  actors: {
    type: [String], // Array of strings
  },
  description: {
    type: String
  }
});

// Create the Movie model
const Movie = mongoose.models('Movie', movieSchema);

module.exports = { User, Movie };
