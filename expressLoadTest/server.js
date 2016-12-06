'use strict';

const express = require('express')
const app = express()
const http = require('http');
const parseUrl = require('url').parse;
const toobusy = require('toobusy-js');

toobusy.onLag(currentLag => {
  console.log("Event loop lag detected! Latency: " + currentLag + "ms");
});

app.use(function(req, res, next) {
  if (toobusy()) {
    res.send(503, "I'm busy right now, sorry.");
  } else {
    next();
  }   
});

app.get('/', function (req, res) {
  
    try {
      const url = 'http://201.6.17.212/AVS/besc?action=GetAggregatedContentDetails&channel=PCTV&version=1.2&contentId=1000001189';
      let options = parseUrl(url);      
      let keepAliveAgent = new http.Agent({ keepAlive: true });
      options.agent = keepAliveAgent;
      let r = http.get(url, resp => {

        let body = '';
        resp.on('data', (chunk) => {
          body += chunk;
        });

        resp.on('end', () => {
          let response = JSON.parse(body);
          res.send(response.resultObj.contentInfo);
        });
        
      }).on('error', (e) => {
        console.error('Request Error.', e);
      }).on('socket', (socket) => {
        socket.emit('agentRemove');
      });      
    }
    catch (e) {
      console.error('Request Error.', e);
    }
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
