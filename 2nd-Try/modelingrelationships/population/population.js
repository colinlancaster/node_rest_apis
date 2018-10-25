const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/playground')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

const Author = mongoose.model('Author', new mongoose.Schema({
  name: String,
  bio: String,
  website: String
}));

const Course = mongoose.model('Course', new mongoose.Schema({
  name: String,
  author: {
    type: mongoose.Schema.Types.ObjectId, // This is how Mongoose knows it should query the Author collection in MongoDob.
    ref: 'Author'
  }
}));

async function createAuthor(name, bio, website) {
  const author = new Author({
    name,
    bio,
    website
  });

  const result = await author.save();
  console.log(result);
}

async function createCourse(name, author) {
  const course = new Course({
    name,
    author
  });

  const result = await course.save();
  console.log(result);
}

async function listCourses() {
  const courses = await Course
    .find()
    .populate('author', 'name -_id') // This causes the console to output actual data about the author. 2nd prop specifies the props you want to return. -_id excludes the _id prop.
    .populate('category', 'name')
    .select('name author');
  console.log(courses);
}

// createAuthor('Colin', 'My bio', 'My Website');

// createCourse('Test', '5bcff3b80a23120e9080c84c')

listCourses();