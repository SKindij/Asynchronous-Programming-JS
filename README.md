# Asynchronous programming in JavaScript and Node.js
JavaScript is single-threaded: only one task can run at a time :turkey:. 
Browser gives us a **Web API** :lollipop: (DOM, setTimeout, HTTP requests, and so on). This can help us create some async, non-blocking behavior :eagle:. 

When we invoke a function, it gets added to the **call stack** :waffle: (_part of the JS engine, this isn’t browser specific_) - meaning that it’s first in, last out. When a function returns a value, it gets popped off the stack.<br>
___

### Timing Events
```javascript
     const foo = () => console.log("First: foo");                                 // № 1
     const bar = () => setTimeout(() => console.log("Second: bar"), 2500);        // № 5
     const fer = () => setTimeout(() => console.log("Third: fer"), 1500);         // № 4
     const baz = () => console.log("Fourth: baz");                                // № 2
     const dif = () => setTimeout(() => console.log("Fifth: dif"), 0);            // № 3
	    foo();     bar();    fer();   baz();    dif();      
```

The **setTimeout** lets us delay tasks without blocking the main thread. In the **Web API**, a timer runs for as long as the 2-nd argument we passed to it.
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

#### There are two ways of running something regularly.<br>

**setInterval** starts a function after the interval of time, then repeating to run a function continuously at that interval.<br>
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
        setImmediate( () => { console.log('run something'); } );
```

Any function passed as the setImmediate() argument is a callback that's executed in the next iteration of the **event loop**.
A ``setTimeout() callback`` with a 0ms delay is very similar to ``setImmediate()``. The execution order will depend on various factors.<br>

A function passed to **process.nextTick()** is going to be executed on the current iteration of the **event loop**, after the current operation ends. This means it will always execute before setTimeout and setImmediate.<br>
```javascript 
      process.nextTick( () => { console.log('do something'); } );
```

It is the way the **JS** engine process a function **asynchronously** (after the current function), but as soon as possible, not queue it.
Use nextTick() when you want to make sure that in the next event loop iteration that code is already executed.<br>

---
#### The event loop executes tasks in the following order:<br>
1. **call stack** (_...function()_)
2. **microtask** queue (_ ...process.nextTick callback _)
3. **microtask** queue (_ ...Promise.then() callback, async function() _)
4. **macrotask** queue (_ ...setTimeout(callback, 0) _)
5. **macrotask** queue (_ ...setImmediate callback _)
6. **macrotask** queue (_ ...setTimeout(callback, n), setInterval callback _)

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
___
### ES6 introduced Promises.

We can create a promise, using a Promise constructor that receives a callback.<br>
> *A Promise is an object that contains a status and a value.* 
```javascript
                 new Promise ( () => { console.log('something') } );
```
>              [[Prototype]]: Promise
>                 [[PromiseState]]: "pending"
>                 [[PromiseResult]]: undefined
   
```javascript 
                 new Promise ( (resolve, reject) => resolve('oh yea, was res') );
```
>              [[Prototype]]: Promise
>                 [[PromiseState]]: "fulfilled"
>                 [[PromiseResult]]: "oh yea, was res"

```javascript 
                 new Promise ( (resolve, reject) => reject('oh no, was rej') );
```
>              [[Prototype]]: Promise
>                 [[PromiseState]]: "rejected"
>                 [[PromiseResult]]: "oh no, was rej"

| STATE         | DESCRIPTION                                                     | CALLBCAK   |
|:------------:|:---------------------------------------------------------------:|:----------:|
| pending ⏳    | means the operation is still running and the promise is pending |            |
| fulfilled ✅ | the operation was completed and it was successful               | .then()    |
| rejected ❌  | the operation was completed but there was an error              | .catch()   |
| settled 🥳   | resolved or rejected, either way this callback gets called      | .finally() |

Typically **promise** is used to manage situations where you must wait for the outcome of an operation. *For example, uploading files to the server and awaiting the response of an API call, or just asking the user to choose a file from their computer.* A **promise** is simply a function that returns an Object which you can attach callbacks to. These callbacks will have to wait until the operation is ``fulfilled`` or ``rejected``, and will only get called when the operation has completed.

```javascript 
        fetch( `some_api_url` ).then( (response) => {  console.log('this will get called when the promise fulfills'); 
		     } ).catch( (error) => {  console.log('this will get called when the promise is rejected');
		     } ).finally( () => {  console.log('this will get called all the time');  } );
```

To handle errors with ``catch`` is best practice. Unhandled Promise rejections will crash your application with a fatal exception.<br>

```javascript 
	const fs = require('fs');
	const myPromise = new Promise( (resolve, reject) => {
	  fs.readFile( 'example.json', (err, data) => {
	    if (err) { reject(err);
	    } else { resolve(data); }  } );
	} );
	myPromise.then( data => console.log(JSON.parse(data)) ).catch( err => console.log(err) );
	console.log('keep runing code');
```

The ``.then()`` callback is not really the end. That's because when you return value of a promise you get another promise. This becomes very useful when you want to run a series of asynchronous operations in order. All you have to do is to return the value of the promise.

```javascript 
       Promise.resolve(1981).then(res => 2023 - res).then(res => 50 - res).then(res => 2023 + res).then(res => console.log(res) );
```
___
### ES7 introduced Async/Await.
With the async and await keywords, we can create async functions which implicitly return a promise.<br>

When encountering an ``await`` keyword, the execution of the ``async function`` body gets paused ✋🏼. And the rest of the ``async function`` gets run in a **microtask** instead of a regular task. In that time the ***JS engine*** jumps out of the async function and continues running the code in the ***execution context*** in which the async function got called 🏃🏽‍♀️ (_for example, the global execution context_).



___
Did you notice how **async functions** are different compared to a **promise.then**? The ``await`` keyword suspends the ``async function``, whereas the ``Promise`` body would've kept on being executed if we would've used ``.then``!

___
In a ***browser*** the timer identifier is a number. For instance, ***Node.js*** returns a timer object with additional methods.

