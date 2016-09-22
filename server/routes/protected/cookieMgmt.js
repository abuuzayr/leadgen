var express = require('express');
var cookieGenerator = express.Router();
var http403 = require('../../utils/403')();

cookieGenerator.post('/', function(req, res) {
    http403.generateCookie(req,res);
});

module.exports = cookieGenerator;