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

