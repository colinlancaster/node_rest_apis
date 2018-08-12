function log (req, res, next) {
  console.log("Logging...");
  // Passes control to the next Middleware function
  next();
}

module.exports = log;
