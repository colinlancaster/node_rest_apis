const mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/playground'); // references local mongodb installation. will need to be updated IRL.


mongoose.connect('mongodb://localhost/playground')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

  // Once we have a schema...
const courseSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    minlength: 5 ,
    maxlength: 255
    // match: /pattern/
  }, // This is an example of validation
  category: {
    type: String,
    required: true,
    enum: ['web', 'mobile', 'network'],
    lowercase: true,
    // uppercase: true,
    trim: true
  },
  author: String,
  // tags: [ String ],
  tags: {
    type: Array,
    validate: {
      isAsync: true,
      validator: function(v, callback) {
        // Do some async work
        setTimeout(() => {
          const result = v && v.length > 0;
          callback(result);
        }, 4000);
      },
      message: 'A course should have at least one tag'
    }
  },
  date: { type: Date, default: Date.now },
  isPublished: Boolean,
  price: {
    type: Number,
    required: function() { return this.isPublished },
    min: 10,
    max: 200,
    get: v => Math.round(v),
    set: v => Math.round(v),
  }
});
const Course = mongoose.model('Course', courseSchema); // Remember this is a class

async function createCourse() {
  const course = new Course({
    name: 'Angular Course',
    author: 'Colin',
    tags: ['Frontend'],
    isPublished: true,
    category: 'web',
    price: 15.87
  }); // Remember this is an object

  try {
    const result = await course.save();
    console.log(result);

  } catch (error) {
    // console.log(error.message);
    for (field in error.errors) {
      console.log(error.errors[field])
    }
    error.errors.tags;
  }

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
    // .find({ isPublished: true })
    .find({ _id: "5b83738a8c09363f4825ce09"})
    .sort({ name: 1 })
    .select({ name: 1, tags: 1, price: 1 });
    // .skip((pageNumber -1) * pageSize)
    // .limit(pageSize)
    // .sort( { name: 1 } ) // Sort by name
    // .select({ name: 1, tags: 1 })
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

// Approach 1: Query first
  // findById()
  // Modify Properties
  // save()
  // This is common
// async function updateCourse(id) {
//   const course = await Course.findById(id);
//   if (!course) return 'No course available with that ID.';

//   course.isPublished = true;
//   course.author = 'Another author';
//   // This is an identical approach to the above two lines
//   // course.set({
//   //   isPublished: true,
//   //   author: 'Another Author'
//   // });

//   const result = await course.save();
//   console.log(result);
// }
// updateCourse('5b70ad753806173e885d6a22');


// Approach 2: Update first
// Update directly to DB
// Optionally: get update document.
// we are focusing on 2

// async function updateCourse(id) {
//   const result = await Course.update({_id: id}, {
//     $set: {
//       author: 'Colin',
//       isPublished: false
//     }
//   });
//   console.log(result);
// }

// This is a way of simplifying the above

async function updateCourse(id) {
  const course = await Course.findByIdAndUpdate(id, {
    $set: {
      author: 'Bo Jackson',
      isPublished: false
    }
  }, {new: true});
}

updateCourse('5b70ad753806173e885d6a22');

async function removeCourse(id) {
  const result = await Course.deleteOne({ _id: id }); // use deleteMany to delete...well...many
  console.log(result);
}

// removeCourse('5b70ad753806173e885d6a22');

// createCourse();
// createCourse();
getCourses();
