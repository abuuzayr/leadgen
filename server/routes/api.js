var express = require('express');
var apiRouter = express.Router();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var http403 = require('../utils/403')();

apiRouter.use(bodyParser.json({limit: '500mb'}));
apiRouter.use(bodyParser.urlencoded({limit: '500mb', extended:true}));
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

apiRouter.use('*',http403.decodeCookieInfo);
apiRouter.use('*',http403.decodeAccessInfo);

var leadfinderMgmt = require('./protected/leadfinderMgmt.js');
var leadlistMgmt = require('./protected/leadlistMgmt.js');
var cookieGenerator = require('./protected/cookieMgmt.js');
var dbMgmt = require('./protected/dbMgmt.js');
var account = require('./protected/accountsettingsMgmt.js');

apiRouter.use('/cookie', cookieGenerator);
apiRouter.use('/scrape', leadfinderMgmt);
apiRouter.use('/contacts', leadlistMgmt);
apiRouter.use('/dbmgmt', dbMgmt);
apiRouter.use('/acct', account);

//apiRouter.use('*', http404.notFoundMiddleware);

module.exports = apiRouter;
