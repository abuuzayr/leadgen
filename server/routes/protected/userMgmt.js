var express = require('express');
var accountsettingsRouter = express.Router();
var request = require('request');
var http403 = require('../../utils/403')();

var fs = require('fs');
var path = require('path');
var certFile = path.resolve(__dirname, '../../../certs/server.crt');
var keyFile = path.resolve(__dirname, '../../../certs/server.key');

//ACCESS CONTROL
accountsettingsRouter.use('*',http403.verifyAccess('usermgmt'));


accountsettingsRouter.route('/')
.get(function(req,res){
  var url = 'https://10.4.1.198/req/api/usermgmt';

  var j = request.jar();
  var cookie = request.cookie('session='+req.cookies.session);
  j.setCookie(cookie,url);

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
            method:'GET',
            json:true,
            jar: j
          },function(err,response,body ){
    if(err){
      console.log(err);
      res.sendStatus(500);
    }
    else{
      var arr = [];
      for(var i in body){
        console.log(body[i].application.bulletlead);
        var obj = {
          username : body[i].username,
          email : body[i].email,
          usertype : body[i].application.bulletlead.usertype
        };
        if(obj.usertype !== 'SuperAdmin')
          arr.push(obj);
      }
      res.json(arr);
    }
  });
})
.post(function(req,res){
  
 
  var url = 'https://10.4.1.198/req/api/usermgmt';

  var j = request.jar();
  var cookie = request.cookie('session='+req.cookies.session);
  j.setCookie(cookie,url);
  var obj = {
    userData : req.body
  }
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
            method:'POST',
            json:true,
            jar: j,
            body:obj
          },function(err,response,body ){
    if(err){
      res.sendStatus(500);
    }
    else{
      res.sendStatus(201);
    }
  });
});

accountsettingsRouter.route('/:id')
.get(function(req,res){

})
.put(function(req,res){

})
.patch(function(req,res){

});

module.exports = accountsettingsRouter;
