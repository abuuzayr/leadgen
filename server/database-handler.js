var MongoClient = require('mongodb').MongoClient;
var mongodb = require('mongodb');
var Promise = require('bluebird');
var config = require('./config');
var moment = require('moment');
var connection = require('./utils/connection')();

/**
*Deletes a document in the collection based on the filter object
*@param {string} collectionName - name of the collection
*@param {object} obj - filter object
*@returns {Promise} success or error
*/
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

/**
*Module to handle database connection and operations
*@exports dbHandler
*/
var dbHandler = {

  /**
  *Delete multiple documents in the collection based on the filter object
  *@param {string} collectionName - name of the collection
  *@param {object} obj - filter object
  *@returns {Promise} success or error
  */
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

  /**
  *Inserts a document in the collection
  *@param {string} collectionName - name of the collection
  *@param {object} obj - object to be inserted
  *@returns {Promise} success or error
  */
  dbInsert: function(collectionName, obj) {
    return new Promise(function(resolve, reject) {
      connection.Do(function(db){
          var col = db.collection(collectionName);

          col.insertOne(obj)
          .then(function(success){
            resolve(201);
          })
          .catch(function(error){
            reject(500);
          });
      });
    });
  },

  /**
  *Inserts multiple documents in the collection
  *@param {string} collectionName - name of the collection
  *@param {object} obj - object to be inserted
  *@returns {Promise} success or error
  */
  dbInsertMany: function(collectionName, obj) {
    return new Promise(function(resolve, reject) {
      connection.Do(function(db){
        var col = db.collection(collectionName);
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

  /**
  *Queries the collection based on the filter object
  *@param {string} collectionName - name of the collection
  *@param {object} obj - filter object
  *@returns {Promise} query results or error
  */
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

  /**
  *Deletes a document in the collection based on the filter object
  *@param {string} collectionName - name of the collection
  *@param {object} obj - filter object
  *@returns {Promise} success or error
  */
  dbDelete: deleteDB,

  /**
  *Updates a document in the collection based on the filter object to the update object
  *@param {string} collectionName - name of the collection
  *@param {object} originalObj - filter object
  *@param {object} updateObj - attributes to be updated
  *@returns {Promise} success or error
  */
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
        if(updateObj._id !== undefined)
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

  /**
  *Updates multiple documents in the collection based on the filter object to the update object
  *@param {string} collectionName - name of the collection
  *@param {object} originalObj - filter object
  *@param {object} updateObj - attributes to be updated
  *@returns {Promise} success or error
  */
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
        if(updateObj._id !== undefined)
          delete updateObj._id;
        var obj = {
          $set: updateObj
        };
        col.updateMany(originalObj, obj,function(err, results) {
          if (err !== null){
            console.log(err);
            reject(400);
          }
          else {
            resolve(200);
          }
        });
      });

    });
  },

  /**
  *Removes duplicate documents in the collection based on the desired field 
  *@param {string} collectionName - name of the collection
  *@param {string} field
  *@returns {Promise} success or error
  */
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

  /**
  *Deletes the whole collection
  *@param {string} collectionName - name of the collection
  *@param {string} field
  *@returns {Promise} success or error
  */
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
        var col = db.collection(collectionName);
        if (obj._id != undefined)
          obj._id = new mongodb.ObjectID(obj._id);
        col.find(obj).toArray(function(err, docs) {
          if (err !== null)
            reject(err);
          else {
            resolve(docs);
          }
        });
      });
    });
  },

  /**
  *Inserts a document in the collection
  *@param {string} collectionName - name of the collection
  *@param {object} obj - object to be inserted
  *@returns {Promise} ID of inserted document
  */
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

  /**
  *Gets list of collections in a database
  *@returns {Promise} Array of collection names or error
  */
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

  /**
  *Queries the collection in super admin database based on the filter object
  *@param {string} collectionName - name of the collection
  *@param {object} obj - filter object
  *@returns {Promise} query results or error
  */
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

  /**
  *Deletes a document in the collection in super admin database based on the filter object
  *@param {string} collectionName - name of the collection
  *@param {object} obj - filter object
  *@returns {Promise} success or error
  */
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

  /**
  *Updates a document in the collection in super admin database based on the filter object to the update object
  *@param {string} collectionName - name of the collection
  *@param {object} originalObj - filter object
  *@param {object} updateObj - attributes to be updated
  *@returns {Promise} success or error
  */
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

  /**
  *Inserts a document in the collection for super admin database
  *@param {string} collectionName - name of the collection
  *@param {object} obj - object to be inserted
  *@returns {Promise} success or error
  */
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

  /**
  *Drops the collection in super admin database
  *@param {string} collectionName - name of the collection
  *@returns {Promise} success or error  
  */
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
