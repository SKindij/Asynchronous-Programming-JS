// ! run and check each example in the console separately

// sample 1
const bar = () => console.log('bar')
const baz = () => console.log('baz')
const foo = () => {
  console.log('foo')
  setTimeout(bar, 0)
  baz()
}
foo()

(function () {
  console.log('start');
  setTimeout(function callback() {
    console.log('message from callback');
  });
  console.log('message');
  setTimeout(function callback_1() {
    console.log('message from callback_1');
  }, 0);
  console.log('finish');
})();








