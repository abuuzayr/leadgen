var express = require('express'),
  apiRouter = express.Router(),
  dbHandler = require('../database-handler'),
  bodyParser = require('body-parser'),
  ContactsManager = require('../ContactsManager/contacts-manager'),
  ScrapManager = require('../ScrapingManager/scrap-manager'),
  dbManager = require('../DatabaseManager/database-manager'),
  mongodb = require('mongodb'),
  md5 = require('blueimp-md5'),
  MailinglistManager = require('../MailinglistManager/mailinglist-manager'),
  MailchimpManager = require('../MailchimpManager/syncContacts');
  var http403 = require('../utils/403')();


var apiKey = 'a21a2e3e5898ad6e1d50046f8c33b8ff-us13';
var cookieParser = require('cookie-parser');

apiRouter.use(bodyParser.json({limit: '500mb'}));
apiRouter.use(cookieParser());

apiRouter.use( function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, X-Access-Token');
  if(req.method === 'OPTIONS')
    return res.status(200).send('Preflight get response');
  else
    return next();
});


apiRouter.use('/',function(req, res, next) {
  console.log('Welcome to the API page');
  console.log(req.url);
  next();
});

 apiRouter.use('*',http403.decodeCookieInfo);
 apiRouter.use('*',http403.decodeAccessInfo);

var leadfinderMgmt = require('./protected/leadfinderMgmt.js');
var leadlistMgmt = require('./protected/leadlistMgmt.js');
var cookieGenerator = require('./protected/cookieMgmt.js');
var dbMgmt = require('./protected/dbMgmt.js');

//PATH

apiRouter.use('/cookie', cookieGenerator);
apiRouter.use('/scrape', leadfinderMgmt);
apiRouter.use('/lead', leadlistMgmt);
apiRouter.use('/dbmgmt', dbMgmt);

//UNDEFINED ROUTES
//apiRouter.use('*', http404.notFoundMiddleware);

module.exports = apiRouter;