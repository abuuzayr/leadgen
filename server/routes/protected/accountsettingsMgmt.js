var express = require('express');
var accountsettingsRouter = express.Router();
var request = require('request');
var http403 = require('../../utils/403')();

var fs = require('fs');
var path = require('path');
var certFile = path.resolve(__dirname, '../../../certs/server.crt');
var keyFile = path.resolve(__dirname, '../../../certs/server.key');

//ACCESS CONTROL
accountsettingsRouter.use('*',http403.verifyAccess('accountsetting'));

module.exports = accountsettingsRouter;
