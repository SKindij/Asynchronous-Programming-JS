## Asynchronous programming in JavaScript as of today (_continuation of the [main topic](https://github.com/SKindij/Asynchronous-JS-Nodejs)_)
**contracts:** ``(...args, callback) => callback(err, data);``

You can find code examples in the files mentioned below.

### file timers.js
> If we want to make a certain time delay. <br>
> inside the function ``delay()`` we use...
> > - while() / new Date().getTime()
> > - async () / await / new Promise() / setTimeout()
> > - new Promise() / setTimeout() / .then()
- - -

### file callbacks.js
> Here we specify the emulation of asynchronous calls:
> > - reading of configuration;
> > - executing SQL query;
> > - making GET request;
> > - reading a file;

- - -

### file workSampleCallback.js
***A callback is a function that must be executed after another function has completed its work.***
> Imagine that a complex task has to be performed at the enterprise.
> > We will use ``function doСomplexWork(firstTask, secondTask, callback)`` that accepts three arguments.
> > We will also have two functions ``doTesting()`` and ``doPacking()``, that we'll alternate between using as callbacks.

### file workSamplePromise.js
***The Promise() constructor takes a function as an argument.***
> Promises are useful when you have to handle more than one asynchronous task, one after another. 
> > Here we will also use a function ``doСomplexWork()`` with three arguments.<br>
> > And here ``.then()`` will come in handy.

- - -
