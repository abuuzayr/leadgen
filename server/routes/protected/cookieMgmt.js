var express = require('express'),
  cookieGenerator = express.Router(),
  dbHandler = require('../../database-handler'),
  jsonParser = require('body-parser').json(),
  ContactsManager = require('../../ContactsManager/contacts-manager'),
  ScrapManager = require('../../ScrapingManager/scrap-manager'),
  mongodb = require('mongodb'),
  md5 = require('blueimp-md5'),
  MailinglistManager = require('../../MailinglistManager/mailinglist-manager'),
  MailchimpManager = require('../../MailchimpManager/syncContacts');
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