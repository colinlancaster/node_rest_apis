// This entire file is known as the Request Pipeline

// Joi returns a class, so use Pascal casing
const Joi = require('joi');
const express = require('express');
const genres = require('./routes/genres');
const home = require('./routes/home');
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded()); //key=value&key=value.
app.use('/api/genres', genres);
app.use('/', home);

// PORT
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}!`));