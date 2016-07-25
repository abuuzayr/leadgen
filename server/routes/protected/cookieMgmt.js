var express = require('express');
var cookieGenerator = express.Router();
var http403 = require('../../utils/403')();

  

cookieGenerator.use('/',function(req,res,next){
  console.log(req.cookies);
  console.log('Welcome to cookie api');
  next();
});
cookieGenerator.get('/', function(req, res) {
  console.log('cookie request');
  if (!req.cookies)
    res.sendStatus(400);
  else {
    http403.generateCookie(req,res);
  }
});

module.exports = cookieGenerator;