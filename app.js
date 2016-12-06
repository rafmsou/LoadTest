'use strict';

const http = require('http');
const parseUrl = require('url').parse;

let times = []; 
let promises = [];

const fetch_one = function () {
  return new Promise((resolve, reject) => {
  
    try {
      const url = 'http://201.6.17.212/AVS/besc?action=GetAggregatedContentDetails&channel=PCTV&version=1.2&contentId=1000001189';
      let startTime = Date.now();

      let options = parseUrl(url);
      let keepAliveAgent = new http.Agent({ keepAlive: true, maxSockets: 2000 });
      options.agent = keepAliveAgent;
      
      let r = http.get(url, (resp) => {

        let body = '';
        resp.on('data', (chunk) => {
          body += chunk;
        });

        resp.on('end', () => {
          let endTime = Date.now() - startTime;
          times.push(endTime);
          resolve();
        });
      
      }).on('error', (e) => {
        console.error('Request Error.', e);
        resolve();
      });
    }
    catch(e) {
      console.log('exception: ', e);
    }    
  })
}

for (let i=0; i<2000; i++) {
  promises.push(fetch_one());
}

Promise.all(promises).then(() => {
  console.log(times);
}).catch(e => console.error(' Error.', e));