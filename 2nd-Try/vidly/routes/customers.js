const { Customer, validate } = require('../models/customer');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

// GET /api/customers/
router.get('/', async (req, res) => {
  const customers = await Customer.find().sort('name');
  res.send(customers);
});

// POST /api/customers/
router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let customer = new Customer({
    name: req.body.name,
    phone: req.body.phone,
    isGold: req.body.isGold
  });

  customer = await customer.save();

  res.send(customer);
});

// PUT /api/customers/:id
router.put('/:id', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findByIdAndUpdate(req.params.id, { name: req.body.name, phone: req.body.phone }, { new: true });

  if (!customer) return res.status(404).send("The customer with the given ID was not found!");

  // Update customer
  res.send(customer); // Return the updated customer
});

// PUT /api/customers/:id
router.delete('/:id', async (req, res) => {
  const customer = await Customer.findByIdAndRemove(req.params.id);
  // If it doesn't exist, return 404
  if (!customer) return res.status(404).send("The customer with the given ID was not found!");

  res.send('The following customer was deleted.' + customer);
});

// GET SPECIFIC /api/customers/:id
router.get('/:id', async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) return res.status(404).send('The customer with the given ID cannot be found.');
  res.send(customer);
});

module.exports = router;