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


accountsettingsRouter.patch('/',function(req,res){
  var url = 'https://10.4.1.198/req/api/usermgmt/' + req.decoded._id;
  console.log(url);
  var j = request.jar();
  var cookie = request.cookie('session='+req.cookies.session);
  j.setCookie(cookie,url);
  var obj = {
    password : req.body.pwd.newPwd
  };
  console.log(obj);
  request({
            url: url,
      headers:{
             'Host' : '10.4.1.213'
            },
            agentOptions:{
              cert: fs.readFileSync(certFile),
              key: fs.readFileSync(keyFile),
              rejectUnauthorized: false
            },
            method:'PUT',
            json:true,
            jar: j,
            body:obj
          },function(err,response,body ){
    if(err){
      console.log(err);
      res.sendStatus(500);
    }
    else{
      console.log(body);
      res.sendStatus(201);
    }
  });  
});


module.exports = accountsettingsRouter;
