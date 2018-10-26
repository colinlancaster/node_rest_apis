# Mongo/Mongoose Instructions

* Run app with `nodemon index.js` in the terminal.
* `npm i mongoose` or `npm i mongoose@5.0.1` for Mosh's tutorial.
* There are multipe data types you can save in MongoDB:
  *  String
  *  Number
  *  Date
  *  Buffer
  *  Boolean
  *  ObjectID
  *  Array

Start with a Schema

```
 const courseSchema = new mongoose.Schema({
  name: String,
  author: String,
  tags: [ String ],
  date: { type: Date, default: Date.now },
  isPublished: Boolean
});
```

Then, compile schemas into models.

```
const Course = mongoose.model('Course', courseSchema);
```

Now, create an object using the Course class.

```
const course = new Course({
  name: 'NodeJS Course',
  author: 'Colin Lancaster',
  tags: ['node', 'backend'],
  isPublished: true
});
```

Finally, save a course to the database.

```
async function createCourse() {
  const course = new Course({
    name: 'VueJS Course',
    author: 'Colin Lancaster',
    tags: ['vue', 'frontend']
  });

  const result = await course.save();
  console.log(result);
}

createCourse();
```

> Any time you use a method that returns a promise, `await` the promise.

### Filtering

Here is a basic example of filtering: 
```
async function getCourses() {
  const courses = await Course
    .find({ author: 'Colin Lancaster' , isPublished: true }) // Looking for courses with me as the author
    .limit(10) // Limit to 10 please
    .sort({ name: 1}) // 1 indicates ascending order, for descending us -1
    .select({ name: 1, tags: 1 });
  console.log(courses);
}

getCourses();
```

Mongo/Mongoose Operators

```
// eq = equal
  ne  = not equal
  gt = greater than
  gte = greater than or equal to
  lt = lesser than
  lte = less than or equal to
  in
  nin = not in
```

> `.find({ price: { $gt: 10 } }) // find records with a price > 10`

> `.find({ price: { $in: [10, 15, 20] } }) // If price is 10 or 15 or 20, return the Course obj.`

Chain `.find()` and `or()` together. This will give you logical operators. Works with `and()` as well.
```
  .find()
  .or([ { author: 'Colin' }, { isPublished: true } ]) // Pass an array of objects.
  .and([ { author: 'Colin' }, { isPublished: true } ]) // Pass an array of objects
```

LOOK! You can use REGEX too

`.find({ author: /^Colin/ }) // Starts with Colin`

`.find({ author: /Colin$/ }) // Ends with Lancaster`

`.find({ author: /Colin$/i }) // Ends with Lancaster. Case insensitive.`

`.find({ author: /.*Colin.*/ }) // Contains 'Colin'`

Chaining `.count()` to your query will return the count of items in the DB.

### Updating Documents

You can update documents using two different approaches







**Approach #1: Query First**

1. `findbyId()`
2. `Modify its props`
3. `save()`

```
async function updateCourse(id) {
  const course = await Course.findById(id);
  if (!course) return; // Small error checking

  course.isPublished = true;
  course.author = 'Another Author';

  const result = await course.save();
  console.log(result);
}

updateCourse('5bc977db0188390970bdce60'); // Use an ID directly from Compass
```

**Approach #2: Update First**

1. `Update directly`
2. `Optionally: get the updated document`

```
async function updateCourse(id) {
  const course = await Course.findById(id);
  if (!course) return; // Small error checking

  course.set({
    isPublished: true,
    author: 'Another Author'
  });
}

updateCourse();
```

```
async function updateCourse(id) {
  const result = await Course.update({ _id: id}, {
    $set: {
      author: "Yo Yo Ma",
      isPublished: false
    }
  });
  console.log(result);
}
```

### Deleting Documents

```
async function removeCourse(id) {
  // const result = await Course.deleteOne({ _id: id }); // Find the first course and delete. This works if you pass something like `{ isPublished: true}`. Not sure how practical this is, but it was the given example.

  // const result = await Course.deleteMany({ _id: id }); // Delete more than one course

  const course = await Course.findByIdAndRemove(id); // Find a course by id and remove it

  console.log(course);
}

removeCourse('5bc977db0188390970bdce60');
```

### Data Validation

To make a field required, pass an object to the value like so

```
const courseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  author: String,
  tags: [ String ],
  date: { type: Date, ndefault: Date.now },
  isPublished: Boolean,
  price: Number
});
```

```
Promises can be in 1 of 3 states:

1. Pending
2. Fulfilled
3. Rejected

```

Ensure that you are wrapping your promise object result in a trycatch block like so

```
try {
    const result = await course.save();
    console.log(result);
  }
catch (error) {
  console.log(error.message);
}
```

Use JOI validation on your REST APIs to make sure the data that the client is sending is valid.

Use Mongoose validation to make sure that the data you send to the database is in valid shape.

Validators specific to Strings:

1. `minlength`
2. `maxlength`
3. `match`
4. `enum`

For Numbers

1. `min`
2. `max`

Required if this.isPublished = true.

`required: function() { return this.isPublished; }`

Custom validators

```
const courseSchema = new mongoose.Schema({
  // ...
  tags: {
    type: Array,
    validate: {
      isAsync: true,
      validator: function(v, callback) {
        setTimeout(() => {
          const result = v && v.length > 0;
          callback(result);
        }, 4000);
      },
      message: 'A course should at least one tag.'
    }
  },
  // ...
});
```

```
category: {
    type: String,
    enum: [ 'web', 'mobile' , 'network'], // when creating a course, the category set should be one of the preceding values.
    required: true,
    lowercase: true // mongoose automatically converts the value of the category prop to lower case
  },
```

```
price: {
    type: Number,
    required: function() { return this.isPublished; },
    min: 10,
    max: 200,
    get: v => Math.round(v),
    set: v => Math.round(v)
  }
```

Stick this somewhere else later...
```
// NOTE THE FOLLOWING CODE BLOCK PRODUCES THE SAME RESULT
  // AS THE ONE THAT IS NOT COMMENTED OUT.
  // This is the basic idea of input validation on a REST API
  // However, in the real world, we work with significantly more
  // complex objects. That's where the NPM package Joi comes into play
  // const schema = {
  //   name: Joi.string().min(3).required()
  // };
  // const result = Joi.validate(req.body, schema);
  // if(result.error){
  //   res.status(400).send(result.error.details[0].message);
  //   return;
  // }
```

## Modeling Relationships

There are two approaches to working with relationships in MongoDB. Choosing the approach is a trade off between query performance and consistency.

**Approach #1**

Using References (Normalization)

* Approach #1 employes consistency. It uses a single place to define the author.
* All courses that are referencing the author will immediately see the updated author.
* However, every time you query the course you have to also query the related author.
* Sometimes that might be a big deal.


**Approach #2**

Using Embedded Documents (Denormalization)

* Approach #2 employes query performance. If your queries need to run as fast as possible use Embedded Documents
* The author is already inside the course document.
* However, with this approach if you decide to change the name property, there are likely multiple courses where you will have to update.
* It is possible that you will have some course documents that are not updated. You might end up with inconsistent data.

*

## Object ID

The MongoDB Driver itself generates a 12 byte _id.
Mongoose is an abstraction over the MongoDB driver.

```
const mongoose = require('mongoose');

const id = new mongoose.Types.ObjectId();

console.log(id);
console.log(id.getTimestamp());

// Checks if the given ID is valid.
const isValid = mongoose.Types.ObjectId.isValid('1234');
console.log(isValid);

```