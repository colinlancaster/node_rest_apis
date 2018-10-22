const mongoose = require('mongoose');

// Returns a promise
mongoose.connect('mongodb://localhost/playground2')
  // In real life, use the Debug module vs console.log()
  .then(() => console.log("Successfully connected to MongoDB..."))
  .catch(err => console.err('Could not connect to MongoDB...', err));

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
  },
  category: {
    type: String,
    enum: [ 'web', 'mobile' , 'network'], // when creating a course, the category set should be one of the preceding values.
    required: true,
    lowercase: true, // converts to lowercase, use one or the other
    uppercase: true, // converts to uppercase, use one or the other
    trim: true // removes paddings
  },
  author: String,
  tags: {
    type: Array,
    validate: {
      isAsync: true,
      validator: function(v, callback) {
        setTimeout(() => {
          // Do async work
          // When result ready...
          const result = v && v.length > 0;
          callback(result);
        }, 4000);
      },
      message: 'A course should at least one tag.'
    }
  },
  date: { type: Date, default: Date.now },
  isPublished: Boolean,
  price: {
    type: Number,
    required: function() { return this.isPublished; },
    min: 10,
    max: 200,
    get: v => Math.round(v),
    set: v => Math.round(v)
  }
});

// Create Course class
// Need to compile a schema into a model.
const Course = mongoose.model('Course', courseSchema);

async function createCourse() {
  const course = new Course({
    name: 'NodeJS Course',
    category: 'web',
    author: 'Colin Lancaster',
    tags: ['node', 'backend'],
    isPublished: true,
    price: 15.8
  });

  try {
    const result = await course.save();
    console.log(result);
  }
  catch (error) {
    for (field in error.errors) {
      console.log(error.errors[field].message);
    }
  }
}

// async function getCourses() {
//   const courses = await Course
//     .find({ author: 'Colin Lancaster', isPublished: true })
//     .limit(10)
//     .sort({ name: 1})
//     .select({ name: 1, tags: 1 });
//   console.log(courses);
// }

// Pagination example

async function getCourses() {

  // Test data
  const pageNumber = 2;
  const pageSize = 10;

  // This is how it works in the real world
  // /api/courses?pageNumber=2&pageSize=10

  const courses = await Course
    .find({ _id: '5bcd45ca49da513b7c6332fe'})
    // .skip((pageNumber - 1) * pageSize)
    // .limit(pageSize)
    .sort({ name: 1})
    .select({ name: 1, tags: 1, price: 1 });
  console.log(courses[0].price);
}

async function updateCourse(id) {
  const course = await Course.findByIdAndUpdate({ _id: id}, {
    $set: {
      author: "Jack London",
      isPublished: true
    }
  }, { new: true });
  console.log(course);
}

async function removeCourse(id) {
  // const result = await Course.deleteOne({ _id: id }); // Find the first course and delete
  // const result = await Course.deleteMany({ _id: id }); // Delete more than one course
  const course = await Course.findByIdAndRemove(id);

  console.log(course);
}


// removeCourse('5bc977db0188390970bdce60');
//createCourse();

getCourses();