const mongoose = require('mongoose');

// Returns a promise
mongoose.connect('mongodb://localhost/playground2')
  // In real life, use the Debug module vs console.log()
  .then(() => console.log("Successfully connected to MongoDB..."))
  .catch(err => console.err('Could not connect to MongoDB...', err));

const courseSchema = new mongoose.Schema({
  name: String,
  author: String,
  tags: [ String ],
  date: { type: Date,ndefault: Date.now },
  isPublished: Boolean
});

// Create Course class
// Need to compile a schema into a model.
const Course = mongoose.model('Course', courseSchema);

async function createCourse() {
  const course = new Course({
    name: 'NodeJS Course',
    author: 'Colin Lancaster',
    tags: ['node', 'backend'],
    isPublished: true
  });
  const result = await course.save();
  console.log(result);
}

// createCourse();

async function getCourses() {


  const courses = await Course
    //.find({ author: 'Colin Lancaster' , isPublished: true }) // Filter query
    // .find({ price: { $gt: 10 } }) // find records with a price > 10
    .find({ price: { $in: [10, 15, 20] } }) // If price is 10 or 15 or 20, return the Course obj.
    .limit(10)
    // Sort DocumentQuery object by name
    .sort({ name: 1}) // 1 indicates ascending order, for descending use -1
    .select({ name: 1, tags: 1 }); // Select the props you want to be returned
  console.log(courses);
}

getCourses();



