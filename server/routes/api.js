var express = require('express'),
  apiRouter = express.Router(),
  dbHandler = require('../database-handler'),
  jsonParser = require('body-parser').json(),
  ContactsManager = require('../ContactsManager/contacts-manager'),
  ScrapManager = require('../ScrapingManager/scrap-manager'),
  dbManager = require('../DatabaseManager/database-manager'),
  mongodb = require('mongodb'),
  md5 = require('blueimp-md5'),
  MailinglistManager = require('../MailinglistManager/mailinglist-manager'),
  MailchimpManager = require('../MailchimpManager/syncContacts');


var apiKey = 'a21a2e3e5898ad6e1d50046f8c33b8ff-us13';

apiRouter.use('/', function(req, res, next) {
  console.log('Welcome to the API page');
  console.log(req.url);
  next();
});

var leadfinderMgmt = require('./protected/leadfinderMgmt.js');
var leadlistMgmt = require('./protected/leadlistMgmt.js');
var cookieGenerator = require('./protected/cookieMgmt.js');
var dbMgmt = require('./protected/dbMgmt.js');

//PATH

apiRouter.use('/cookie', cookieGenerator);
apiRouter.use('/', leadfinderMgmt);
apiRouter.use('/', leadlistMgmt);
apiRouter.use('/', dbMgmt);

module.exports = apiRouter;