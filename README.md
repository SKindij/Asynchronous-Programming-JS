# Asynchronous programming in JavaScript and Node.js
JavaScript is single-threaded: only one task can run at a time :turkey:. 
Browser gives us a **Web API** :lollipop: (DOM, setTimeout, HTTP requests, and so on). This can help us create some async, non-blocking behavior :eagle:. 

When we invoke a function, it gets added to the **call stack** :waffle: (_part of the JS engine, this isn’t browser specific_) - meaning that it’s first in, last out. When a function returns a value, it gets popped off the stack.<br>
```javascript
     const foo = () => console.log("First: foo");                                 // № 1
     const bar = () => setTimeout(() => console.log("Second: bar"), 2500);        // № 5
     const fer = () => setTimeout(() => console.log("Third: fer"), 1500);         // № 4
     const baz = () => console.log("Fourth: baz");                                // № 2
     const dif = () => setTimeout(() => console.log("Fifth: dif"), 0);            // № 3
	    foo();     bar();    fer();   baz();    dif();      
```

The **setTimeout** lets us delay tasks without blocking the main thread. In the **Web API**, a timer runs for as long as the second argument we passed to it.
The ***callback*** doesn’t immediately get added to the **call stack**, instead it’s passed to the **queue**.
 If the **call stack** is empty (_all previously invoked functions have returned their values and have been popped off the stack_), the first item in the **queue** gets added to the **call stack**.<br>
```javascript
     let timerId = setTimeout(func, [delay], [arg1], [arg2], ...);
       clearTimeout(timerId);
```

A call to **setTimeout** returns a “timer identifier” ***timerId*** that we can use to cancel the execution.<br>
```javascript
     let timerId = setTimeout(() => console.log("never happens"), 1000);
       console.log(timerId); // timer identifier
     clearTimeout(timerId);
       console.log(timerId); // same identifier
```

There are two ways of running something regularly.
**setInterval** allows us to run a function repeatedly, starting after the interval of time, then repeating continuously at that interval.<br>
```javascript      
       // repeat with the interval of 2 seconds
       let intervalId = setInterval(() => console.log('tick'), 2000);
       // after 7 seconds stop
       setTimeout(() => { clearInterval(intervalId); console.log('stop'); }, 7000);
```

The other way is a **nested setTimeout**, like this:<br>
```javascript 
       let timerId = setTimeout(function tick() {
         console.log('tick');
         timerId = setTimeout(tick, 2000); // (setTimeout schedules the next call right at the end of the current one )
       }, 2000);
       setTimeout(() => { clearTimeout (timerId); console.log('stop'); }, 7000);
```

We can use the **clearInterval()** method to achieve a certain number of reruns of the function.<br>
```javascript 
     let count = 0;
     const intervalId = setInterval(() => {
        console.log('some action repeated every second');
        count++;
        if (count === 7) {
	   console.log('Clearing the interval id after 7 executions');
	   clearInterval(intervalId); }
     }, 1000);
```

---
To execute some piece of code asynchronously use the **setImmediate()** function provided **by Node.js**:<br>
```javascript 
        setImmediate( () => {  console.log('run something');  }  );
```

Any function passed as the setImmediate() argument is a callback that's executed in the next iteration of the **event loop**.<br>
A ***setTimeout()*** callback with a 0ms delay is very similar to ***setImmediate()***. The execution order will depend on various factors.<br>

A function passed to **process.nextTick()** is going to be executed on the current iteration of the **event loop**, after the current operation ends. This means it will always execute before setTimeout and setImmediate.<br>
```javascript 
       process.nextTick( () => {  console.log('do something');  }  );
```

It's the way the **JS** engine process a function **asynchronously** (after the current function), but as soon as possible, not queue it.<br>
Use nextTick() when you want to make sure that in the next event loop iteration that code is already executed.<br>
---
#### The event loop executes tasks in the following order:<br>
1. **process.nextTick** queue (_...process.nextTick callback_)
2. **promises microtask** queue (_...Promise.then() callback_)
3. **macrotask** queue (_..setTimeout, setImmediate callback._)

```javascript 
     const baz = () => console.log('baz');
     const foo = () => console.log('foo');
     const zoo = () => console.log('zoo');
     const start = () => {
       console.log('start');                                // № 1
       setImmediate(baz);                                   // № 5
       new Promise((resolve, reject) => { resolve('bar');
         }).then((resolve) => {
           console.log(resolve);                            // № 3
           process.nextTick(zoo); });                       // № 4
       process.nextTick(foo);                               // № 2
     };
     start();
```
---
In a ***browser*** the timer identifier is a number. For instance, ***Node.js*** returns a timer object with additional methods.

