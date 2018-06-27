'use strict';

const fs = require('fs'); 
const express = require('express');
const bodyParser = require('body-parser');
const dateTime = require('node-datetime');
const mkdirp = require('mkdirp');
const multer  = require('multer');
const path = require('path')

// Constants
const port = 3000;
const checkFile = 'activated.flag';
const logFile = 'findmac.log';
const upload = multer({
  dest: 'temp/',
  limits: { fileSize: 5 * 1024 * 1024, files: 1 }
});

// App
const app = express();
const jsonParser = bodyParser.json();
// app.use(bodyParser.json());

const ip = function(q) {
  return q.headers['x-forwarded-for'] || q.connection.remoteAddress;
}

const log = function(ip, tag, value) {
  var entry = {
    ip: ip,
    date: dateTime.create().format('Y-m-d H:M:S'),
    tag: tag,
    value: value
  };

  fs.appendFile(logFile, JSON.stringify(entry), function (error) {
    if (error) return console.log('ERROR: Writing log file', error);
  });
};

const saveFile = function(tag, file) {
  // sanitize input
  tag = tag.replace('.', '').replace('/', '').replace('\\', '');

  mkdirp('files', function(error) { 
    if (error) return console.log('ERROR: Creating file directory', error);
  });

  mkdirp('files/' + tag, function(error) { 
    if (error) return console.log('ERROR: Creating file directory', error);
  });

  var timestamp = (new Date().getTime());
  //var extension = path.extname(file.originalname);
  var extension = file.originalname.split('.').splice(1).join('.');
  var newFile = 'files/' + tag + '/' + timestamp + '-' + file.filename + '.' + extension;
  /*fs.writeFile(newFile, value, 'base64', function(error) {
    if (error) return console.log('ERROR: Storing the image', error);
  });*/
  fs.rename(file.path, newFile, function(error) {
    if (error) return console.log('ERROR: Storing the file', error);
  });
};

app.get('/', (q, r) => {
  r.send('Service is running!\n');
});

app.post('/tag/:tag', jsonParser, (q, r) => {
  if (!q.body) return r.sendStatus(400);

  log(ip(q), q.params.tag, q.body);
  r.end();
});

app.post('/file/:tag', upload.single('input'), (q, r) => {
  if (!q.body || !q.file || !q.params.tag) return r.sendStatus(400);

  saveFile(q.params.tag, q.file);
  r.end();
});

// TODO: Return settings like intervals
app.get('/check', (q, r) => {
  //r.json({'result': fs.existsSync(checkFile)});
  if (fs.existsSync(checkFile)) return r.send("true");

  return r.send("false");
});

app.listen(port, (error) => {
  if (error) return console.log('ERROR: Could not start server', error);

  console.log(`Server is listening on ${port}`);
});
