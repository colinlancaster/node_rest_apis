const express = require('express');
const router = express.Router();

const genres = [
  {id: 1, genreName:"Comedy"},
  {id: 2, genreName:"Horror"},
  {id: 3, genreName:"Action"},
];

router.get('/', (req, res) => {
  res.send(genres);
});

// /api/courses/1

router.get('/:id', (req, res) => {
  const genre = genres.find(genre => genre.id === parseInt(req.params.id));
  if (!genre) {
    res.status(404).send("The genre with the given ID was not found!");
    return;
  } else {
      res.send(genre)
  }
});

router.post('/', (req, res) => {

  // NOTE THE FOLLOWING CODE BLOCK PRODUCES THE SAME RESULT
  // AS THE ONE THAT IS NOT COMMENTED OUT.
  // This is the basic idea of input validation on a REST API
  // However, in the real world, we work with significantly more
  // complex objects. That's where the NPM package Joi comes into play
  // const schema = {
  //   name: Joi.string().min(3).required()
  // };
  // const result = Joi.validate(req.body, schema);
  // if(result.error){
  //   res.status(400).send(result.error.details[0].message);
  //   return;
  // }

  const result = validateGenres(req.body);

  if(result.error){
    return res.status(400).send(result.error.details[0].message);
  }

  // if (!req.body.name || req.body.name.length < 3) {
  //   // 400 Bad Request
  //   res.status(400).send('Name is required, and should be a minimum of 3 characters');
  //   // This is the same thing as `break;`.
  //   // We don't want the rest of the function to be executed.
  //   return;
  // }
  const genre = {
    id: genres.length + 1,
    genreName: req.body.genreName
  };

  genres.push(genre);
  res.send(genre);
});

router.put('/:id', (req, res) => {
  // Look up genre
  const genre = genres.find(genre => genre.id === parseInt(req.params.id));
  if (!genre) { // If !genre - return 404
    // Send a 404 error
    return res.status(404).send("The genre with the given ID was not found!");
  }

  const result = validateGenres(req.body);

  if(result.error){
    return res.status(400).send(result.error.details[0].message);
  }

  // Update genre
  genre.genreName = req.body.genreName;
  res.send(genre); // Return the updated genre
});

router.delete('/:id', (req, res) => {
  // Look up genre
  const genre = genres.find(genre => genre.id === parseInt(req.params.id));
  // If it doesn't exist, return 404
  if (!genre) { // If !genre - return 404
    // Send a 404 error
    return res.status(404).send("The genre with the given ID was not found!");
  }

  const index = genres.indexOf(genre);
  genres.splice(index, 1);

  res.send(genre);
});

function validateGenres(genre) {
  // Validate
  // If invalid, return 400 - Bad Req
  const schema = {
    genreName: Joi.string().min(3).required()
  };

  return Joi.validate(genre, schema);
}


module.exports = router;