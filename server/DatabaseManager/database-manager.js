var Promise = require('bluebird');
var dbHandler = require('../database-handler');


var databaseManager = {
  retrieveExternalLeads : function(){
    return new Promise(function(resolve,reject){

      var externalLeads = [];
      
      dbHandler.getListOfDB()        //Gets list of databases in server
      .then(function(results){
        var promiseArr=[];
        for(var i=0;i<results.length;i++){
          if(results[i].name != 'scrapeDB')
            promiseArr.push(dbHandler.dbQuery('leadList',{origin : 1},results[i].name));
        }
        return Promise.all(promiseArr);
      })
      .then(function(results){
        var externalLeads = [];
        for(var i=0;i<results.length;i++){
          var leads = results[i];
          for(var j=0;j<leads.length;j++){
            externalLeads.push(leads[j]);
          }
        }

        resolve(externalLeads);
      })
      .catch(function(error){
        reject(error);
      });

    });
  },
  updateScrapeData : function(obj){
    return new Promise(function(resolve,reject){
      var promiseArr= [];
      dbHandler.dbQuerySA('data',null)
      .then(function(data){
        if(data.length > 0){
          return dbHandler.dbDropCollection('data',null);
        }
        else
          return 1;  
      })
      .then(function(results){
        for(var i=0;i<obj.length;i++){
          promiseArr.push(dbHandler.dbInsertSA('data',obj[i]));
        }
        return Promise.all(promiseArr);
      })
      .then(function(results){
        resolve(201);
      })
      .catch(function(error){
        reject(500);
      });
    });
  }
 
};

module.exports =  databaseManager;

var combineResults = function(){
  return new Promise(function(resolve,reject){

    resultsArr = [];

    dbHandler.dbQuery('internal',null,null)
    .then(function(results){
      resultsArr = results;
      return dbHandler.dbQuery('external',null,null);
    })
    .then(function(results){
      resultsArr.concate(results);
      resolve(resultsArr);
    })
    .catch(function(error){
      reject(error);
    });
  }); 
};