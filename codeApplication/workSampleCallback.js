'use strict';

// example function with different callbacks
let hasDeliveryArrived = true;
let isElectricity = true;

function doSimpleWork(simpleAction) { 
  if (hasDeliveryArrived) { console.log(`1. The task < ${simpleAction} > is completed.`); 
    return true
  } else {console.log("1. Unfortunately, it has not been delivered yet.");
    return false }; 
}
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

function doСomplexWork(firstTask, secondTask, callback) { // A function that will execute actions consecutively.
  if (!doSimpleWork(firstTask)) return;
  console.log(`2. Process < ${secondTask} > has been executed.`);
  callback();
  console.log("Сomplex work is done.");
};

doСomplexWork('Unload parts at the warehouse № 1.', 'Bring the parts to the engineering department.', doTesting);

hasDeliveryArrived = false;
doСomplexWork('Transfer quality parts to the warehouse № 2.', 'Bring the parts to the workshop.', doPacking);
