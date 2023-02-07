'use strict';

// edit previous example with Promise
function doSimpleWork(simpleAction) { 
  if (hasDeliveryArrived) { console.log(`1. The task < ${simpleAction} > is completed.`); 
    return true
  } else {console.log("1. Unfortunately, it has not been delivered yet.");
    return false }; 
};

function doTesting() { // A function that will be passed as a callback.
  if (isElectricity) { console.log('3a. In progress < Testing quality of the spare parts. >');  
    return true
  } else { console.log("3. We cannot do this without electricity.");
    return false}; 
};  

function doPacking() { // A function that will be passed as a callback.
  if (isElectricity) { console.log('3b. In progress < Packing the parts according to the orders. >');  
    return true
  } else { console.log("3. We cannot do this without electricity.");
    return false}; 
};  

let hasDeliveryArrived = true;
let isElectricity = true;
 
function doСomplexWork(firstTask, secondTask, mainTask) { 
  return new Promise( (resolve, reject) => { 
   // let success = setTimeout(() => doSimpleWork(firstTask), 2000);     
      if (doSimpleWork(firstTask)) {  resolve();
      } else { reject('Сomplex work has failed.'); }
  } )
  .then( () => { console.log(`2. Process < ${secondTask} > has been executed.`) } )
  .then( () => { mainTask() } )
  .then( () => { console.log('Сomplex work is done.') } )
  .catch( (error) => { console.log(error); } );
};

doСomplexWork('Unload parts at the warehouse № 1.', 'Bring the parts to the engineering department.', doTesting);

hasDeliveryArrived = false;
doСomplexWork('Transfer quality parts to the warehouse № 2.', 'Bring the parts to the workshop.', doPacking);