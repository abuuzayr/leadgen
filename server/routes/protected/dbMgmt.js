var express = require('express'),
  jsonParser = require('body-parser').json(),
  dbManager = require('../../DatabaseManager/database-manager');

var dbMgmtRouter = express.Router();

  dbMgmtRouter.route('/dbmgmt')
  .get(function(req,res){
    dbManager.retrieveExternalLeads()
    .then(function(results){
      res.json(results);
    })
    .catch(function(error){
      res.sendStatus(error);
    });
  })
  .post(function(req,res){
    dbManager.updateScrapeData(req.body)
    .then(function(success){
      res.sendStatus(success);
    })
    .catch(function(fail){
      res.sendStatus(fail);
    });
  });

module.exports = dbMgmtRouter;