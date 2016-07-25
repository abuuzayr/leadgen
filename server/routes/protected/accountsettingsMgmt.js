var express = require('express');
var accountsettingsRouter = express.Router();
var request = require('request');
var http403 = require('../../utils/403')();


//ACCESS CONTROL
accountsettingsRouter.use('*',http403.verifyAccess('accountsetting'));


accountsettingRouter.route('/')
.get(function(req,res){
  var coId = req.decoded.companyId;
  request({
            url:'//10.4.1.198/api/usermgmt',
            method:'GET',
            json:true
          },function(err,response,body ){
    if(err)
      res.sendStatus(500);
    else
    res.json(body);

  })
})
.post(function(req,res){

});

accountsettingRouter.route('/:id')
.get(function(req,res){

})
.put(function(req,res){

});
.patchs(function(req,res){

});

module.exports = accountsettingsRouter;
