const express = require('express');
const error = require('../middleware/error');
const genres = require('../routes/genres');
const customers = require('../routes/customers');
const movies = require('../routes/movies');
const rentals = require('../routes/rentals');
const auth = require('../routes/auth');
const users = require('../routes/users');
const home = require('../routes/home');
const returns = require('../routes/returns');

module.exports = function(app) {
  // Middleware
  app.use(express.json());
  // app.use(express.urlencoded()); //key=value&key=value.
  app.use('/api/genres', genres);
  app.use('/api/customers', customers);
  app.use('/api/movies', movies);
  app.use('/api/rentals', rentals);
  app.use('/api/returns', returns);
  app.use('/api/users', users);
  app.use('/api/auth', auth);
  app.use('/', home);

app.use(error);
}