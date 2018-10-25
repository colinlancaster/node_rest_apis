// Approach #1 - Normalization

let author = {
  name: 'Colin'
}


let course = {
  author: 'id', // This  is a reference to the `author` id
  // You can do this to
  // authors: [
  //   '',
  //   ''
  // ]
}

// Approach #2 - Denormalization

let course = {
  author: {
    name: 'Colin'
  }
}

// Choosing the approach is a trade off between query performance and consistency.

// Approach #1 employes consistency. It uses a single place to define the author.
// All courses that are referencing the author will immediately see the updated author.
// However, every time you query the course you have to also query the related author.
// Sometimes that might be a big deal.

// Approach #2 employes query performance. If your queries need to run as fast as possible use Embedded Documents
// The author is already inside the course document.
// However, with this approach if you decide to change the name property, there are likely multiple courses where you will have to update.
// It is possible that you will have some course documents that are not updated. You might end up with inconsistent data.


// Hybrid

// If you want to have a snapshot of your data at a given point in time, this approach will be very helpful.

let author = {
  name: 'Mosh'
  // 50 other props
}

let course = {
  author: {
    id: 'ref', // Ref to author document
    name: 'Colin'
  }
}