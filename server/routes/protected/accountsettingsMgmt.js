var express = require('express');
var accountsettingsRouter = express.Router();
var http403 = require('../../utils/403')();


//ACCESS CONTROL
accountsettingsRouter.use('*',http403.verifyAccess('accountsetting'));

module.exports = accountsettingsRouter;