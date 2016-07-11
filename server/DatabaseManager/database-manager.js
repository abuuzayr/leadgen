var Promise = require('bluebird');
var dbHandler = require('../database-handler');


var databaseManager = {
  updateExternalLeads : function(){
    //Get list of databases
    dbHandler.getListOfDB()
    .then(function(results){
      var promiseArr=[];
      for(var i=0;i<results.length;i++){
        promiseArr.push(dbQuery(results[i].name));
      }
    })
    .catch();
  },
  displayLeads : function(db){
    return new Promise(function(resolve,reject){
      if(db === 'all'){
        combineResults()
        .then(function(results){
          resolve(results);
        })
        .catch(function(error){
          reject(error);
        });
      }else{
        dbHandler.dbQuerySA(db,null)
        .then(function(results){
          resolve(results);
        })
        .catch(function(error){
          reject(error);
        });
      }
    });
  },

  deleteLeads : function(obj,collectionName){
    return new Promise(function(resolve, reject) {
      console.log(obj);
      if (!Array.isArray(obj)) {
        dbHandler.dbDeleteSA(collectionName, obj)
          .then(function(results) {
            resolve(results);
          })
          .catch(function(error) {
            reject(error);
          });
      } else {
        var arr = [];
        for (var index in obj) {
          var item = obj[index];
          arr.push(dbHandler.dbDeleteSA(collectionName, item));
        }
        Promise.all(arr)
          .then(function(results) {
            resolve(200);
          })
          .catch(function(error) {
            reject(error);
          });
      }
    });
  },

  updateLeads : function(obj,collectionName){
    return new Promise(function(resolve, reject) {
      
    var originalObj = {};
    originalObj._id = obj[0]._id;

    dbHandler.dbUpdateSA(collectionName, originalObj, obj[1])
      .then(function(results) {
        resolve(200);
      })
      .catch(function(error) {
        reject(500);
      });


    });
  },
  importLeads : function(obj,collectionName){
    return new Promise(function(resolve,reject){
      var promiseArr= [];
      for(var i=0;i<obj.length;i++){
        promiseArr.push(dbHandler.dbInsertSA(collectionName,obj));
      }
      Promise.all(promiseArr)
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

    dbHandler.dbQuerySA('internal',null)
    .then(function(results){
      resultsArr = results;
      return dbHandler.dbQuerySA('external',null);
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