const os = require('os');

var totalMemory = os.totalmem();
var freeMemory = os.freemem();

console.log(`Total memory is ${totalMemory}.`);
console.log(`Free memory is ${freeMemory}.`);