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
  const course = new Course({
    name: 'Angular Course',
    author: 'Colin',
    tags: ['angular', 'frontend'],
    isPublished: true
  }); // Remember this is an object

  const result = await course.save();
  console.log(result);

}

async function getCourses() {
  // Mongoose comparison operators
  // eq (equal)
  // ne (not equal)
  // gt (greater than)
  // gte (greater than or equal to)
  // lt (less than)
  // lte (less than or equal to)
  // in
  // nin (not in)

  // Logical operators
  // or
  // and

  const pageNumber = 2;
  const pageSize = 10;

  // /api/courses?pageNumber=2&pageSize=10

  const courses = await Course
    .find({ author: 'Colin', isPublished: true })
    .skip((pageNumber -1) * pageSize)
    .limit(pageSize)
    .sort( { name: 1 } ) // Sort by name
    .select({ name: 1, tags: 1 })
    //.find({ author: 'Colin', isPublished: true }) // This is a 'filter'
    // .find({price: 10})
    // .find({price: { $gte: 10 }}) // greater than 10
    // .find({price: { $gte: 10, $lte: 20 }}) // In between 10 and 20
    // .find({price: { $in: [10, 15, 20 ]} })
    // .find()
    // .or([{author: 'Colin'}, { isPublished: true}]) // each obj is a filter
    // .and([{}, {}])
    // starts with Colin
    // .find({author: /^Colin/i }) // ^ = starts with reg ex. /i = case insensitive
    // .find({author: /Lancaster$/i }) // ends with Lancaster. i = case insensitive
    // // Contains Colin
    // .find({author: /.*Colin.*/}) // 0 or more chars before or after Colin
    // .find()
    // .limit(10)
    // .sort({ name: 1 })
    // .count();
  console.log(courses);
}

getCourses();
