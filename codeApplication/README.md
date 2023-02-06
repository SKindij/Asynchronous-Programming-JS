## Asynchronous programming in JavaScript as of today (_continuation of the [main topic](https://github.com/SKindij/Asynchronous-JS-Nodejs)_)

- [x] callbacks >> async.js 
- [x] callbacks >> promises >> async/await 
- [x] callbacks >> events >> observable 
- [x] functor + chaining + composition 

**contracts:** ``(...args, callback) => callback(err, data);``
___
## You can find code examples in the files mentioned below.

### file timers.js

> If we want to make a certain time delay. <br>
> inside the function ``delay()`` we use...
> > - while() / new Date().getTime()
> > - async () / await / new Promise() / setTimeout()
> > - new Promise() / setTimeout() / .then()
___

### file callbacks.js

> Here we specify the emulation of asynchronous calls:
> > - reading of configuration;
> > - executing SQL query;
> > - making GET request;
> > - reading a file;

