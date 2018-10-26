const Joi = require('joi');
const mongoose = require('mongoose');


const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  }
});
// You can create the schema from within the model
// Or you can store the model in a const
const Genre = mongoose.model('Genre', genreSchema);

function validateGenre(genre) {
  // Validate
  // If invalid, return 400 - Bad Req
  const schema = {
    name: Joi.string().min(3).required()
  };

  return Joi.validate(genre, schema);
}

exports.genreSchema = genreSchema;
exports.Genre = Genre;
exports.validate = validateGenre;