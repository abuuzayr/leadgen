var MongoClient = require('mongodb').MongoClient;
var mongodb = require('mongodb');
var Promise = require('bluebird');
var config = require('./config');
var moment = require('moment');


var deleteDB = function(collectionName, obj) {
  return new Promise(function(resolve, reject) {
    MongoClient.connect(config.dbURI, function(err, db) {
      if (err != null)
        reject(500);
      else {

        if (obj._id != undefined)
          obj._id = new mongodb.ObjectID(obj._id);

        var col = db.collection(collectionName);
        col.deleteOne(obj, function(err, results) {
          if (err != null)
            reject(500);
          else {
            db.close();
            resolve(200);
          }
        });
      }
    });
  });
};


var dbHandler = {
  dbConnect: function(callback) {
    MongoClient.connect(config.dbURI, function(err, db) {
      if (err === null) {
        db.close();
        callback(config.successMsg);
      } else {
        callback(config.errorMsg);
      }
    });
  },
  deleteManyDB: function(collectionName, obj) {
    return new Promise(function(resolve, reject) {
      MongoClient.connect(config.dbURI, function(err, db) {
        if (err != null)
          reject(500);
        else {
          if (obj._id != undefined) {
            obj._id = new mongodb.ObjectID(obj._id);
          }
          var col = db.collection(collectionName);
          col.deleteMany(obj, function(err, results) {
            if (err != null)
              reject(500);
            else {
              db.close();
              resolve(200);
            }
          });
        }
      });
    });
  },
  dbInsert: function(collectionName, obj) {
    return new Promise(function(resolve, reject) {
      MongoClient.connect(config.dbURI, function(err, db) {
        if (err != null)
          reject(500);
        else {
          if (obj._id != undefined)
            delete obj._id;
          var col = db.collection(collectionName);
          col.insertOne(obj, function(err, r) {
            if (err != null) {
              reject(500);
            } else {
              db.close();
              resolve(201);
            }
          });
        }
      });
    });
  },
  dbInsertMany: function(collectionName, obj) {
    return new Promise(function(resolve, reject) {
      MongoClient.connect(config.dbURI, function(err, db) {
        if (err != null){
          console.log(err);
	  reject(500);
	}
        else {
          for(var i in obj.length)
            delete obj[i]._id;
          var col = db.collection(collectionName).initializeOrderedBulkOp();
          col.insertMany(obj, function(err, r) {
            if (err != null) {
              reject(500);
	      console.log(err);
            } else {
              db.close();
              resolve(201);
            }
          });
        }
      });
    });
  },
  dbAggreateML: function(collectionName) {
    return new Promise(function(resolve, reject) {
      MongoClient.connect(config.dbURI, function(err, db) {
        if (err != null)
          reject(500);
        else {
          var col = db.collection(collectionName);
          col.aggregate([{
            $group: {
              "_id": "$listID",
              "count": {
                $sum: 1
              }
            }
          }]).toArray(function(err, docs) {
            if (err != null)
              reject(500);
            else {
              db.close();
              resolve(docs);
            }
          });
        }
      });
    });
  },
  dbQuery: function(collectionName, obj, dbName) {
    return new Promise(function(resolve, reject) {
      var dbURL  = config.getDbUri(dbName);
      MongoClient.connect(dbURL, function(err, db) {
        if (err != null){
          console.log(err);
          reject(500);
        }
        else {
          var col = db.collection(collectionName);
          if (obj != null) {
            if (obj._id != undefined)
              obj._id = new mongodb.ObjectID(obj._id);
          }
          col.find(obj).toArray(function(err, docs) {
            if (err != null){
              console.log(err);
              reject(500);
            }
            else {
              db.close();
              resolve(docs);
            }
          });
        }
      });
    });
  },
  dbDelete: deleteDB,
  dbUpdate: function(collectionName, originalObj, updateObj) {
    return new Promise(function(resolve, reject) {
      MongoClient.connect(config.dbURI, function(err, db) {
        if (err != null)
          reject(400);
        else {
          var col = db.collection(collectionName);

          /*
            Wrap string to mongodb object id
          */
          if (originalObj._id != undefined) {
            originalObj._id = new mongodb.ObjectID(originalObj._id);

          }
          delete updateObj._id;
          var obj = {
            $set: updateObj
          };
          col.updateOne(originalObj, obj, function(err, results) {
            if (err != null)
              reject(400);
            else {
              db.close();
              resolve(200);
            }
          });
        }
      });
    });
  },
  dbUpdateMany: function(collectionName, originalObj, updateObj) {
    return new Promise(function(resolve, reject) {
      MongoClient.connect(config.dbURI, function(err, db) {
        if (err != null){
	  console.log(err);
          reject(400);
	}
        else {
          var col = db.collection(collectionName);

          /*
            Wrap string to mongodb object id
          */
          if (originalObj._id != undefined) {
            originalObj._id = new mongodb.ObjectID(originalObj._id);
          }
          delete updateObj._id;

          var obj = {
            $set: updateObj
          };
          col.updateMany(originalObj, obj, function(err, results) {
            if (err != null){
              console.log(err);	
	      reject(400);
	    }
            else {
              db.close();
              resolve(200);
            }
          });
        }
      });
    });
  },
  dbRemoveDuplicate: function(collectionName, field) {
    return new Promise(function(resolve, reject) {
      MongoClient.connect(config.dbURI, function(err, db) {
        if (err != null)
          reject(err);
        else {
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
            if (err != null)
              reject(err);
            else {
              var arr1 = [];
              for (var i = 0; i < results.length; i++) {
                if (results[i].count > 1) {
                  if (results[i]._id != null && results[i]._id != undefined && results[i]._id != '') {
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
                  db.close();
                })
                .catch(function(err) {
                  reject(err);
                  db.close();
                });
            }
          });
        }
      });
    });
  },
  dbDropCollection: function(collectionName,dbName) {
    return new Promise(function(resolve, reject) {
      var dbURL = config.getDbUri(dbName);
      MongoClient.connect(dbURL, function(err, db) {
        if (err != null){
          reject(500);
        }
        else {
          db.dropCollection(collectionName, function(err, result) {
            if (err != null){
              reject(500);
            }
            else {
              db.close();
              resolve(200);
            }
          });
        }
      });
    });
  },
  getSubscriberContact: function(collectionName, obj) {
    return new Promise(function(resolve, reject) {
      MongoClient.connect(config.dbURI, function(err, db) {
        if (err != null)
          reject(err);
        else {
          var col = db.collection(collectionName);
          if (obj != null) {
            if (obj._id != undefined)
              obj._id = new mongodb.ObjectID(obj._id);
          }
          col.find(obj).toArray(function(err, docs) {
            if (err != null)
              reject(err);
            else {
              db.close();
              resolve(docs);
            }
          });
        }
      });
    });
  },
  dbInsertReturnID: function(collectionName, obj) {
    return new Promise(function(resolve, reject) {
      MongoClient.connect(config.dbURI, function(err, db) {
        if (err != null)
          reject(500);
        else {
          if (obj._id != undefined)
            delete obj._id;
          var col = db.collection(collectionName);
          col.insertOne(obj, function(err, r) {
            if (err != null)
              reject(500);
            else {
              db.close();
              resolve(r.insertedId);
            }
          });
        }
      });
    });
  },
  getListOfDB : function(){
    return new Promise(function(resolve,reject){
      
      var dbURL = config.getDbUri(null);
      MongoClient.connect(dbURL,function(err,db){
        if(err != null)
          reject(500);
        else{
          var adminDB = db.admin();
          adminDB.listDatabases(function(err,dbs){
            if(err != null)
              reject(500);
            else
              resolve(dbs.databases);
          });
        }
      });

    });
  },

  dbQuerySA : function(collectionName,obj){
    return new Promise(function(resolve,reject){
      
      var dbURL = config.getDbUri(null);
      
      MongoClient.connect(dbURL,function(err,db){
        
        if (err != null)
          reject(err);

        else {
          var col = db.collection(collectionName);
          
          if (obj != null) {
          
            if (obj._id != undefined)
              obj._id = new mongodb.ObjectID(obj._id);
          
          }

          col.find(obj).toArray(function(err, docs) {
            if (err != null)
              reject(err);
            else {
              db.close();
              resolve(docs);
            }
          });
        }
      });
    });
  },

  dbDeleteSA : function(collectionName,obj){
    return new Promise(function(resolve, reject) {
      var dbURL = config.getDbUri(null);
      MongoClient.connect(dbURL, function(err, db) {
        if (err != null)
          reject(500);
        else {
          if(obj._id != undefined)
            obj._id = new mongodb.ObjectID(obj._id);
          var col = db.collection(collectionName);
          col.deleteOne(obj, function(err, results) {
            if (err != null)
              reject(500);
            else {
              db.close();
              resolve(200);
            }
          });
        }
      });
    });
  },

  dbUpdateSA : function(collectionName, originalObj, updateObj){
     return new Promise(function(resolve, reject) {
      var dbURL = config.getDbUri(null);
      MongoClient.connect(dbURL, function(err, db) {
        if (err != null)
          reject(400);
        else {
          var col = db.collection(collectionName);

          /*
            Wrap string to mongodb object id
          */
          if (originalObj._id != undefined) {
            originalObj._id = new mongodb.ObjectID(originalObj._id);

          }
          delete updateObj._id;
          var obj = {
            $set: updateObj
          };
          col.updateOne(originalObj, obj, function(err, results) {
            if (err != null)
              reject(400);
            else {
              db.close();
              resolve(200);
            }
          });
        }
      });
    });    
  },

  dbInsertSA: function(collectionName, obj) {
    return new Promise(function(resolve, reject) {
      var dbURL = config.getDbUri(null);
      MongoClient.connect(dbURL, function(err, db) {
        console.log(err);
        if (err != null){
          reject(500);
        }
        else {
          // if (obj._id != undefined)
          //   delete obj._id;
          for(var i=0;i<obj.length;i++){
              delete obj[i]._id;
          }
          
          var col = db.collection(collectionName);
          col.insertMany(obj, function(err, r) {
            console.log(err);
            if (err !=   null) {
              reject(500);
            } else {
              db.close();
              resolve(201);
            }
          });
        }
      });
    });
  }


};

module.exports = dbHandler;
