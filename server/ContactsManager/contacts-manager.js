var dbHandler = require('../database-handler');
var config = require('../config');
var common = require('../common');
var fs = require('fs');
var mongodb = require('mongodb');
var Promise = require('bluebird');

var ContactsManager = {
  displayLeads : function(obj){
    return new Promise(function(resolve,reject){
      dbHandler.dbQuery('leadList',obj)
      .then(function(results){
        resolve(results)
      })
      .catch(function(error){
        reject(500);
      }); 
    });
  },
  addContacts : function(obj){
    return new Promise(function(resolve,reject){
      if(obj.type != 1 && obj.type!=2)
        reject(400);
      else{
        var matchFlag = false;
        dbHandler.dbQuery('blackListDomains',null)
        .then(function(domains){
          for(var i=0;i<domains.length;i++){
            if(obj.email != null || obj.email != undefined){
              if(obj.email.indexOf(domains[i].domainName) != -1){
                matchFlag = true;
                break;
              }
            }
          }

          if(obj.origin != 1)
            obj.origin = 1;

          if(matchFlag){
            dbHandler.dbInsert('blackList',obj)
            .then(function(results){
              resolve(results);
            })
            .catch(function(error){
              reject(error);
            });       
          }else{
            dbHandler.dbInsert('leadList',obj)
            .then(function(results){
              resolve(results);
            })
            .catch(function(error){
              reject(error);
            });         
          }
        })
        .catch(function(error){
          reject(error);
        });
        
      }
    })
  },
  addBulkContacts : function(res,arr,callback){
    var promiseArr = [];
      dbHandler.dbQuery('blackListDomains',null)
      .then(function(domains){
        for(var i=0; i<arr.length; i++){
          var matchFlag = false;

          if (arr[i].origin == undefined)
            arr[i].origin = 1;

          if(arr[i].type == undefined)
            arr[i].type = 2;

          for(var j=0;j<domains.length;j++){
            if(arr[i].email != null || arr[i].email != undefined){
              if( arr[i].email.indexOf(domains[j].domainName) != -1 ){
                matchFlag = true;
                break;
              }
            }
          }

          if(matchFlag)
            promiseArr.push(dbHandler.dbInsert('blackList',arr[i]));
          else
            promiseArr.push(dbHandler.dbInsert('leadList',arr[i]));   
          
        }
        Promise.all(promiseArr)
        .then(function(results){
          callback(res,201);
        })
        .catch(function(error){
          callback(res,error);
        });
      })
      .catch(function(error){
        callback(res,error);
      })
  },
  deleteLeads : function(obj){
    return new Promise(function(resolve,reject){
      if(!Array.isArray(obj)){
        if(obj.type != 1 && obj.type != 2)
          reject(400);
        else{

          dbHandler.dbDelete('leadList',obj)
          .then(function(results){
            resolve(results);
          })
          .catch(function(error){
            reject(error);
          });           

        } 
      }else{
        var arr = [];
        for(var index in obj){
          var item = obj[index];
          if(item.type != 1 && item.type != 2)
            reject(400);
          else{
            arr.push(dbHandler.dbDelete('leadList',item));    
          }
        }
        Promise.all(arr)
        .then(function(results){
          resolve(200);
        })
        .catch(function(error){
          reject(error);
        })
      }
    }); 
  },
  updateContacts : function(obj){
    return new Promise(function(resolve,reject){
      if((Array.isArray(obj)) && obj.length == 2){
        var type = obj[0].type;

        obj[1].origin = 1;

        if(type != 1 && type != 2)
          reject(400);
        else{
        
          dbHandler.dbUpdate('leadList',obj[0],obj[1])
          .then(function(results){
            resolve(results);
          })
          .catch(function(error){
            reject(error);
          });         

        }
      }else{
        reject(400);
      }
    })
  },
  removeField : function(collectionName,str){
    return new Promise(function(resolve,reject){
      var arr = [];
      dbHandler.dbQuery(collectionName,null)
      .then(function(results){
        if (results.length == 0)
          resolve(200);
        for(var i=0;i<results.length;i++){
          var obj= results[i];
          delete obj[str];
          arr.push(obj);
        }
        return dbHandler.dbDropCollection(collectionName);
      })
      .then(function(results){
        var promiseArr = [];
        for(var i=0;i<arr.length;i++){
          promiseArr.push(dbHandler.dbInsert(collectionName,arr[i]));
        }
        return Promise.all(promiseArr);
      })
      .then(function(results){
        resolve(200);
      })
      .catch(function(error){
        reject(500);
      });
    })  
  },
  addField : function(collectionName,str){
    return new Promise(function(resolve,reject){
      var arr = [];
      dbHandler.dbQuery(collectionName,null)
      .then(function(results){
        if(results.length == 0){
          resolve(200);
        }
        for(var i=0;i<results.length;i++){
          var obj= results[i];
          if(obj[str] == undefined)
            obj[str] = null;
          arr.push(obj);
        }
        return dbHandler.dbDropCollection(collectionName);
      })
      .then(function(results){
        var promiseArr = [];
        for(var i=0;i<arr.length;i++){
          promiseArr.push(dbHandler.dbInsert(collectionName,arr[i]));
        }
        return Promise.all(promiseArr);
      })
      .then(function(results){
        resolve(200);
      })
      .catch(function(error){
        reject(500);
      });
    })
  },
  addDomainChain : function(collectionName,str){
    return new Promise(function(resolve,reject){ 
      var leadsArr = [];
      dbHandler.dbQuery(collectionName,null)
      .then(function(results){
        for(var i=0;i<results.length;i++){
          var emailAddr = results[i].email;
          if(emailAddr != null || emailAddr != undefined){
            if(emailAddr.indexOf(str) != -1){
              leadsArr.push(results[i]);
            }
          } 
        }
        var promiseArr = [];
        for(var i=0;i<leadsArr.length;i++){
          promiseArr.push(dbHandler.dbDelete(collectionName,leadsArr[i]));
        }
        return Promise.all(promiseArr);
      })
      .then(function(results){
        var promiseArr = [];
        for(var i=0;i<leadsArr.length;i++){
          delete leadsArr[i]._id;
          promiseArr.push(dbHandler.dbInsert('blackList',leadsArr[i]));
        }
        return Promise.all(promiseArr);
      })
      .then(function(results){
        resolve(200);
      })
      .catch(function(error){
        reject(500);
      })
    });
  },
  displayList : function(collectionName,obj){
    return new Promise(function(resolve,reject){
      dbHandler.dbQuery(collectionName,obj)
      .then(function(results){
        resolve(results);
      })
      .catch(function(error){
        reject(error);
      })
    })
  },
  deleteFromBlackList : function(obj){
    return new Promise(function(resolve,reject){
      if(Array.isArray(obj)){
        var arr = [];
        for(var i=0;i<obj.length;i++){
          arr.push(dbHandler.dbDelete('blackList',obj[i]));
        }
        Promise.all(arr)
        .then(function(results){
          resolve(200);
        })
        .catch(function(error){
          reject(500)
        })
      }else{
        dbHandler.dbDelete('blackList',obj)
        .then(function(results){
          resolve(200);
        })
        .catch(function(error){
          reject(500);
        })
      }
    })
  },
  insertColumnDef : function(obj){
    return new Promise(function(resolve,reject){
      dbHandler.dbInsert('columnDef',obj)
      .then(function(results){
        resolve(results);
      })
      .catch(function(error){
        resolve(error);
      })
    })
  },
  deleteColumnDef : function(obj){
    return new Promise(function(resolve,reject){
      dbHandler.dbDelete('columnDef',obj)
      .then(function(results){
        resolve(results);
      })
      .catch(function(error){
        resolve(error);
      })
    })
  },
  addDomain :function(obj){
    return new Promise(function(resolve,reject){
      dbHandler.dbInsert('blackListDomains' , obj)
      .then(function(results){
        resolve(results);
      })
      .catch(function(error){
        reject(error);
      })
    })
  },
  deleteDomain : function(obj){
    return new Promise(function(resolve,reject){
      if(Array.isArray(obj)){
        var promiseArr = [];
        for(var i=0; i<obj.length;i++){
          promiseArr.push(dbHandler.dbDelete('blackListDomains', obj[i]));
        }

        Promise.all(promiseArr)
        .then(function(results){
          resolve(200);
        })
        .catch(function(error){
          reject(500);
        });
      }else{
        dbHandler.dbDelete('blackListDomains',obj)
        .then(function(results){
          resolve(results);
        })
        .catch(function(error){
          reject(error);
        });
      }
    })
  },
  addContactMC : function(obj){
	return new Promise (function(resolve,reject) {	
			
		})
	}
};

module.exports = ContactsManager;