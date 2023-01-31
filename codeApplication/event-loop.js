const First = () => console.log('First: run function() from call stack');

const Second = () => process.nextTick( () => { console.log('Second: execute process.nextTick()'); } );

const Third = () => new Promise( (resolve, reject) => { resolve('Third: execute new Promise()'); } ).then(resolve => console.log(resolve) );     

const Fourth = () => setTimeout(() => console.log("Fourth: execute setTimeout(0)"), 0);

const Fifth = () => setImmediate( () => { console.log('Fifth: execute setImmediate()'); } );

const Sixth = () => setTimeout(() => console.log("Sixth: execute setTimeout(1500)"), 1500); 

Sixth(); Fifth(); Fourth(); Third(); Second(); First();
