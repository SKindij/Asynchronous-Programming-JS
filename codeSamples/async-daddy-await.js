let isDadHappy = true;	let phone	= {};  

const willGetNewPhone = new Promise( (resolve, reject) => {
        if (isDadHappy) { phone = { brand: 'Samsung', color: 'black' };
            resolve(phone); 
        } else { let reason = new Error('dad is not happy');
            reject(reason);  }
    }   );

async function showOff(phone) { return new Promise( (resolve, reject) => { 
    let message = 'Hey friend, I have a new ' + phone.color + ' ' + phone.brand + ' phone';
            resolve(message); } );
};

async function askDad() {
    try { console.log('before asking dad');
        phone = await willGetNewPhone; let message = await showOff(phone);
            console.log(message);
                console.log('after asking dad'); }
    catch (error) {  console.log(error.message); }
}

(async () => { await askDad(); })();
