# MovieAPI

MovieAPI is a RESTful API built with Node.js and Express, providing a comprehensive backend service for a movie app. 
The API enables users to access information about movies, directors, and genres, as well as manage user registrations and login functionalities.

## Features

- User Registration: Sign up with a username, email, and password.
- User Authentication: Login and manage session tokens using JWT.
- Fetch Movies: Retrieve detailed information about movies, directors, and genres.
- Add/Remove Favorites: Users can manage their favorite movies.
- Update User Info: Users can update their profile information.
- Delete User: Users can delete their accounts.

## Technologies

- Node.js
- Express.js
- MongoDB
- JWT (JSON Web Token) for authentication
- Mongoose for object data modeling

## Endpoints

- **POST** `/users` - Register a new user.
- **POST** `/login` - User login and token generation.
- **GET** `/movies` - Get a list of all movies.
- **GET** `/movies/:title` - Get data about a single movie.
- **GET** `/genres/:name` - Get information about a genre.
- **GET** `/directors/:name` - Get information about a director.
- **POST** `/users/:username/movies/:movieId` - Add a movie to user's favorites.
- **DELETE** `/users/:username/movies/:movieId` - Remove a movie from user's favorites.
- **PUT** `/users/:username` - Update user information.
- **DELETE** `/users/:username` - Delete a user account.

## Installation

1. Clone the repo: 
```bash
git clone https://github.com/donije09/movieAPI.git
