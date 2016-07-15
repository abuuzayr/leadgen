var express = require('express'),
  jsonParser = require('body-parser').json(),
  dbHandler = require('../../database-handler'),
  mongodb = require('mongodb'),
  dbManager = require('../../DatabaseManager/database-manager');

var dbMgmtRouter = express.Router();

dbMgmtRouter.route('dbmgmt/all')
  .get(function(req,res){
    var leads = [];
    dbHandler.dbQuerySA('local',null)
    .then(function(localLeads){
      leads = localLeads;
      return dbHandler.dbQuerySA('external',null);
    })
    .then(function(externalLeads){
      leads.concat(externalLeads);
      res.json(leads);
    })
    .catch(function(error){
      res.sendStatus(error);
    });
  })
  .put(jsonParser,function(req,res){
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
    if(!Array.isArray(req.body))
      res.sendStatus(400);
    else{
      for(var i in req.body){
        if(req.body[i]._id !== undefined)
          req.body[i]._id = new mongodb.ObjectID(req.body[i]._id);
      }
      dbHandler.dbDeleteSA('local',req.body)
      .then(function(success){
        res.sendStatus(success);
      })
      .catch(function(fail){
        res.sendStatus(fail);
      });
    }
  })
  .post(jsonParser,function(req,res){
    if(!Array.isArray(req.body))
      res.sendStatus(400);
    else{
      dbHandler.dbInsertSA('local',req.body)
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

dbMgmtRouter.post('/dbmgmt/local/import',function(req,res){
  if(!Array.isArray(req.body))
    res.sendStatus(400); 
  else{
    dbHandler.dbQuerySA('external',null)
    .then(function(externalLeads){
     return dbHandler.dbInsertSA('local',req.body); 
    })
    .then(function(success){
      res.sendStatus(success);
    })
    .catch(function(error){
      res.sendStatus(error);
    });
  } 
});



dbMgmtRouter.route('./dbmgmt/external')
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
      for(var i in req.body){
        if(req.body[i]._id !== undefined)
          req.body[i]._id = new mongodb.ObjectID(req.body[i]._id);
      }
      dbHandler.dbDeleteSA('external',req.body)
      .then(function(success){
        res.sendStatus(success);
      })
      .catch(function(fail){
        res.sendStatus(fail);
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
    res.sendStatus(success2);
  })
  .catch(function(error){
    res.sendStatus(error);
  });
});

module.exports = dbMgmtRouter;