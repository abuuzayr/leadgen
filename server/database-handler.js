var MongoClient = require('mongodb').MongoClient;
var mongodb = require('mongodb');
var Promise = require('bluebird');
var config = require('./config');
var moment = require('moment');
var connection = require('./utils/connection')();

var deleteDB = function(collectionName, obj) {
  return new Promise(function(resolve, reject) {
    connection.Do(function(db){
      if (obj._id !== undefined)
        obj._id = new mongodb.ObjectID(obj._id);

      var col = db.collection(collectionName);
      col.deleteOne(obj, function(err, results) {
        if (err !== null)
          reject(500);
        else {
          
          resolve(200);
        }
      });
    });
  });
};


var dbHandler = {
  deleteManyDB: function(collectionName, obj) {
    return new Promise(function(resolve, reject) {
      connection.Do(function(db){
        if (obj._id !== undefined) {
          obj._id = new mongodb.ObjectID(obj._id);
        }
        var col = db.collection(collectionName);
        col.deleteMany(obj, function(err, results) {
          if (err !== null)
            reject(500);
          else {
            resolve(200);
          }
        });
      });
    });
  },
  dbInsert: function(collectionName, obj) {
    return new Promise(function(resolve, reject) {
      connection.Do(function(db){
        if (obj._id !== undefined)
          delete obj._id;
        var col = db.collection(collectionName);
        var filter = {
          email : obj.email
        };
        col.find(filter).toArray()
        .then(function(results){
          if(results.length > 0){
	    console.log('duplicate found');
	  }else{
            col.insertOne(obj)
            .then(function(success){
              resolve(200);
            })
            .catch(function(error){
              reject(500);
            });
          }
        })
        .catch(function(error){
          reject(500);
        });
      });
    });
  },
  dbInsertMany: function(collectionName, obj) {
    return new Promise(function(resolve, reject) {
      connection.Do(function(db){
        var col = db.collection(collectionName);
        for(var i in obj){
           delete obj[i]._id;
        }
        var partitionLength = 500;
        var promiseArr = [];
        for(var i=0; i<obj.length; i+=partitionLength){
          var arr = obj.slice(i,i+partitionLength);
          promiseArr.push(col.insertMany(arr)); 
        }
        Promise.all(promiseArr)
        .then(function(result){
          
          resolve(201);
        })
       .catch(function(err){
          reject(500); 
        });
      }); 
    });
  },
  dbAggreateML: function(collectionName) {
    return new Promise(function(resolve, reject) {
      connection.Do(function(db){
        var col = db.collection(collectionName);
        col.aggregate([{
          $group: {
            "_id": "$listID",
            "count": {
              $sum: 1
            }
          }
        }]).toArray(function(err, docs) {
          if (err !== null)
            reject(500);
          else {
            
            resolve(docs);
          }
        });
      });
    });
  },
  dbQuery: function(collectionName, obj) {
    return new Promise(function(resolve, reject) {
      connection.Do(function(db){
          var col = db.collection(collectionName);
          if (obj !== null) {
            if (obj._id !== undefined)
              obj._id = new mongodb.ObjectID(obj._id);
          }
          col.find(obj).toArray(function(err, docs) {
            if (err !== null){
              reject(500);
            }
            else {
              
              resolve(docs);
            }
          });
        });
      });
  },
  dbDelete: deleteDB,
  dbUpdate: function(collectionName, originalObj, updateObj) {
    return new Promise(function(resolve, reject) {
      connection.Do(function(db){
        var col = db.collection(collectionName);

        /*
          Wrap string to mongodb object id
        */
        if (originalObj._id !== undefined) {
          originalObj._id = new mongodb.ObjectID(originalObj._id);

        }
        delete updateObj._id;
        var obj = {
          $set: updateObj
        };
        col.updateOne(originalObj, obj, function(err, results) {
          if (err !== null)
            reject(400);
          else {
            
            resolve(200);
          }
        });
      });
    });
  },
  dbUpdateMany: function(collectionName, originalObj, updateObj) {
    return new Promise(function(resolve, reject) {
      connection.Do(function(db){
        var col = db.collection(collectionName);

        /*
          Wrap string to mongodb object id
        */
        if (originalObj._id !== undefined) {
          originalObj._id = new mongodb.ObjectID(originalObj._id);
        }
        delete updateObj._id;

        var obj = {
          $set: updateObj
        };
        col.updateMany(originalObj, obj,function(err, results) {
          if (err !== null){
            reject(400);
          }
          else {
            
            resolve(200);
          }
        });
      });

    });
  },
  dbRemoveDuplicate: function(collectionName, field) {
    return new Promise(function(resolve, reject) {
      connection.Do(function(db){

        var col = db.collection(collectionName);
        var fieldString = "$" + field;
        var obj = {
          $group: {
            "_id": fieldString,
            "count": {
              $sum: 1
            }
          }
        };
        var arr = [obj];
        col.aggregate(arr).toArray(function(err, results) {
          if (err !== null)
            reject(500);
          else {
            var arr1 = [];
            for (var i = 0; i < results.length; i++) {
              if (results[i].count > 1) {
                if (results[i]._id !== null && results[i]._id !== undefined && results[i]._id !== '') {
                  var object = {};
                  object[field] = results[i]._id;
                  for (var j = 0; j < results[i].count - 1; j++) {
                    arr1.push(deleteDB(collectionName, object));
                  }
                }
              }
            }
            Promise.all(arr1)
              .then(function(msg) {
                resolve(arr1.length);
                
              })
              .catch(function(err) {
                reject(500);
                
              });
          }
        });
      });
    });
  },
  dbDropCollection: function(collectionName) {
    return new Promise(function(resolve, reject) {
      connection.Do(function(db){     
          db.dropCollection(collectionName, function(err, result) {
            if (err !== null){
              reject(500);
            }
            else {  
              resolve(200);
            }
          });
      });
    });
  },
  getSubscriberContact: function(collectionName, obj) {
    return new Promise(function(resolve, reject) {
      connection.Do(function(db){
	console.log(collectionName);     
        var col = db.collection(collectionName);
        if (obj._id != undefined)
          obj._id = new mongodb.ObjectID(obj._id);
        col.find(obj).toArray(function(err, docs) {
          if (err !== null)
            reject(err);
          else {
	    console.log(docs);
            resolve(docs);
          }
        });
      });
    });
  },
  dbInsertReturnID: function(collectionName, obj) {
    return new Promise(function(resolve, reject) {
      connection.Do(function(db){
        if (obj._id !== undefined)
          delete obj._id;
        var col = db.collection(collectionName);
        col.insertOne(obj, function(err, r) {
          if (err !== null)
            reject(500);
          else {
            
            resolve(r.insertedId);
          }
        });
      });
    });
  },
  getListOfCollections : function(){
    return new Promise(function(resolve,reject){
      connection.Do(function(db){  
        db.listCollections(null).toArray(function(err,items){
          if(err !== null)
            reject(500);
          else{
            resolve(items);
          }
        });
      });
    });
  },

  dbQuerySA : function(collectionName,obj){
    return new Promise(function(resolve,reject){
      
      connection.superAdmin(function(db){

        var col = db.collection(collectionName);
        
        if (obj !== null) {
        
          if (obj._id !== undefined)
            obj._id = new mongodb.ObjectID(obj._id);
        
        }

        col.find(obj).toArray(function(err, docs) {
          if (err !== null){
            reject(500);
          }
          else {
            
            resolve(docs);
          }
        });
      });    
    });
  },

  dbDeleteSA : function(collectionName,obj){
    return new Promise(function(resolve, reject) {

        connection.superAdmin(function(db){
          if (obj._id !== undefined)
            obj._id = new mongodb.ObjectID(obj._id);

          var col = db.collection(collectionName);
          col.deleteOne(obj, function(err, results) {
            if (err !== null)
              reject(500);
            else {
              
              resolve(200);
            }
          });

        });
    });
  },

  dbUpdateSA : function(collectionName, originalObj, updateObj){
     return new Promise(function(resolve, reject) {
        connection.superAdmin(function(db){
        var col = db.collection(collectionName);

        /*
          Wrap string to mongodb object id
        */
        if (originalObj._id !== undefined) {
          originalObj._id = new mongodb.ObjectID(originalObj._id);

        }
        delete updateObj._id;
        var obj = {
          $set: updateObj
        };
        col.updateOne(originalObj, obj, function(err, results) {
          if (err !== null)
            reject(500);
          else {
            
            resolve(200);
          }
        });
      });
    });    
  },

  dbInsertSA: function(collectionName, obj) {
    return new Promise(function(resolve, reject) {
      connection.superAdmin(function(db){

        var col = db.collection(collectionName);

        for(var i in obj){
           delete obj[i]._id;
        }
        var partitionLength = 500;
        var promiseArr = [];
        for(var i=0; i<obj.length; i+=partitionLength){
          var arr = obj.slice(i,i+partitionLength);
          promiseArr.push(col.insertMany(arr)); 
        }
        
        Promise.all(promiseArr)
        .then(function(results){
          resolve(201);
        })
        .catch(function(err){
          console.log(err);
          reject(500);
        });
      });
    });
  },
  dbDropCollectionSA: function(collectionName) {
    return new Promise(function(resolve, reject) {
      connection.superAdmin(function(db){ 
          db.dropCollection(collectionName, function(err, result) {
            if (err !== null){
              reject(500);
            }
            else {  
              resolve(200);
            }
          });
        
      });
    });
  }


};

module.exports = dbHandler;
