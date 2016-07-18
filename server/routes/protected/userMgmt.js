var express = require('express'),
  userMgmtRouter = express.Router(),
  dbHandler = require('../../database-handler'),
  jsonParser = require('body-parser').json(),
  ContactsManager = require('../../ContactsManager/contacts-manager'),
  ScrapManager = require('../../ScrapingManager/scrap-manager'),
  mongodb = require('mongodb'),
  md5 = require('blueimp-md5'),
  MailinglistManager = require('../../MailinglistManager/mailinglist-manager'),
  MailchimpManager = require('../../MailchimpManager/syncContacts');
  var http403 = require('../../utils/403')();
  
  //ACCESS CONTROL
  userMgmtRouter.use('*',http403.verifyAccess('usermgmt'));