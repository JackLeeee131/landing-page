'use strict';
const kafka = require('kafka-node');
// const config = require('./config');
const express = require('express');
const path = require('path');
const WebSocket = require('ws');
const axios = require('axios');
const fs = require('fs');
const http = require('http');
// Constants

const bodyParser = require('body-parser');
// const PORT = process.env.PORT || 8080;
// const HOST = '0.0.0.0';

// const CLIENT_BUILD_PATH = path.join(__dirname, '../../client/build');

const key = fs.readFileSync(__dirname + '/../selfsigned.key');
const cert = fs.readFileSync(__dirname + '/../selfsigned.crt');
const options = {
  key: key,
  cert: cert
};

// App
const app = express();
app.use(express.static('public'));
app.use(bodyParser.json());

const ser = http.createServer(options, app);
const server = new WebSocket.Server({
  options: options,
  server: ser.listen(8080, () => console.log(`Server running on port 8080.`))
});

server.on('connection', socket => {
  socket.on('message', message => {
    var data = JSON.parse(message);
    if (data.parcelId.length != 0) {
      try {
        const Producer = kafka.Producer;
        const Client = kafka.KafkaClient;
        const client = new Client({
          autoConnect: true,
          kafkaHost: '172.17.0.1:9092'
        });

        const producer = new Producer(client);
        const kafka_topic = 'mp_scrape_request';
        console.log(kafka_topic);
        var payloads = [];
        data.parcelId.forEach(item => {
          let payload = [
            {
              topic: kafka_topic,
              messages: [
                JSON.stringify({
                  parcel_id: item,
                  chosen_carrier: '',
                  scraper: '',
                  uuid: data.uuid,
                  is_new: true,
                  ip_address: '1.52.73.180',
                  suggested_carrier: '',
                  organization_id: '2'
                })
              ]
            }
          ];
          payloads.push(payload);
        });

        producer.on('ready', async function() {
          console.log('Producer ready');
          payloads.forEach(item => {
            producer.send(item, (err, data) => {
              if (err) {
                console.log(
                  '[kafka-producer -> ' +
                    kafka_topic +
                    ']: broker update failed'
                );
              } else {
                console.log(
                  '[kafka-producer -> ' +
                    kafka_topic +
                    ']: broker update success'
                );
                console.log('data output from broker');
                console.log(data);
              }
            });
          });
        });

        producer.on('error', function(err) {
          console.log(err);
          console.log(
            '[kafka-producer -> ' + kafka_topic + ']: connection errored'
          );
          throw err;
        });
      } catch (e) {
        console.log(e);
      }

      const Consumer = kafka.Consumer;
      const Clientt = kafka.KafkaClient;
      const clientt = new Clientt({
        autoConnect: true,
        kafkaHost: '172.17.0.1:9092'
      });
      const consumer = new Consumer(clientt, [{ topic: 'new_refined_data' }]);
      consumer.on('message', mess => {
        console.log(mess);
        socket.send(JSON.stringify(mess));
      });

      axios
        .post('http://172.17.0.1:8006/api/v2/parcel-monitor/get-my-parcels/', {
          organization_id: 2,
          cms_slug: '',
          uuid: data.uuid
        })
        .then(res => {
          socket.send(JSON.stringify(res.data));
        })
        .catch(err => {
          console.error(err);
        });
    } else {
      axios
        .post('http://172.17.0.1:8006/api/v2/parcel-monitor/get-my-parcels/', {
          organization_id: 2,
          cms_slug: '',
          uuid: data.uuid
        })
        .then(res => {
          socket.send(JSON.stringify(res.data));
        })
        .catch(err => {
          console.error(err);
        });
    }
  });
});

// Static files
// app.use(express.static("public"));

// API
// app.get('/api', (req, res) => {
//   res.set('Content-Type', 'application/json');
//   let data = {
//     message: 'Hello world, Woooooeeeee!!!!'
//   };
//   res.send(JSON.stringify(data, null, 2));
// });

// // All remaining requests return the React app, so it can handle routing.
// app.get('*', function(request, response) {
//   response.sendFile(path.join(CLIENT_BUILD_PATH, 'index.html'));
// });

// app.listen(PORT, HOST);
// console.log(`Running on http://${HOST}:${PORT}`)}
