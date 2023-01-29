# Asynchronous programming
JavaScript is single-threaded: only one task can run at a time :turkey:. 
Browser gives us a **Web API** :lollipop: (DOM, setTimeout, HTTP requests, and so on). This can help us create some async, non-blocking behavior :eagle:. 

When we invoke a function, it gets added to the **call stack** :waffle: (_part of the JS engine, this isn’t browser specific_) - meaning that it’s first in, last out. When a function returns a value, it gets popped off the stack.<br>
```javascript
     const foo = () => console.log("First: foo");
     const bar = () => setTimeout(() => console.log("Second: bar"), 2500);
     const fer = () => setTimeout(() => console.log("Third: fer"), 1500);
     const baz = () => console.log("Fourth: baz");
     const dif = () => setTimeout(() => console.log("Fifth: dif"), 0);
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

##There are two ways of running something regularly.
**setInterval** allows us to run a function repeatedly, starting after the interval of time, then repeating continuously at that interval.<br>
```javascript      
       // repeat with the interval of 2 seconds
       let intervalId = setInterval(() => console.log('tick'), 2000);
       // after 7 seconds stop
       setTimeout(() => { clearInterval(intervalId); console.log('stop'); }, 7000);
```

The other way is a nested setTimeout, like this:<br>
```javascript 
       let timerId = setTimeout(function tick() {
         console.log('tick');
         timerId = setTimeout(tick, 2000); // (setTimeout schedules the next call right at the end of the current one )
       }, 2000);
       setTimeout(() => { clearTimeout (timerId); console.log('stop'); }, 7000);
```

###In a ***browser*** the timer identifier is a number. For instance, ***Node.js*** returns a timer object with additional methods.

