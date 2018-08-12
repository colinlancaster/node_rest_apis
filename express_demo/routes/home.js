const express = require('express');

const router = express.Router(); // NOTE that you have to work with the Router here not the standard =App

router.get('/', (req, res) => {
  res.render('index', {title: 'My Express App', message: 'Hello'});
});

module.exports = router;