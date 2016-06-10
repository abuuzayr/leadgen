var express = require('express');
var app = express();

app.use(express.static(__dirname + '../client'))
app.use('/', express.static(__dirname + '/../client'));

app.listen(8888, function(){
	console.log("express server on port 8888");
});