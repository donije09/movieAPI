const express = require('express');
const app = express();
const morgan = require('morgan');
const path = require('path');

// Middleware
app.use(morgan('common'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Serve the documentation.html file at the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'documentation.html'));
});

// In-memory data for movies
const movies = [
  {
    title: "The Enigma of Arrival",
    description: "A contemplative journey of self-discovery set against the backdrop of a mysterious island.",
    genre: "Drama",
    director: { name: "Isabella Greene", bio: "Bio1", birthYear: 1970, deathYear: null },
    imageURL: "https://upload.wikimedia.org/wikipedia/en/thumb/6/68/Arrival%2C_Movie_Poster.jpg/220px-Arrival%2C_Movie_Poster.jpg",
    featured: true
  },
  {
    title: "Space Crusaders",
    description: "An epic space adventure where a group of rebels fight to save their galaxy from an oppressive regime.",
    genre: "Sci-Fi",
    director: { name: "Jasper Roberts", bio: "Bio2", birthYear: 1975, deathYear: null },
    imageURL: "https://upload.wikimedia.org/wikipedia/en/thumb/7/7e/Guardians_of_the_Galaxy_poster.jpg/220px-Guardians_of_the_Galaxy_poster.jpg",
    featured: false
  },
  {
    title: "Mystery of the Lost City",
    description: "An archaeologist uncovers secrets of an ancient civilization that could change the world forever.",
    genre: "Adventure",
    director: { name: "Eleanor Smith", bio: "Bio3", birthYear: 1980, deathYear: null },
    imageURL: "https://upload.wikimedia.org/wikipedia/en/thumb/d/df/Tomb_Raider_%282018_film%29.png/220px-Tomb_Raider_%282018_film%29.png",
    featured: true
  },
  {
    title: "Haunted Whispers",
    description: "A family moves into an old mansion only to discover it's haunted by spirits with unfinished business.",
    genre: "Horror",
    director: { name: "David King", bio: "Bio4", birthYear: 1985, deathYear: null },
    imageURL: "https://upload.wikimedia.org/wikipedia/en/thumb/a/a3/The_Conjuring_2.jpg/220px-The_Conjuring_2.jpg",
    featured: false
  },
  {
    title: "The Last Symphony",
    description: "A renowned composer struggles to finish his final symphony while battling personal demons.",
    genre: "Drama",
    director: { name: "Maria Lopez", bio: "Bio5", birthYear: 1990, deathYear: null },
    imageURL: "https://upload.wikimedia.org/wikipedia/en/thumb/7/7a/Shine_%28movie_poster%29.jpg/220px-Shine_%28movie_poster%29.jpg",
    featured: true
  },
  {
    title: "Quantum Heist",
    description: "A team of thieves use advanced technology to pull off the ultimate heist in a parallel dimension.",
    genre: "Action",
    director: { name: "Liam Chen", bio: "Bio6", birthYear: 1995, deathYear: null },
    imageURL: "https://upload.wikimedia.org/wikipedia/en/thumb/e/ed/Ant-Man_%28film%29_poster.jpg/220px-Ant-Man_%28film%29_poster.jpg",
    featured: false
  },
  {
    title: "Romance in Paris",
    description: "Two strangers meet in the city of love and find themselves entangled in a whirlwind romance.",
    genre: "Romance",
    director: { name: "Sophie Dubois", bio: "Bio7", birthYear: 2000, deathYear: null },
    imageURL: "https://upload.wikimedia.org/wikipedia/en/thumb/d/db/Midnight_in_Paris_Poster.jpg/220px-Midnight_in_Paris_Poster.jpg",
    featured: true
  },
  {
    title: "Chasing Shadows",
    description: "A detective follows a trail of clues to uncover a dark conspiracy threatening the city.",
    genre: "Thriller",
    director: { name: "Michael Brown", bio: "Bio8", birthYear: 1965, deathYear: null },
    imageURL: "https://upload.wikimedia.org/wikipedia/en/thumb/4/48/Se7en_%28movie_poster%29.jpg/220px-Se7en_%28movie_poster%29.jpg",
    featured: false
  },
  {
    title: "The Great Bake-Off",
    description: "Bakers from around the world compete in a high-stakes baking competition.",
    genre: "Comedy",
    director: { name: "Olivia Johnson", bio: "Bio9", birthYear: 1988, deathYear: null },
    imageURL: "https://upload.wikimedia.org/wikipedia/en/thumb/6/69/Bake_Off_Cr%C3%A8me_de_la_Cr%C3%A8me.jpg/220px-Bake_Off_Cr%C3%A8me_de_la_Cr%C3%A8me.jpg",
    featured: true
  },
  {
    title: "Guardians of the Forest",
    description: "A young girl teams up with mystical creatures to save their forest home from destruction.",
    genre: "Fantasy",
    director: { name: "Arthur White", bio: "Bio10", birthYear: 1978, deathYear: null },
    imageURL: "https://upload.wikimedia.org/wikipedia/en/thumb/a/a7/FernGully_The_Last_Rainforest_Poster.jpg/220px-FernGully_The_Last_Rainforest_Poster.jpg",
    featured: false
  }
];

// Endpoint to return a list of all movies
app.get('/movies', (req, res) => {
  res.json(movies);
});

// Endpoint to return data about a single movie by title
app.get('/movies/:title', (req, res) => {
  const movie = movies.find(m => m.title === req.params.title);
  if (movie) {
    res.json(movie);
  } else {
    res.status(404).send('Movie not found');
  }
});

// Endpoint to return data about a genre by name
app.get('/genres/:name', (req, res) => {
  const genre = movies.find(m => m.genre === req.params.name);
  if (genre) {
    res.json({ description: genre.genre });
  } else {
    res.status(404).send('Genre not found');
  }
});

// Endpoint to return data about a director by name
app.get('/directors/:name', (req, res) => {
  const director = movies.find(m => m.director.name === req.params.name);
  if (director) {
    res.json(director.director);
  } else {
    res.status(404).send('Director not found');
  }
});

// Endpoint to allow new users to register
app.post('/users', (req, res) => {
  res.send('Successful POST request allowing a new user to register');
});

// Endpoint to allow users to update their user info (username)
app.put('/users/:username', (req, res) => {
  res.send(`Successful PUT request updating user info for ${req.params.username}`);
});

// Endpoint to allow users to add a movie to their list of favorites
app.post('/users/:username/movies/:movieID', (req, res) => {
  res.send(`Movie with ID ${req.params.movieID} added to ${req.params.username}'s favorites`);
});

// Endpoint to allow users to remove a movie from their list of favorites
app.delete('/users/:username/movies/:movieID', (req, res) => {
  res.send(`Movie with ID ${req.params.movieID} removed from ${req.params.username}'s favorites`);
});

// Endpoint to allow existing users to deregister
app.delete('/users/:username', (req, res) => {
  res.send(`User ${req.params.username} deregistered`);
});

// Error-handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the server
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
