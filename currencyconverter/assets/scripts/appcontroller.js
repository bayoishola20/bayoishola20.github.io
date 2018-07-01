class CurrencyConverter {

    constructor() {
        this.registerServiceWorker();
        this.dbPromise = this.openDatabase();
        this.getAllCurrencies();
    }

    registerServiceWorker() {
        if (!navigator.serviceWorker) return;
        navigator.serviceWorker.register('sw.js').then(reg => {});
    }

    openDatabase() {
        if (!('indexedDB' in window)) {
            console.log('IndexedDB not supported');
            return Promise.resolve();
          }
        
          return idb.open('currencyConverter', 3, upgradeDb => {
                switch(upgradeDb.oldVersion) {
                    case 0:
                        upgradeDb.createObjectStore('currencies');
                    case 1:
                        upgradeDb.transaction.objectStore('currencies').createIndex('id', 'id', {unique: true});
                    case 2:
                        upgradeDb.createObjectStore('currencyRates', {keyPath: 'query'});
                        upgradeDb.transaction.objectStore('currencyRates').createIndex('query', 'query', {unique: true});
                }
         });
    }

    addCurrenciesToCache(currencies) {
        this.dbPromise.then( (db) => {
            if (!db) return;
            
            let tx = db.transaction('currencies', 'readwrite');

            let store = tx.objectStore('currencies');

            for (let currency of currencies) {
                store.put(currency, currency.id);
            }
           // return tx.complete;

            store.index('id').openCursor(null, "prev").then(cursor => {
                return cursor.advance(200);
            }).then(function deleteRest(cursor) {
                if (!cursor) return;
                cursor.delete();
                return cursor.continue().then(deleteRest);
            });
        }).then(() => {
            console.log('Currencies added to indexDB');
         }).catch(err => console.log(`Something went wrong: ${err}`));
    }

    addRateToCache(rate, fromCurrency, toCurrency) {
        this.dbPromise.then(db => {
            if (!db) return;
            
            let tx = db.transaction('currencyRates', 'readwrite'); 
            let store = tx.objectStore('currencyRates');
            let query = `${fromCurrency}_${toCurrency}`;

            store.put({ query, rate });


           store.index('query').openCursor(null, "prev").then(cursor => {
                return cursor.advance(200);
            }).then(function deleteRest(cursor){
                if (!cursor) return;
                cursor.delete();
                return cursor.continue().then(deleteRest);
            });
        }).then(() => {
            console.log(`The exchange rate for ${fromCurrency} and ${toCurrency} has been added to cache`);
         }).catch(err => console.log(`Oops! ${err}`));
    }

    getRateFromCache(fromCurrency, toCurrency) {
       return this.dbPromise.then(db => {
            if (!db) return;

            const query = `${fromCurrency}_${toCurrency}`;
            let tx = db.transaction('currencyRates', 'readwrite'); 
            let store = tx.objectStore('currencyRates');

           return store.index('query').get(query);
        }).then( (RateObj) => { 
                   const currencyRate  = RateObj.rate;
                    return {currencyRate, appStatus: 'offline'};
         }).catch( (err) => {
             this.postToHTMLPage(`Oops, rate not seen in cache`);
             return err;
        });
    }

    showCachedCurrencies() {
        return this.dbPromise.then( (db) => {

            if (!db) return;
        
            let index = db.transaction('currencies')
              .objectStore('currencies').index('id');
        
            return index.getAll().then( (currencies) => {
                console.log(`Currencies fetched`);

                let selectFields = document.querySelectorAll('.currency');


                for(let currency of currencies){
                    let option = this.createElement('option');
                    if(currency.hasOwnProperty('currencySymbol')) option.text = `${currency.currencyName} ${currency.currencySymbol}`;
                    else option.text = `${currency.currencyName} (${currency.id})`;
                    option.value = currency.id;

                    this.appendElement(selectFields,option);
                }
                this.postToHTMLPage('msg', 'Offline, no internet connection detected!');
            });
          });
    }
    
    getAllCurrencies() {
        fetch('https://free.currencyconverterapi.com/api/v5/currencies').then(response => {
            return response.json();
        }).then(response => {
            let currencies = Object.values(response.results);
            let selectFields = document.querySelectorAll('select.currency');


            for(let currency of Object.values(currencies)){
                let option = this.createElement('option');
                if(currency.hasOwnProperty('currencySymbol')) option.text = `${currency.currencyName} (${currency.currencySymbol})`;
                else option.text = `${currency.currencyName} (${currency.id})`;
                 option.value = currency.id;

                 this.appendElement(selectFields,option);
            }

            this.addCurrenciesToCache(currencies);

            this.postToHTMLPage('msg','Online');
           
        }).catch( err => {
            console.log(`Offline or poor connection: ${err}`);
            this.showCachedCurrencies();
        });
    }


    postToHTMLPage(ans, msg, outputResult = {}) {
        if(ans === 'result') {
            document.getElementById('result').value = `${outputResult.result.toFixed(2)}`;
        }

        if(ans = 'offline') {
            document.getElementById('result').innerHTML = '0.00';
        }

        if(msg !== ''){
            document.getElementById('alert').innerHTML = msg;
        }
        return;
    }

    getConversionRate(fromCurrency, toCurrency) {
        fromCurrency = encodeURIComponent(fromCurrency);
        toCurrency = encodeURIComponent(toCurrency);
        let query = fromCurrency + '_' + toCurrency;

        return fetch(`https://free.currencyconverterapi.com/api/v5/convert?q=${query}&compact=ultra`).then(response => {
            return response.json();
        }).then(response => {


            const currencyRate = response[Object.keys(response)]; 
            return  {currencyRate, appStatus: 'online'};
        }).catch(error => {

            const currencyRate = this.getRateFromCache(fromCurrency, toCurrency);
            return  currencyRate;
        });
    }

    createElement(element) {
        return document.createElement(element);
        return;
    }

   appendElement(parentElement, element)
   {
       let element2 = element.cloneNode(true);
       parentElement[0].appendChild(element);
       parentElement[1].appendChild(element2);
       return;
   }
}


(function(){
    const converter = new CurrencyConverter();


    document.getElementById('quickConvert').addEventListener('click', () =>{
        let msg = '';
         converter.postToHTMLPage('msg', 'Getting exchange rate...');

        const amount = document.getElementById('from_amount').value;
        const fromCurrency = document.getElementById('from_currency').value;
        const toCurrency = document.getElementById('to_currency').value;
    

        if(amount === '' || amount === 0 || isNaN(amount)) msg = `Kindly insert numbers greater than ${amount}.`;
        if(fromCurrency ==='') msg = 'Kindly select initial currency';
        if(toCurrency ==='') msg = 'Kindly select destination currency';
        if (fromCurrency === toCurrency) msg = 'Same currency conversion is not valid';
        else {
            converter.getConversionRate(fromCurrency,toCurrency).then( response =>{ 
                 const rate = response.currencyRate;
                 const appStatus = response.appStatus;
                if(rate !== undefined)
                {
                    const result = amount * rate;
                
                    msg = `Current exchange rate is ${rate.toFixed(5)}`
                    converter.postToHTMLPage('result', msg, {result, toCurrency});


                    if(appStatus ==='online')  converter.addRateToCache(rate, fromCurrency, toCurrency); 
                }
                else converter.postToHTMLPage('offline', 'You are offline!');
            }).catch( err => {
                console.log(`Exchange rate not found in indexDB: ${err}`);
                converter.postToHTMLPage('', err);
            });
        }
    
        converter.postToHTMLPage('msg', msg); 
    });


})();