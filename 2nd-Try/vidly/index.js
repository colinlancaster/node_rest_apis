// This entire file is known as the Request Pipeline
const winston = require('winston');
const express = require('express');
const app = express();

require('./startup/logging')(); // logging should come first.
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config')();
require('./startup/validation')();

const port = process.env.PORT || 3000;
app.listen(port, () => winston.info(`Listening on port ${port}...`));