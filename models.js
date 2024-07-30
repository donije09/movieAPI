const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  favoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }] // Optional: if you track favorite movies
});

// Method to hash the password
userSchema.statics.hashPassword = function(password) {
  return bcrypt.hashSync(password, 12);
};

// Method to validate the password
userSchema.methods.validatePassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

const User = mongoose.model('User', userSchema);

// Movie model (assuming it exists)
const movieSchema = new mongoose.Schema({
  // Your movie schema definition here
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = { User, Movie };
