var express = require('express'),
  jsonParser = require('body-parser').json(),
  dbHandler = require('../../database-handler'),
  mongodb = require('mongodb'),
  dbManager = require('../../DatabaseManager/database-manager');

var dbMgmtRouter = express.Router();

dbMgmtRouter.use('/',function(req,res,next){
  console.log('welcome to database management');
  next();
});

dbMgmtRouter.route('/dbmgmt/all')
  .get(function(req,res){
    var leads = [];
    dbHandler.dbQuerySA('local',null)
    .then(function(localLeads){

      for(var i in localLeads)
        leads.push(localLeads[i]);

      return dbHandler.dbQuerySA('external',null);
    })
    .then(function(externalLeads){

      for(var i in externalLeads)
        leads.push(externalLeads[i]);

      res.json(leads);
    })
    .catch(function(error){
      res.sendStatus(error);
    });
  })
  .put(jsonParser,function(req,res){
    console.log('deleting contacts');
    if(!Array.isArray(req.body))
      res.sendStatus(400);
    else{
      var promiseArr = [];
      for(var i=0;i<req.body.length;i++){
        var obj = req.body[i];
        if(obj._id !== undefined)
          obj._id = new mongodb.ObjectID(obj._id);
      }
      dbHandler.dbDeleteSA('local',req.body)
      .then(function(success1){
        return dbHandler.dbDeleteSA('external',req.body);
      })
      .then(function(success2){
        res.sendStatus(200);
      }) 
      .catch(function(error){
        res.sendStatus(error);
      });
    }
  });



dbMgmtRouter.route('/dbmgmt/local')
  .get(function(req,res){
    dbHandler.dbQuerySA('local',null)
    .then(function(localLeads){
      res.json(localLeads);
    })
    .catch(function(error){
      res.sendStatus(error);
    });
  })
  .put(jsonParser,function(req,res){
    console.log('deleting local contacts');
    console.log(req.body);
    if(!Array.isArray(req.body))
      res.sendStatus(400);
    else{
      var promiseArr = [];
      for(var i in req.body){
          promiseArr.push(dbHandler.dbDeleteSA('local',req.body[i]));
      }
      Promise.all(promiseArr)
      .then(function(success){
        res.sendStatus(200);
      })
      .catch(function(fail){
        res.sendStatus(500);
      });
    }
  })
  .post(jsonParser,function(req,res){
    console.log(req.body);
    if(!Array.isArray(req.body.data))
      res.sendStatus(400);
    else{
      for(var i in req.body.data){
          if(req.body.type == 'corporate')
            req.body.data[i].type = 1;
          else
            req.body.data[i].type = 2;

          console.log(req.body.data[i]);
      }
      dbHandler.dbInsertSA('local',req.body.data)
      .then(function(success){
        res.sendStatus(success);
      })
      .catch(function(fail){
        res.sendStatus(fail);
      });
    }
  })
  .patch(function(req,res){
    if(!Array.isArray(req.body) || req.body.length != 2)
      res.sendStatus(400);
    else{
      var originObj = {};
      originObj._id  = req.body[0]._id;

      dbHandler.dbUpdateSA('local',originObj,req.body[1])
      .then(function(success){
        res.sendStatus(success);
      })
      .catch(function(fail){
        res.sendStatus(fail);
      });
    }
  });

dbMgmtRouter.get('/dbmgmt/local/import',function(req,res){

  dbHandler.dbQuerySA('external',null)
  .then(function(externalLeads){
   return dbHandler.dbInsertSA('local',externalLeads); 
  })
  .then(function(success){
    res.sendStatus(success);
  })
  .catch(function(error){
    res.sendStatus(error);
  });

});



dbMgmtRouter.route('/dbmgmt/external')
  .get(function(req,res){
    dbHandler.dbQuerySA('external',null)
    .then(function(externalLeads){
      res.json(externalLeads);
    })
    .catch(function(failure){
      res.sendStatus(failure);
    });
  })
  .put(jsonParser,function(req,res){
    if(!Array.isArray(req.body))
      res.sendStatus(400);
    else{
      var promiseArr = [];
      for(var i in req.body){
        promiseArr.push(dbHandler.dbDeleteSA('external',req.body[i]));
      }
      Promise.all(promiseArr)
      .then(function(success){
        res.sendStatus(200);
      })
      .catch(function(fail){
        res.sendStatus(500);
      });
    }
  })
  .patch(jsonParser,function(req,res){
    if(!Array.isArray(req.body) || req.body.length != 2)
      res.sendStatus(400);
    else{
      var originObj = {};
      originObj._id  = req.body[0]._id;

      dbHandler.dbUpdateSA('external',originObj,req.body[1])
      .then(function(success){
        res.sendStatus(success);
      })
      .catch(function(fail){
        res.sendStatus(fail);
      });
    }
  });

dbMgmtRouter.get('/dbmgmt/external/update',function(req,res){
  dbHandler.dbQuerySA('external',null)
  .then(function(externalLeads){
    if(externalLeads.length > 0)
      return dbHandler.dbDropCollection('external',null);
    else
      return 1;
  })
  .then(function(success1){
    return dbManager.retrieveExternalLeads();
  })
  .then(function(leads){
    return dbHandler.dbInsertSA('external',leads);
  })
  .then(function(success2){
    return dbHandler.dbQuerySA('external',null);
  })
  .then(function(newLeads){
    res.json(newLeads);
  })
  .catch(function(error){
    res.sendStatus(error);
  });
});

module.exports = dbMgmtRouter;