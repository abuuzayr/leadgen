var Promise = require('bluebird');
var dbHandler = require('../database-handler');

/**
*Module to handle database management services
*@module DatabaseManager
*/
var DatabaseManager = {

  /**
  *Retrieves all the leads belonging to all the companies.
  *@returns {Promise} returns the leads or error
  */
  retrieveExternalLeads : function(){
    return new Promise(function(resolve,reject){

      var externalLeads = [];
      
      dbHandler.getListOfCollections()        //Gets list of collections in server
      .then(function(results){
        var promiseArr=[];
        for(var i in results){
	        if(results[i].name.indexOf('leads') != -1){
              promiseArr.push(dbHandler.dbQuery(results[i].name,{origin : 1}));
            }
        }
        return Promise.all(promiseArr);
      })
      .then(function(results){
        console.log(results);
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
        reject(500);
      });

    });
  }
};

module.exports =  DatabaseManager;
