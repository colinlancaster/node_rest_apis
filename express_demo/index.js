// THIS IS YOUR EXPRESS PIPELINE

// Joi returns a class, so use Pascal casing
const Joi = require('joi');
const express = require('express');
const app = express();

const logger = require('./logger');

// Middleware
app.use(express.json());

app.use(logger);

const courses = [
  {id: 1, name:"course1"},
  {id: 2, name:"course2"},
  {id: 3, name:"course3"},

];
app.get('/', (req, res) => {
  res.send('Hello World!!!!!!!');
});

app.get('/api/courses', (req, res) => {
  res.send(courses);
});

// /api/courses/1

app.get('/api/courses/:id', (req, res) => {
  const course = courses.find(course => course.id === parseInt(req.params.id));
  if (!course) {
    res.status(404).send("The course with the given ID was not found!")
  } else {
      res.send(course)
  }
});

app.post('/api/courses', (req, res) => {

  // This is the basic idea of input validation on a REST API
  // However, in the real world, we work with significantly more
  // complex objects. That's where the NPM package Joi comes 
  // into play

  const schema = {
    name: Joi.string().min(3).required()
  };
  const result = Joi.validate(req.body, schema);
  if(result.error){
    res.status(400).send(result.error.details[0].message);
    return;
  }

  // if (!req.body.name || req.body.name.length < 3) {
  //   // 400 Bad Request
  //   res.status(400).send('Name is required, and should be a minimum of 3 characters');
  //   // This is the same thing as `break;`.
  //   // We don't want the rest of the function to be executed.
  //   return;
  // }
  const course = {
    id: courses.length + 1,
    name: req.body.name
  };

  courses.push(course);
  res.send(course);
});

app.put('/api.courses/:id', (req, res) => {
  // Look up course

  // If !course - return 404
  const course = courses.find(course => course.id === parseInt(req.params.id));
  if (!course) {
    res.status(404).send("The course with the given ID was not found!")
  } else {
      res.send(course)
  }

  // Validate
  // If invalid, return 400 - Bad Req

  // Update course
  // Return the updated course
});



// PORT
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}!`));