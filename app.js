'use strict';

const http = require('http');
const parseUrl = require('url').parse;
const async = require('async');

let times = []; 
let promises = [];

const fetch_one = function () {
  return new Promise((resolve, reject) => {
    const url = 'http://201.6.17.212/AVS/besc?action=GetAggregatedContentDetails&channel=PCTV&version=1.2&contentId=1000001189';

    let startTime = Date.now();

    let options = parseUrl(url);
    let keepAliveAgent = new http.Agent({ keepAlive: true });
    options.agent = keepAliveAgent;
    options.timeout = 5000;

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
  })
}

for (let i=0; i<5000; i++) {
  promises.push(fetch_one());
}

//async.parallel(promises);
Promise.all(promises).then(() => {
  console.log(times);
}).catch(e => console.error(' Error.', e));