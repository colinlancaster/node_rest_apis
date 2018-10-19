
const EventEmitter = require('events');
const emitter = new EventEmitter();

var url = 'https://mylogger.io/log';

class Logger extends EventEmitter {
  // don't need function keyword
  log(message) {
    // Send HTTP request
    console.log(message);

    // Pass the name of the event
    // Use this because Logger extends EventEmitter
    this.emit('messageLogged', { id: 1, url: url}) // Raises an event! Makes a noise.
  }
}

module.exports = Logger;
