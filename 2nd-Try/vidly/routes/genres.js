const { Genre, validate } = require('../models/genre');
const express = require('express');
const router = express.Router();

// GET /api/genres
router.get('/', async (req, res) => {
  const genres = await Genre.find().sort('name');
  res.send(genres);
});

// POST /api/genres
router.post('/', async (req, res) => {
  const { error } = validate(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  let genre = new Genre({ name: req.body.name });

  genre = await genre.save();
  res.send(genre);
});

// PUT /api/genres
router.put('/:id', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name },
    {
      new: true
    });

  if (!genre) return res.status(404).send("The genre with the given ID was not found!");

  // Update genre
  res.send(genre); // Return the updated genre
});

// DELETE /api/genres/:id
router.delete('/:id', async (req, res) => {

  const genre = await Genre.findByIdAndRemove(req.params.id);
  // If it doesn't exist, return 404
  if (!genre) return res.status(404).send("The genre with the given ID was not found!");

  res.send('The following genre was deleted.' + genre);
});

// GET SPECIFIC /api/genres/:id
router.get('/:id', async (req, res) => {
  const genre = await Genre.findById(req.params.id);
  if (!genre) return res.status(404).send('The genre with the given ID cannot be found.');
  res.send(genre);
});

module.exports = router;