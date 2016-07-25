var express = require('express');
var accountsettingsRouter = express.Router();
var request = require('request');
var http403 = require('../../utils/403')();

//ACCESS CONTROL
accountsettingsRouter.use('*',http403.verifyAccess('accountsetting'));


accountsettingsRouter.route('/')
.get(function(req,res){
  var coId = req.decoded.companyId;
  var cookie = req.cookies.session;
  console.log("======Cookie is ========");
  console.log(cookie);
  request({
            url:'https://10.4.1.198/api/usermgmt',
            method:'GET',
            json:true,
            jar:true
          },function(err,response,body ){
    if(err){
      console.log(err);
      res.sendStatus(500);
    }
    else
    res.json(body);

  });
})
.post(function(req,res){

});

accountsettingsRouter.route('/:id')
.get(function(req,res){

})
.put(function(req,res){

})
.patch(function(req,res){

});

module.exports = accountsettingsRouter;
