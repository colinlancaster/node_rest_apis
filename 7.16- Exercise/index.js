// Get all the published courses that are $15 or more

// or have the word "by" in their title

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/mongo-exercises')
  .then(() => console.log('Successfull connection to MongoDB...'))
  .catch( err => console.error('Could not connect to MongoDB...'))

const courseSchema = new mongoose.Schema({
  name: String,
  author: String,
  tags: [ String ],
  date: { type: Date, default: Date.now },
  isPublished: Boolean,
  price: Number
});

const Course = mongoose.model('Course', courseSchema);

async function getCourses() {
  return courses = await Course
    .find({ isPublished: true }) // Get all published courses
    .or([
      { price: { $gte: 15 }},
      { name: /.*by.*/i}
    ])
    .sort('-price')
    .select('name author price'); // Pick only their name and author only
}

async function run() {
  const courses = await getCourses();
  console.log(courses);
}
// Display them
run();
