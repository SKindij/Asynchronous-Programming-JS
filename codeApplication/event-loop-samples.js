// ! run and check each example in the console separately

// sample 1
const bar = () => console.log('bar')
const baz = () => console.log('baz')
const foo = () => {
  console.log('foo')
  setTimeout(bar, 0)
  baz()
}
foo()    // in turn => foo => baz => bar

// sample 2
(function () {
  console.log('start');          // => 1st
  setTimeout(function callback() {
    console.log('message from callback');  // => 4th
  });
  console.log('message');        // => 2nd
  setTimeout(function callback_1() {
    console.log('message from callback_1');  // => 5th
  }, 0);
  console.log('finish');            // => 3rd
})();








