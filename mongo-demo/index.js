const mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/playground'); // references local mongodb installation. will need to be updated IRL.


mongoose.connect('mongodb://localhost/playground')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

  // Once we have a schema...
const courseSchema = new mongoose.Schema({
  name: String,
  author: String,
  tags: [ String ],
  date: { type: Date, default: Date.now },
  isPublished: Boolean
});

// ... We need to compile it into model.
const Course = mongoose.model('Course', courseSchema); // Remember this is a class

async function createCourse() {
  try {
    const course = new Course({
      name: 'Angular Course',
      author: 'Colin',
      tags: ['angular', 'frontend'],
      isPublished: true
    }); // Remember this is an object

    const result = await course.save();
    console.log(result);
  } catch (error) {
      console.log('Error', error)
  }
}

async function getCourses() {
  const courses = await Course
    .find({ author: 'Colin', isPublished: true }) // This is a 'filter'
    .limit(10)
    .sort({ name: 1 })
    .select({ name: 1, tags: 1});
  console.log(courses);
}

getCourses();
