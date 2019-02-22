var express = require('express');

const app = module.exports = express();

app.use(express.static(__dirname + '/'));

app.listen(3050);
console.log('Express started on port 3050');
