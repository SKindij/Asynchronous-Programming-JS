'use strict';
// if we want to make a certain time delay

// As long as the cycle while "spins", nothing can happen in the program.
const delay = (msec) => {
	console.log(`  Wait about ${msec/1000} sec`);
	const end = new Date().getTime() + msec;
	while (new Date().getTime() < end);
};
console.log('Start delay: ' + new Date().toISOString());
delay(5000);
console.log('End of waiting: ' + new Date().toISOString());





