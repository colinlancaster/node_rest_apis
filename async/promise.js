// A Promise is an object that holds the eventual result of an asynchronous operation
// Can be in one of three states:
//  * Pending
//  * Fulfilled
//  * Rejected

const p = new Promise((resolve, reject) => {
  // Kick off some async work
  // ...
  // Return a value or error
  // Return to the consumers of the Promise.
  setTimeout( () => {
    // resolve(1);
    reject(new Error('Something happened!'));
  }, 2000);
});

p
  .then(result => console.log('Result', result))
  .catch(err => console.log('Error', err.message));