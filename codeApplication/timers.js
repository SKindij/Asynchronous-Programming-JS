'use strict';

const sleep = (msec) => {
  const end = new Date().getTime() + msec;
  while (new Date().getTime() < end);
};
console.log('Start sleep: ' + new Date().toISOString());
console.log('  Sleep about 3 sec');
sleep(3000);
console.log('After sleep: ' + new Date().toISOString());

