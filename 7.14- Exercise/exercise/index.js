const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/mongo-exercises')
  .then(() => console.log('Successful connection to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

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
    .find({ isPublished: true, tags: 'backend' }) // must be published AND be about backend dev
    .sort({ name: 1 }) // Sort them by name
    .select({ name: 1, author: 1 }) // Pick only their name and author only
}

async function run() {
  const courses = await getCourses();
  console.log(courses);
}
// Display them
run();
