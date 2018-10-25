const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/playground')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

const authorSchema = new mongoose.Schema({
  name: String,
  bio: String,
  website: String
});

const Author = mongoose.model('Author', authorSchema);

const Course = mongoose.model('Course', new mongoose.Schema({
  name: String,
  authors: [authorSchema]
}));

async function createCourse(name, authors) {
  const course = new Course({
    name,
    authors
  });

  const result = await course.save();
  console.log(result);
}

async function listCourses() {
  const courses = await Course.find();
  console.log(courses);
}

async function updateAuthor(courseId) {
  // const course = await Course.findById(courseId);
  const course = await Course.update({ _id: courseId }, {
    // $set also works
    $unset: {
      'author': ''
    }
  });
  // course.author.name = 'Colin Lancaster Yo';
  // course.save();
}

async function addAuthor(courseId, author) {
  const course = await Course.findById(courseId);
  course.authors.push(author);
  course.save();
}
// createCourse('Node Course 2', [
//   new Author({name: 'Colin'}),
//   new Author({name: 'James'}),
//   new Author({name: 'Lancaster'})
// ]);

async function removeAuthor(courseId, authorId) {
  const course = await Course.findById(courseId);
  const author = course.authors.id(authorId);
  author.remove();
  course.save();
}

removeAuthor("5bcffd82bd19462a80cd8873", "5bcffd82bd19462a80cd8872");
// addAuthor("5bcffd82bd19462a80cd8873", new Author({ name: 'Amy'}));

//updateAuthor('5bcff7ff6228171370330106');
