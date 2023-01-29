# Asynchronous programming
JavaScript is single-threaded: only one task can run at a time :turkey:. 
Browser gives us a Web API :lollipop: (DOM, setTimeout, HTTP requests, and so on). This can help us create some async, non-blocking behavior :eagle:. 

``
const foo = () => console.log("First: foo");  
const bar = () => setTimeout(() => console.log("Second: bar"), 500);\
const baz = () => console.log("Third: baz");<br>
	foo();     bar();     baz(); 
``

When we invoke a function, it gets added to the call stack :waffle: (part of the JS engine, this isn’t browser specific) - meaning that it’s first in, last out. When a function returns a value, it gets popped off the stack.

The setTimeout lets us delay tasks without blocking the main thread. In the Web API, a timer runs for as long as the second argument we passed to it.
The callback doesn’t immediately get added to the call stack, instead it’s passed to the queue.
 If the call stack is empty (all previously invoked functions have returned their values and have been popped off the stack), the first item in the queue gets added to the call stack. 

Привет,
мир!

Привет,<пробел><пробел>
пробел!

Привет,\
косая черта!

Привет,<br>
тег бр-р-р!

