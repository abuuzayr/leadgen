var express = require('express');
var cookieGenerator = express.Router();
var http403 = require('../../utils/403')();

cookieGenerator.get('/', function(req, res) {
  if (!req.cookies)
    res.sendStatus(400);
  else {
    http403.generateCookie(req,res);
  }
});

module.exports = cookieGenerator;