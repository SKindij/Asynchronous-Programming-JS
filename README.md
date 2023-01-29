# Asynchronous programming
JavaScript is single-threaded: only one task can run at a time :turkey:. 
Browser gives us a **Web API** :lollipop: (DOM, setTimeout, HTTP requests, and so on). This can help us create some async, non-blocking behavior :eagle:. 

When we invoke a function, it gets added to the **call stack** :waffle: (_part of the JS engine, this isn’t browser specific_) - meaning that it’s first in, last out. When a function returns a value, it gets popped off the stack.

```javascript
     const foo = () => console.log("First: foo");  
     const bar = () => setTimeout(() => console.log("Second: bar"), 500);
     const baz = () => console.log("Third: baz");
         foo();     bar();     baz();
```

The **setTimeout** lets us delay tasks without blocking the main thread. In the **Web API**, a timer runs for as long as the second argument we passed to it.
The ***callback*** doesn’t immediately get added to the **call stack**, instead it’s passed to the **queue**.
 If the **call stack** is empty (_all previously invoked functions have returned their values and have been popped off the stack_), the first item in the **queue** gets added to the **call stack**. 

```javascript
     let timerId = setTimeout(func, [delay], [arg1], [arg2], ...);
       clearTimeout(timerId);
```

A call to **setTimeout** returns a “timer identifier” ***timerId*** that we can use to cancel the execution.

```javascript
     let timerId = setTimeout(() => console.log("never happens"), 1000);
       console.log(timerId); // timer identifier

     clearTimeout(timerId);
       console.log(timerId); // same identifier
```

In a ***browser*** the timer identifier is a number. For instance, ***Node.js*** returns a timer object with additional methods.

