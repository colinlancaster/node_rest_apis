// This is an example of a blocking function
console.log('Before');

// this is an example of a callback function.
// when the result of this function is ready
// it will be displayed
getUser(1, getRepositories);
console.log('After');

function getRepositories(user) {
  getRepositories(user.gitHubUserName, getCommits);
}

function getCommits(repos) {
  getCommits(repo, displayCommits);
}

function displayCommits(commits) {
  console.log(commits);
}

function getUser(id, callback) {
  // This is an async or non-blocking function
  // Schedules a task to perform in the future.
  setTimeout(() => {
    console.log('Reading a user from DB...');
    callback({id: id, gitHubUserName: "colin"})
  }, 2000);
}

function getRepositories(username, callback) {
  setTimeout(() => {
    console.log('Getting the GitHub repos!');
    callback(['repo1', 'repo2' , 'repo3']);
  }, 2000);
}