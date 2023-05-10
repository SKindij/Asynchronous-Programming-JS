# Asynchronous programming in JavaScript and Node.js
&emsp;JavaScript is single-threaded: only one task can run at a time :turkey:. 
Browser gives us a **Web API** :lollipop: (DOM, setTimeout, HTTP requests, and so on). This can help us create some async, non-blocking behavior :eagle:. 

&emsp;**Asynchronous programming** is an important concept, as it allows for code to run non-blocking and prevents the program from becoming unresponsive while waiting for a long-running operation to complete. In order to understand how asynchronous programming works, it's important to understand the concept of the **event loop**, as well as the call stack, microtasks, and macrotasks.

## <a name="eventLoop"></a>📚 Event loop:
&emsp;The **event loop** is the main mechanism used by JavaScript and Node.js to manage asynchronous operations. It's a continuously running process that checks the call stack for any pending function calls and queues up any asynchronous operations that are ready to run.

&emsp;📖 The **call stack** (_part of the JS engine, this isn’t browser specific_) is a data structure that keeps track of the currently executing function calls.
> &emsp;_Whenever func is called, it's added to top of call stack :waffle:, and when func returns, it's removed from the top of stack. Meaning that it’s first in, last out._

&emsp;When asynchronous operation is queued up, it's added to either microtask queue or macrotask queue, depending on type of operation. 
> &emsp;_Microtasks are higher priority than macrotasks, and will always be executed before any macrotasks that are currently queued up._

&emsp;Once microtask queue is empty, the event loop will move on to the macrotask queue, and execute next available macrotask.
> &emsp;_This process will continue until all macrotasks in queue have been executed, or until new microtask is added to queue._

&emsp;📖 The **event loop** executes tasks in the following order:<br>
1. **call stack** (_...any function that's called synchronously_)
2. **microtask** queue (_ ...process.nextTick callback, queueMicrotask() _)
3. **microtask** queue (_ ...Promise.then() callback, async function() _)
4. **macrotask** queue (_ ...setTimeout(callback, 0) _)
5. **macrotask** queue (_ ...setImmediate callback _)
6. **macrotask** queue (_ ...setTimeout(callback, n), setInterval callback _)

- - -

### 📚 Timing Events (macrotasks)
&emsp;_Macrotasks are type of asynchronous task in JS that are scheduled to run after the current call stack has been cleared._

&emsp;📖 The ``setTimeout()`` lets us delay tasks without blocking main thread. In **Web API** timer runs for as long as 2-nd argument we passed to it.
> &emsp;**callback** doesn’t immediately get added to **call stack**, instead it’s passed to **queue**. If **call stack** is empty (_all previously invoked functions have returned their values and have been popped off stack_), first item in **queue** gets added to **call stack**.
> > ```javascript
> >  // remaining parameters arg1, arg2, ... are optional and will be passed as arguments to callback
> >  setTimeout(callback, [delay], [arg1], [arg2], ...);
> >  // call to setTimeout returns timer identifier that we can use to cancel execution
> >  let timerId = setTimeout(() => console.log("never happens"), 1000);
> >  console.log(`timer identifier: ${timerId}`); // => 1
> >  clearTimeout(timerId);
> >  console.log(`timer identifier: ${timerId}`); // => 1
> > ```

&emsp;📖 To execute some piece of code asynchronously you can use ``setImmediate(callback)`` provided **by Node.js**.\
It is a method that allows you to schedule macrotask to be executed immediately after the current call stack has been cleared.
> ```javascript 
>  setImmediate(callback, arg1, arg2, ...)
>  // callback is executed in the next iteration of event loop
>  setImmediate( () => { console.log('run something'); } );
> ```

&emsp;📖 ``setTimeout(callback, 0)`` is very similar to ``setImmediate(callback)``.

Common use cases in production setting:
+ of ``setTimeout(callback, 0)`` is to defer non-critical work to be executed after the current call stack has been cleared;
  > &emsp;For example, imagine that you are running production line where you need to track speed of each machine in real-time.\
  > &emsp;You might have function that calculates speed of each machine and updates dashboard to display results. However, if you run this function too frequently, it could slow down performance of your application and even cause machines to slow down.\
  > &emsp;By using ``setTimeout``, you can defer execution of speed calculation function until after current call stack has been cleared, ensuring that performance of application is not negatively affected. 
+ of ``setImmediate(callback)`` is to execute a function immediately after the current call stack has been cleared;
  > &emsp;For example, imagine that you are running manufacturing line where you need to track production rate of each machine.\
  > &emsp;You might have function that calculates production rate and updates database with results.\
  > &emsp;By using ``setImmediate``, you can ensure that calculation function is executed as soon as possible after the current call stack has been cleared, ensuring that production rate data is as up-to-date as possible.
+ of ``setTimeout(callback, delay)`` is to schedule a task to be executed at a specific time;
  > &emsp;For example, imagine that you are running manufacturing line that requires routine maintenance.\
  > &emsp;You might schedule maintenance task to be executed every 1000 hours of machine operation.\
  > &emsp;By using ``setTimeout``, you can schedule maintenance task to be executed after specified delay, ensuring that task is executed at appropriate time.

📖 There are two ways of running something regularly:
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

> &emsp;simple example
> > ```javascript
> >  const foo = () => console.log("First: foo");                                 // № 1
> >  const bar = () => setTimeout(() => console.log("Second: bar"), 2500);        // № 5
> >  const fer = () => setTimeout(() => console.log("Third: fer"), 1500);         // № 4
> >  const baz = () => console.log("Fourth: baz");                                // № 2
> >  const dif = () => setTimeout(() => console.log("Fifth: dif"), 0);            // № 3
> >    foo();     bar();    fer();   baz();    dif();      
> > ```

> &emsp;advanced example: We have a production line with 10 machines.\
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

### 📚 microtasks
&emsp;They are a type of task that are executed after the current task finishes, but before the browser or JS-engine renders any changes to the screen. Examples of microtasks include Promise callbacks and process.nextTick callbacks.\
&emsp;Microtasks are placed in a queue and executed one after the other in a FIFO (First-In-First-Out) manner. This means that if there are multiple microtasks in the queue, they will be executed in the order they were added to the queue.

#### 📖 process.nextTick() 
&emsp;It is Node.js-specific function that adds callback to microtask queue. -It is similar to setImmediate, which adds a callback to the macrotask queue._
This method is used to schedule function to be executed at the next turn of the event loop. 
> &emsp;_It's often used to ensure that callback function is executed after current function completes, but before any other I/O events are processed._\
> &emsp;_It will always execute before setTimeout and setImmediate._
> > ```javascript
> >  console.log('Start'); // => 1
> >  process.nextTick( () => console.log('process.nextTick') ); // => 3
> >  setTimeout( () => console.log('setTimeout'), 0 ); // => 5
> >  process.nextTick( () => console.log('do something') ); // => 4
> >  console.log('End'); // => 2
> > ```

&emsp;📖 It is way **JS** engine process function **asynchronously** (after current function), but as soon as possible, not queue it.\
Use ``nextTick()`` when you want to make sure that in next event loop iteration that code is already executed.

> &emsp;_Suppose you are developing system to monitor and control large manufacturing plant. The system receives large number of sensor readings from various machines and devices throughout the plant. You want to process these sensor readings as quickly as possible, but you don't want to block event loop while doing so._\
> &emsp;_One solution to this problem is to use process.nextTick to schedule the processing of each sensor reading as a separate microtask._
> > ```javascript
> >  function processSensorData(sensorData) {
> >    // split sensor data into smaller chunks
> >    const chunks = splitSensorDataIntoChunks(sensorData);
> >    // process each chunk asynchronously
> >    let index = 0;
> >    function processNextChunk() {
> >      if (index < chunks.length) {
> >        processChunk(chunks[index++]);
> >        process.nextTick(processNextChunk);
> >      }
> >    }
> >    processNextChunk();
> >  }
> >  
> >  function processChunk(chunk) {
> >    // process the chunk of sensor data
> >    // ...
> >  }
> > ```

&emsp;This technique can be used in variety of scenarios where large number of tasks need to be processed without blocking the event loop. For example, it could be used in financial trading system to process a large number of trades or in logistics system to process a large number of shipping requests.

#### 📖 queueMicrotask()
&emsp;This method provides a way to schedule a microtask to be executed at the end of the current task, but before the next task in the event loop.
> _It takes function as its argument, which will be executed as microtask. Function is added to the end of microtask queue, and it will be executed as soon as current task is complete, but before any regular tasks in the event loop._
> > ```javascript
> >  function example() {
> >    console.log('Task 1');  // => 1
> >    queueMicrotask(() => {
> >      console.log('Microtask 1');  // => 3
> >    });
> >    console.log('Task 2');  // => 2
> >    queueMicrotask(() => {
> >      console.log('Microtask 2');  // => 4
> >    });
> >  }
> >  
> >  example();
> > ```

&emsp;**queueMicrotask()** can be useful for scheduling asynchronous work that needs to be executed as soon as possible, but with higher priority than regular tasks. It can also be used to ensure that certain operations are executed in the correct order, even if they are initiated asynchronously.


### <a name="promises"></a>📚 ES6 introduced Promises
&emsp;Instead of executing function and waiting for it to finish before moving on to next one, **promises** allow you to execute function and move on to next one while first function is still running. **Promise** will then return result of function when it is done.

&emsp;We can create promise, using Promise constructor (_takes single argument, which is function with two parameters: resolve and reject_) that receives callback.
> ```javascript
>  const promise = new Promise((resolve, reject) => {
>    // do some asynchronous operation
>      // when operation is done, call resolve function with result
>      // if there is an error, call reject function with error
>  });
> ```

> &emsp;*Promise is an object that contains status and value.* 
> > ```javascript
> >   new Promise ( () => { console.log('something') } );
> > ```
>          [[Prototype]]: Promise
>              [[PromiseState]]: "pending"
>              [[PromiseResult]]: undefined
 
&emsp; &emsp; &emsp; ![promise-executing](https://github.com/SKindij/Asynchronous-Programming-Node.js/blob/main/codeSamples/promise-executor.jpg) 

> > ```javascript 
> >   new Promise ( (resolve, reject) => resolve('oh yea, was res') );
> > ```
>           [[Prototype]]: Promise
>               [[PromiseState]]: "fulfilled"
>               [[PromiseResult]]: "oh yea, was res"

> > ```javascript 
> >       new Promise ( (resolve, reject) => reject('oh no, was rej') );
> > ```
>           [[Prototype]]: Promise
>               [[PromiseState]]: "rejected"
>               [[PromiseResult]]: "oh no, was rej"

| STATE         | DESCRIPTION                                                  | CALLBCAK   |
|:------------:|:-------------------------------------------------------------:|:----------:|
| pending ⏳    | means the operation is still running and promise is pending  |            |
| fulfilled ✅ | the operation was completed and it was successful            | .then()    |
| rejected ❌  | the operation was completed but there was an error           | .catch()   |
| settled 🥳   | resolved or rejected, either way this callback gets called   | .finally() |

&emsp;Typically **promise** is used to manage situations where you must wait for outcome of operation. *For example, uploading files to server and awaiting response of  API call, or just asking user to choose file from their computer.* **Promise** is simply function that returns an Object which you can attach callbacks to. These callbacks will have to wait until the operation is ``fulfilled`` or ``rejected``, and will only get called when the operation has completed.
> ```javascript 
>    fetch( `some_api_url` )
>        .then( (response) => { console.log('this will get called when promise fulfills'); })
>	 .catch( (error) => { console.log('this will get called when promise is rejected'); })
>	 .finally( () => { console.log('this will get called all time');  } );
> ```

&emsp;📖 To handle errors with ``catch`` is best practice. Unhandled Promise rejections will crash your application with fatal exception.<br>
> ```javascript 
>	const fs = require('fs');
>	const myPromise = new Promise( (resolve, reject) => {
>	  fs.readFile( 'example.json', (err, data) => {
>	    if (err) { reject(err);
>	    } else { resolve(data); }  } );
>	} );
>	myPromise.then( data => console.log(JSON.parse(data)) ).catch( err => console.log(err) );
>	console.log('keep runing code');
> ```

&emsp;📖 ``.then()`` callback is not really the end. That's because when you return value of promise you get another promise. This becomes very useful when you want to run series of asynchronous operations in order. All you have to do is to return value of promise.
> ```javascript 
>     Promise.resolve(1981).then(res => 2023 - res).then(res => 50 - res).then(res => 2023 + res).then(res => console.log(res) );
> ```

&emsp;Let's have a look at example for fetching json placeholder API to get some todos.
> ```javascript 
>  // We fetch some JSON data via an HTTP request:
>	fetch('https://jsonplaceholder.typicode.com/todos')
>  // function returns promise, which will either resolve or reject
>  // response body has json method for parsing response from JSON to object
>	  .then(response => response.json())
>  // .then returns promise of its own, which handle by attaching another .then handler
>	  .then(json => console.log(json))
>  // in case of error we attach catch handler and log error
>	  .catch(err => console.log(err));
> ```

> &emsp;simple example of event-loop
> > ```javascript 
> >     const baz = () => console.log('baz');
> >     const foo = () => console.log('foo');
> >     const zoo = () => console.log('zoo');
> >     const start = () => {
> >       console.log('start');                                // № 1
> >       setImmediate(baz);                                   // № 5
> >       new Promise((resolve, reject) => { resolve('bar');
> >         }).then((resolve) => {
> >           console.log(resolve);                            // № 3
> >           process.nextTick(zoo); });                       // № 4
> >       process.nextTick(foo);                               // № 2
> >     };
> >     start();
> > ```

> &emsp;Here's example of how Promise.then can be used in business or production context:
> &emsp;_Suppose you are building an e-commerce platform that integrates with various payment gateways.\
> When a customer places an order, you need to send the payment information to the payment gateway and wait for a response before proceeding with the order._
> > ```javascript
> >  function processOrder(order) {
> >    // send payment information to payment gateway
> >    sendPaymentInformation(order.paymentInfo)
> >      .then((response) => { // handlee payment gateway response
> >        if (response.success) { // payment was successful, process the order
> >          return processOrderItems(order.items);
> >        } else { // payment failed, handle error
> >          throw new Error(response.error);
> >        }
> >      })
> >      .then((result) => { // order processing was successful, send confirmation to customer
> >        return sendOrderConfirmation(order.email);
> >      })
> >      .catch((error) => { // handle errors that occurred during payment processing or order processing
> >        console.error(error);
> >        return sendOrderErrorNotification(order.email, error.message);
> >      });
> >  }
> > ```

&emsp;This technique can be used in a variety of scenarios where asynchronous processing is required, such as handling API requests, processing data, or interacting with external systems.

&emsp;📖 **Promise.all()** method allows you to execute multiple promises in parallel and wait for all of them to resolve before continuing. It takes an array of promises as its argument and returns a new promise that resolves with an array of results.
> ```javascript
>  Promise.all( [asyncOperation1(), asyncOperation2(), asyncOperation3()] )
>    .then( (results) => { // do something with results array } )
>    .catch( (error) => { // Handle the error} );
> ```

&emsp;📖 **.race()** method is similar to Promise.all(), but it only waits for the first promise to be fulfilled or rejected. It takes an array of promises as its argument and returns a new promise that resolves or rejects with the result of the first promise to be settled.
> ```javascript
>  Promise.race( [asyncOperation1(), asyncOperation2(), asyncOperation3()] )
>    .then( (result) => { // do something with result} )
>    .catch( (error) => { // handle the error} );
> ```

- - -

### <a name="asyncAwait"></a>📚 ES7 introduced Async/Await
&emsp;It is feature in JS that makes it easier to work with promises. With async/await, you can write asynchronous code that looks more like synchronous code, making it easier to understand and maintain.\

&emsp;When encountering ``await`` keyword, execution of ``async function`` body gets paused ✋🏼. And rest of ``async function`` gets run in a **microtask** instead of regular task. In that time the ***JS engine*** jumps out of async function and continues running the code in the ***execution context*** in which async function got called 🏃🏽‍♀️ (_for example, global execution context_).

```javascript
   function checkRequestCorrectness(request) {
      return new Promise( (resolve, reject) => {
         if (request == 'SKJ.com') { resolve(`Request is correct. :) Connected to ${ request}`);
         } else { reject(`Connection failed :( . Query to ${ request} is invalid.`); }
      } );
   };
   // async keyword is used to mark function as asynchronous
   async function doStuff(request) {
      console.log(`you have attempted a request to ${ request}`);
      // use await keyword to wait for promise to be resolved
      try { const response = await checkRequestCorrectness(request);
         console.log(response);
      } catch (err) { console.log(err); }
   };
   // When you call an async function, it returns a promise.
   doStuff('ERG.com');  doStuff('SKJ.com');   doStuff('SMT.com');
    console.log('The results of the answers will be as follows:');
```

> _Let's say you have web application that tracks orders for your manufacturing company.\
> When new order is placed, you need to send email to customer to confirm order and to your production team to start processing order.\
> &emsp;You also need to update order status in your database._\
> &emsp;_You can use async/await to make sure that each of these tasks happens in correct order, and that you don't move on to next task until previous one has completed._
> > ```javascript
> >  async function processOrder(order) {
> >    // send confirmation email to customer
> >      await sendConfirmationEmail(order.customerEmail);
> >    // update order status in database
> >      await updateOrderStatus(order.id, 'processing');
> >    // send notification email to production team
> >      await sendNotificationEmail('production@manufacturingcompany.com', `New order received: ${order.id}`);
> >  };
> >  
> >  async function sendConfirmationEmail(email) {
> >    // code to send confirmation email here
> >  };
> >  async function updateOrderStatus(orderId, status) {
> >    // code to update order status in database here
> >  };
> >  async function sendNotificationEmail(email, message) {
> >    // code to send notification email here
> >  };
> > ```

> _You can use Promise.all() to execute multiple promises at once and wait for all of them to complete before moving on._
> > ```javascript
> >  async function example() {
> >    // to fetch data from two different URLs at the same time
> >    const [result1, result2] = await Promise.all( [
> >      fetch('https://jsonplaceholder.typicode.com/todos/1'),
> >      fetch('https://jsonplaceholder.typicode.com/todos/2')
> >    ] );
> >    // to wait for both promises to be resolved
> >    const data1 = await result1.json();
> >    const data2 = await result2.json();
> >      console.log(data1);
> >      console.log(data2);
> >  }
> > ```

- - -

&emsp;Did you notice how **async functions** are different compared to a **promise.then**? The ``await`` keyword suspends the ``async function``, whereas the ``Promise`` body would've kept on being executed if we would've used ``.then``!

&emsp;Read more in the [section with code examples](https://github.com/SKindij/Asynchronous-Programming-Node.js/tree/main/codeSamples)...

- - -

&emsp;**Async generator** is a special type of function that returns an async iterable. It allows you to produce a sequence of values asynchronously and lazily, i.e., it only generates the next value when it's requested by the consumer of the iterator.
> _Here's an example of an async generator that generates random numbers:_
> > ```javascript
> >  // function is async generator that uses infinite loop to generate random numbers
> >  async function* randomNumberGenerator() {
> >    while (true) {
> >  // it yields each random number and then waits for 1 sec using before generating next
> >      yield Math.random();
> >      await new Promise( resolve => setTimeout(resolve, 1000) );
> >    }
> >  };
> > ```
> _You can then use this async generator to consume sequence of random numbers asynchronously, like this:_
> > ```javascript
> >  // function creates async iterator using async generator
> >  async function consumeRandomNumbers() {
> >    const randomNumberIterator = randomNumberGenerator();
> >    // to consume each number asynchronously and log it to console
> >    for await (const number of randomNumberIterator) {
> >      console.log(number);
> >    }
> >  };
> > ```

> &emsp;_Let's say you're building real-time chat app using Node.js and WebSocket technology. You want to implement feature that allows users to see list of active users in chat room, which is updated in real-time as users join or leave the chat._\
> &emsp;_To implement this feature, you could create async generator function that generates sequence of active users, which is updated asynchronously as users join or leave the chat._
> > ```javascript
> >  async function* activeUserGenerator() {
> >    const activeUsers = new Set();
> >    while (true) {
> >      // wait for user to join or leave the chat
> >      const user = await new Promise( resolve => {
> >       // function listens for 'user-join' and 'user-leave' events from chatRoom object
> >        chatRoom.on('user-join', user => resolve(user));
> >        chatRoom.on('user-leave', user => resolve(user));
> >      } );
> >      // update set of active users
> >      if (chatRoom.has(user)) { activeUsers.add(user);
> >      } else { activeUsers.delete(user); }
> >      // yield current list of active users
> >      yield Array.from(activeUsers);
> >    }
> >  }
> > ```
> _You can then use this async generator to consume sequence of active users asynchronously in your chat application, like this:_
> > ```javascript
> >  async function renderActiveUsers() {
> >    const activeUserIterator = activeUserGenerator();
> >    for await (const activeUsers of activeUserIterator) {
> >      // render the list of active users on the screen
> >      renderActiveUserList(activeUsers);
> >    }
> >  }
> > ```

- - -

&emsp;``util.promisify()`` is utility that allows you to convert function that uses Node.js-style callback pattern into function that returns promise.\
> _Node.js-style callbacks usually follow pattern of having error object as first argument and result as second argument, like this:_
> > ```javascript
> >  function readFile(path, callback) {
> >    fs.readFile(path, (err, data) => {
> >      if (err) {
> >        callback(err, null);
> >      } else {
> >        callback(null, data);
> >      }
> >    });
> >  }
> > ```
> _With util.promisify(), you can convert this function into promise-based function, like this:_
> > ```javascript
> >  const util = require('util');
> >  const fs = require('fs');
> >    // to convert fs.readFile() into promise-based function readFile
> >    const readFile = util.promisify(fs.readFile);
> >  
> >  async function example() {
> >    try {
> >      // to wait for data to be read from file before logging it to console
> >      const data = await readFile('path/to/file.txt');
> >      console.log(data.toString());
> >    } catch (err) {
> >      console.error(err);
> >    }
> >  }
> > ```

