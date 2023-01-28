# Asynchronous programming
JavaScript is single-threaded: only one task can run at a time. 😬
Browser gives us a Web API :lollipop: (DOM, setTimeout, HTTP requests, and so on). This can help us create some async, non-blocking behavior. 🚀
When we invoke a function, it gets added to the call stack :waffle: (part of the JS engine, this isn’t browser specific) - meaning that it’s first in, last out. When a function returns a value, it gets popped off the stack.
