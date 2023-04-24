# Asynchronous programming in JavaScript and Node.js
&emsp;JavaScript is single-threaded: only one task can run at a time :turkey:. 
Browser gives us a **Web API** :lollipop: (DOM, setTimeout, HTTP requests, and so on). This can help us create some async, non-blocking behavior :eagle:. 

&emsp;**Asynchronous programming** is an important concept, as it allows for code to run non-blocking and prevents the program from becoming unresponsive while waiting for a long-running operation to complete. In order to understand how asynchronous programming works, it's important to understand the concept of the **event loop**, as well as the call stack, microtasks, and macrotasks.

## <a name="eventLoop"></a>📖 Event loop:
&emsp;The **event loop** is the main mechanism used by JavaScript and Node.js to manage asynchronous operations. It's a continuously running process that checks the call stack for any pending function calls and queues up any asynchronous operations that are ready to run.

&emsp;The **call stack** (_part of the JS engine, this isn’t browser specific_) is a data structure that keeps track of the currently executing function calls.
> _Whenever func is called, it's added to top of call stack :waffle:, and when func returns, it's removed from the top of stack. Meaning that it’s first in, last out._

&emsp;When asynchronous operation is queued up, it's added to either microtask queue or macrotask queue, depending on type of operation. 
> _Microtasks are higher priority than macrotasks, and will always be executed before any macrotasks that are currently queued up._

&emsp;Once microtask queue is empty, the event loop will move on to the macrotask queue, and execute next available macrotask.
> _This process will continue until all macrotasks in queue have been executed, or until new microtask is added to queue._

&emsp;The **event loop** executes tasks in the following order:<br>
1. **call stack** (_...any function that's called synchronously_)
2. **microtask** queue (_ ...process.nextTick callback, queueMicrotask() _)
3. **microtask** queue (_ ...Promise.then() callback, async function() _)
4. **macrotask** queue (_ ...setTimeout(callback, 0) _)
5. **macrotask** queue (_ ...setImmediate callback _)
6. **macrotask** queue (_ ...setTimeout(callback, n), setInterval callback _)

- - -

### Timing Events (macrotasks)
&emsp;_Macrotasks are type of asynchronous task in JS that are scheduled to run after the current call stack has been cleared._

&emsp;The ``setTimeout()`` lets us delay tasks without blocking main thread. In **Web API** timer runs for as long as 2-nd argument we passed to it.
> **callback** doesn’t immediately get added to **call stack**, instead it’s passed to **queue**. If **call stack** is empty (_all previously invoked functions have returned their values and have been popped off stack_), first item in **queue** gets added to **call stack**.
> > ```javascript
> >  // remaining parameters arg1, arg2, ... are optional and will be passed as arguments to callback
> >  setTimeout(callback, [delay], [arg1], [arg2], ...);
> >  // call to setTimeout returns timer identifier that we can use to cancel execution
> >  let timerId = setTimeout(() => console.log("never happens"), 1000);
> >  console.log(`timer identifier: ${timerId}`); // => 1
> >  clearTimeout(timerId);
> >  console.log(`timer identifier: ${timerId}`); // => 1
> > ```

&emsp;To execute some piece of code asynchronously you can use ``setImmediate(callback)`` provided **by Node.js**.\
It is a method that allows you to schedule macrotask to be executed immediately after the current call stack has been cleared.
> ```javascript 
>  setImmediate(callback, arg1, arg2, ...)
>  // callback is executed in the next iteration of event loop
>  setImmediate( () => { console.log('run something'); } );
> ```

&emsp;``setTimeout(callback, 0)`` is very similar to ``setImmediate(callback)``.

Common use cases in production setting:
+ of ``setTimeout(callback, 0)`` is to defer non-critical work to be executed after the current call stack has been cleared;
  > For example, imagine that you are running production line where you need to track speed of each machine in real-time.\
  > You might have function that calculates speed of each machine and updates dashboard to display results. However, if you run this function too frequently, it could slow down performance of your application and even cause machines to slow down.\
  > By using ``setTimeout``, you can defer execution of speed calculation function until after current call stack has been cleared, ensuring that performance of application is not negatively affected. 
+ of ``setImmediate(callback)`` is to execute a function immediately after the current call stack has been cleared;
  > For example, imagine that you are running manufacturing line where you need to track production rate of each machine.\
  > You might have function that calculates production rate and updates database with results.\
  > By using ``setImmediate``, you can ensure that calculation function is executed as soon as possible after the current call stack has been cleared, ensuring that production rate data is as up-to-date as possible.
+ of ``setTimeout(callback, delay)`` is to schedule a task to be executed at a specific time;
  > For example, imagine that you are running manufacturing line that requires routine maintenance.\
  > You might schedule maintenance task to be executed every 1000 hours of machine operation.\
  > By using ``setTimeout``, you can schedule maintenance task to be executed after specified delay, ensuring that task is executed at appropriate time.

There are two ways of running something regularly:
+ ``setInterval(callback, delay)`` is method that allows you to schedule macrotask to be executed repeatedly at specified interval. 
  > ```javascript   
  >  // repeat with the interval of 2 seconds
  >  let intervalId = setInterval(() => console.log('tick-tack'), 2000);
  >  // after 7 seconds stop
  >  setTimeout(() => { clearInterval(intervalId); console.log('stop'); }, 7000);
  > ```
+ The other way is a **nested setTimeout**, like this:
  > ```javascript 
  >  let timerId = setTimeout(function tickTack() {
  >    console.log('tick-tack');
  >    // setTimeout schedules next call right at the end of current one
  >    timerId = setTimeout(tickTack, 2000); 
  >  }, 2000);
  >  setTimeout(() => { clearTimeout (timerId); console.log('stop'); }, 7000);
  > ```

> For example: we have a production line with 10 machines.\
> Every 10 seconds, we want to calculate speed of each machine and update a dashboard with results.
> > ```javascript
> >  function calculateMachineSpeed(machineId) {
> >    // perform some calculations to determine speed of machine
> >    const speed = Math.random() * 100;   
> >    // update the dashboard with the machine's speed
> >    updateDashboard(machineId, speed);
> >  };
> >  
> >  function updateDashboard(machineId, speed) {
> >    // update the dashboard to display the machine's speed
> >    console.log(`Machine ${machineId} speed: ${speed.toFixed(2)}`);
> >  };
> >  
> >  function runProductionLine() {
> >    // assume we have 10 machines on production line
> >    const machineIds = Array.from({ length: 10 }, (_, i) => i + 1);  
> >    const productionLineInterval = setInterval(() => {
> >      machineIds.forEach(machineId => {
> >        // calculate speed of each machine every 10 seconds
> >        setTimeout(() => {calculateMachineSpeed(machineId);}, 0);
> >      });
> >    }, 10000);
> >    // stop the execution of the program after 30 seconds
> >    setTimeout(() => {
> >      clearInterval(productionLineInterval);
> >      console.log('Production line has been shut down.');
> >    }, 30000);
> >  }
> >  
> >  // start the production line
> >  runProductionLine();
> > ```

- - -

### microtasks

#### process.nextTick 
&emsp;This method is used to schedule a function to be executed at the next turn of the event loop. It's often used to ensure that a callback function is executed after the current function completes, but before any other I/O events are processed.

&emsp;A function passed to **process.nextTick()** is going to be executed on the current iteration of the **event loop**, after the current operation ends. This means it will always execute before setTimeout and setImmediate.<br>
```javascript 
      process.nextTick( () => { console.log('do something'); } );
```

&emsp;It is the way the **JS** engine process a function **asynchronously** (after the current function), but as soon as possible, not queue it.
Use nextTick() when you want to make sure that in the next event loop iteration that code is already executed.<br>







```javascript
     const foo = () => console.log("First: foo");                                 // № 1
     const bar = () => setTimeout(() => console.log("Second: bar"), 2500);        // № 5
     const fer = () => setTimeout(() => console.log("Third: fer"), 1500);         // № 4
     const baz = () => console.log("Fourth: baz");                                // № 2
     const dif = () => setTimeout(() => console.log("Fifth: dif"), 0);            // № 3
	    foo();     bar();    fer();   baz();    dif();      
```





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
### <a name="promises"></a>📖 ES6 introduced Promises.

&emsp;We can create a promise, using a Promise constructor that receives a callback.<br>
> *A Promise is an object that contains a status and a value.* 
```javascript
                 new Promise ( () => { console.log('something') } );
```
>              [[Prototype]]: Promise
>                 [[PromiseState]]: "pending"
>                 [[PromiseResult]]: undefined
 
&emsp; &emsp; &emsp; &emsp; ![promise-executing](https://github.com/SKindij/Asynchronous-JS-Nodejs/blob/main/codeApplication/promise-executor.jpg "promise-executing") 

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

&emsp;Typically **promise** is used to manage situations where you must wait for the outcome of an operation. *For example, uploading files to the server and awaiting the response of an API call, or just asking the user to choose a file from their computer.* A **promise** is simply a function that returns an Object which you can attach callbacks to. These callbacks will have to wait until the operation is ``fulfilled`` or ``rejected``, and will only get called when the operation has completed.

```javascript 
        fetch( `some_api_url` ).then( (response) => {  console.log('this will get called when the promise fulfills'); 
		     } ).catch( (error) => {  console.log('this will get called when the promise is rejected');
		     } ).finally( () => {  console.log('this will get called all the time');  } );
```

&emsp;To handle errors with ``catch`` is best practice. Unhandled Promise rejections will crash your application with a fatal exception.<br>

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

&emsp;The ``.then()`` callback is not really the end. That's because when you return value of a promise you get another promise. This becomes very useful when you want to run a series of asynchronous operations in order. All you have to do is to return the value of the promise.

```javascript 
       Promise.resolve(1981).then(res => 2023 - res).then(res => 50 - res).then(res => 2023 + res).then(res => console.log(res) );
```

&emsp;Let's have a look at an example for fetching the json placeholder API to get some todos.

```javascript 
	fetch('https://jsonplaceholder.typicode.com/todos')
	  .then(response => response.json())
	  .then(json => console.log(json))
	  .catch(err => console.log(err));
```

&emsp;We ``fetch`` some JSON data via an HTTP request. The **fetch function** returns a **promise**, which will either ``resolve`` or ``reject``. The **response body** has a json method for parsing the response from JSON to an object. ``.then`` returns a promise of its own, which handle by attaching another ``.then`` handler, and in case of **error** we attach a ``catch`` handler and log the error.

___
### <a name="asyncAwait"></a>📖 ES7 introduced Async/Await.
&emsp;With the async and await keywords, we can create async functions which implicitly return a promise.<br>

&emsp;When encountering an ``await`` keyword, the execution of the ``async function`` body gets paused ✋🏼. And the rest of the ``async function`` gets run in a **microtask** instead of a regular task. In that time the ***JS engine*** jumps out of the async function and continues running the code in the ***execution context*** in which the async function got called 🏃🏽‍♀️ (_for example, the global execution context_).

```javascript
	function checkRequestCorrectness(request) {
		return new Promise( (resolve, reject) => {
			if (request == 'SKJ.com') { resolve(`Request is correct. :) Connected to ${ request}`);
			} else { reject(`Connection failed :( . Query to ${ request} is invalid.`); }
		} );
	};
	async function doStuff(request) {
		console.log(`you have attempted a request to ${ request}`);
		try { const response = await checkRequestCorrectness(request);
			console.log(response);
		} catch (err) {	console.log(err); }
	};
	doStuff('ERG.com');  doStuff('SKJ.com');   doStuff('SMT.com');
    console.log('The results of the answers will be as follows:');
```

___
&emsp;Did you notice how **async functions** are different compared to a **promise.then**? The ``await`` keyword suspends the ``async function``, whereas the ``Promise`` body would've kept on being executed if we would've used ``.then``!

___
&emsp;Read more in the [section with code examples](https://github.com/SKindij/Asynchronous-JS-Nodejs/tree/main/codeApplication)...

