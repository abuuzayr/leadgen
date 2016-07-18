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

  cookieGenerator.get('/cookie/getCookie', function(req, res) {
  if (!req.body)
    res.sendStatus(400);
  else {
    http403.generateCookie(req,res);
      }
});

module.exports = cookieGenerator;