const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs')
const _ = require('lodash');
const { User, validate } = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();


router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user._id).select('-password'); // -password excludes the password
  res.send(user);
});

// GET /api/genres
router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email }); // Look up the user by email.
  if (user) return res.status(400).send('User already registered.');

  user = new User(_.pick(req.body, ['name', 'email', 'password']));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const token = user.generateAuthToken();
   // replaces the manual calling of user.name & user.email
   // 'x-auth-token is an arbitrary header name.
   res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
});



module.exports = router;