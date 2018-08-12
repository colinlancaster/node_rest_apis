// THIS IS YOUR EXPRESS PIPELINE

// Joi returns a class, so use Pascal casing
const Joi = require('joi');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan'); // Fantastic logger middleware
const logger = require('./middleware/logger');
const config = require('config');
const courses = require('./routes/courses');
const home = require('./routes/home');
const startupDebugger = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db');


const app = express();

// NOTE: To changeenvironment variable to production run the following command in terminal
// export NODE_ENV=production
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`app: ${app.get('env')}`);

// Set view engine

app.set('view engine', 'pug');
app.set('views', './views'); // Default location of templates or views. This is default so you don't need to set it. But this is how you do, just in case you want the templates in a new location.

// MIDDLEWARE
app.use(express.json());
// Extended: true makes it possible to send complex objects in the url.
app.use(express.urlencoded({ extended: true })); // key=value&key=value
app.use(express.static('public')); // Note that this content is served from the root of the site.
app.use(helmet()); // Secures your app with special headers
app.use(logger);
app.use('/api/courses', courses); // For any route that starts with /api/courses, use the courses module
app.use('/', home);
// END MIDDLEWARE


// CONFIGURATION
// console.log('Application Name: ' + config.get('name'));
// console.log('Mail Server Name: ' + config.get('mail.host'));
// console.log('Mail Server Password: ' + config.get('mail.password'));\
if (app.get('env') === 'development'){
  app.use(morgan('tiny')); // Fantastic logger
  startupDebugger('Morgan enabled');
}
// END CONFIGURATION
// DB work...

dbDebugger("Connected to DB");

// PORT
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}!`));