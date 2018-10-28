const bcrypt = require('bcryptjs');

// To hash a password, you need a salt.

// 1234 -> abcd

async function run() {
  
  console.log(salt);
  console.log(hashed);
}

try {
  run();
} catch (error) {
  console.log(error);
}