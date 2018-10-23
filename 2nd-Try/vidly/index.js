// This entire file is known as the Request Pipeline

const mongoose = require('mongoose');
const express = require('express');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const home = require('./routes/home');
const app = express();


mongoose.connect('mongodb://localhost/vidly')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err = console.error('Could not connect to MongoDB'));

// Middleware
app.use(express.json());
app.use(express.urlencoded()); //key=value&key=value.
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/', home);

// PORT
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}!`));