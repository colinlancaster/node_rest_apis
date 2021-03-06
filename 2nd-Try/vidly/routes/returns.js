// POST /api/returns {customerId, movieId}
const express = require('express');
const moment = require('moment');
const router = express.Router();
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const Joi = require('joi');
const {Rental} = require('../models/rental');
const {Movie} = require('../models/movie');

// GET /api/genres
// Come back and refactor the validation
// for each route
router.post('/', [auth, validate(validateReturn)], async (req, res) => {
  const rental = await Rental.lookup(req.body.customerId, req.body.movieId);

  if (!rental) return res.status(404).send('Rental not found!');

  if (rental.dateReturned) return res.status(400).send('Return already processed');

  rental.return();

  await rental.save();

  await Movie.update({ _id: rental.movie._id }, {
    $inc: { numberInStock: 1 }
  });

  return res.send(rental);
});

function validateReturn(req) {
  // Validate
  // If invalid, return 400 - Bad Req
  const schema = {
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  };

  return Joi.validate(req, schema);
}

module.exports = router;