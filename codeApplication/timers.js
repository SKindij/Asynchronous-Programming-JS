'use strict';
// if we want to make a certain time delay

// EXAMPLE 1
// As long as the cycle while "spins", nothing can happen in the program.
const delay = (msec) => {
	console.log(`  Wait about ${msec/1000} sec`);
	const end = new Date().getTime() + msec;
	while (new Date().getTime() < end);
};
console.log('Start delay: ' + new Date().toISOString());
delay(5000);
console.log('End of waiting: ' + new Date().toISOString());

// EXAMPLES 2 & 3
// the timer delays the resolution of the promise
const delay = (msec) => new Promise((resolve) => {
  console.log(`  Wait about ${msec/1000} sec`);
  setTimeout(resolve, msec);
});
// we run the version with IIFE (Immediately Invoked Function Expression)
(async () => {
  console.log('Start delay: ' + new Date().toISOString());
  await delay(5000);
  console.log('End of waiting: ' + new Date().toISOString());
})();
// we run the version with .then()
console.log('Start delay: ' + new Date().toISOString());
delay(5000).then(() => { console.log('End of waiting: ' + new Date().toISOString()); });

