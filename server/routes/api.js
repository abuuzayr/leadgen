var express = require('express');
var apiRouter = express.Router();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

apiRouter.use(bodyParser.json({limit: '500mb'}));
apiRouter.use(cookieParser());

apiRouter.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, X-Access-Token');
  if(req.method === 'OPTIONS')
    return res.status(200).send('Preflight get response');
  else
    return next();
});


apiRouter.use('/', function(req, res, next) {
  console.log('Welcome to the API page');
  next();
});

var leadfinderMgmt = require('./protected/leadfinderMgmt.js');
var leadlistMgmt = require('./protected/leadlistMgmt.js');
var cookieGenerator = require('./protected/cookieMgmt.js');
var dbMgmt = require('./protected/dbMgmt.js');

//PATH
apiRouter.use('/', cookieGenerator);
apiRouter.use('/', leadfinderMgmt);
apiRouter.use('/', leadlistMgmt);
apiRouter.use('/', dbMgmt);

module.exports = apiRouter;