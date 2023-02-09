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
let quantityGoods = 300;
let isElectricity = true;
 
function doСomplexWork(firstTask, secondTask, mainTask) { 
  return new Promise( (resolve, reject) => { 
   // let success = setTimeout(() => doSimpleWork(firstTask), 2000);     
      if (doSimpleWork(firstTask)) { resolve(quantityGoods);
      } else { reject('Сomplex work has failed.'); }
  } )
  .then( (result) => { console.log(result);
          console.log(`2. Process < ${secondTask} > has been executed.`);
          return result * Number((Math.random() * (1 - 0.8) + 0.8).toFixed(2)); } )
  .then( (result) => { console.log(result);
          if (mainTask()) { return result * Number((Math.random() * (1 - 0.8) + 0.8).toFixed(2));
          } else { reject('Сomplex work has failed.');} })
  .then( (result) => { console.log(result);
           console.log('Сomplex work is done.'); } )
  .catch( (error) => { console.log(error); } )
};

doСomplexWork('Unload parts at the warehouse № 1.', 'Bring the parts to the engineering department.', doTesting);

hasDeliveryArrived = false;
doСomplexWork('Transfer quality parts to the warehouse № 2.', 'Bring the parts to the workshop.', doPacking);
