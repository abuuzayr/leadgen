var MongoClient = require('mongodb').MongoClient;
var mongodb = require('mongodb');
var Promise = require('bluebird');
var config = require('./config');
var moment = require('moment');


var deleteDB = function(collectionName,obj){
  return new Promise(function(resolve,reject){  
      MongoClient.connect(config.dbURI,function(err,db){
        if(err!=null)
          reject(500);
        else{
          if(obj._id != undefined)
            obj._id = new mongodb.ObjectID(obj._id);
          var col = db.collection(collectionName);
          col.deleteOne(obj,function(err,results){
            if(err!=null)
              reject(500);
            else{
              db.close();
              resolve(200);
            }
          })
        }
      });
    });
};


var dbHandler = {
  dbConnect : function(callback){
    // return new Promise(function(resolve,reject){
    //  MongoClient.connect(config.dbURI, function(err, db) {
    //    if(err!=null)
    //      reject(err);
    //    else
    //    db.close();
    //    resolve('Connection to database established');
    //  });
    // });
    MongoClient.connect(config.dbURI, function(err,db){
      if(err == null){
        db.close();
        callback(config.successMsg);
      }else{
        callback(config.errorMsg);
      }
    })
  },
  dbInsert : function(collectionName,obj){
    return new Promise(function(resolve,reject){  
      MongoClient.connect(config.dbURI,function(err,db){
        if(err!=null)
          reject(500);
        else{
          if(obj._id != undefined)
            delete obj._id;
          // obj.dateCreated = moment().zone("+00:00").format();
          var col = db.collection(collectionName);
          col.insert(obj,function(err,r){
            if(err!=null)
              reject(500);
            else{
              db.close();
              resolve(201);
            }
          });
        }
      });
    });
  },
  dbQuery : function(collectionName,obj){
    return new Promise(function(resolve,reject){  
      MongoClient.connect(config.dbURI,function(err,db){
        if(err!=null)
          reject(500);
        else{
          var col = db.collection(collectionName);

          if(obj != null && obj._id != undefined)
            obj._id = new mongodb.ObjectID(obj._id);
          col.find(obj).toArray(function(err,docs){
            if(err!=null)
              reject(500);
            else{
              db.close();
              resolve(docs);
            }
          })
        }
      });
    });
  },
  dbDelete : deleteDB,
  dbUpdate : function(collectionName,originalObj,updateObj){
    return new Promise(function(resolve,reject){  
      MongoClient.connect(config.dbURI,function(err,db){
        if(err!=null)
          reject(500);
        else{
          var col = db.collection(collectionName);

          /*
            Wrap string to mongodb object id
          */
          if(originalObj._id != undefined){
            originalObj._id = new mongodb.ObjectID(originalObj._id); 
          }
          
          delete updateObj._id; 
          updateObj.dateModified = moment.toString();
          var obj = {
            $set : updateObj
          };
          col.updateOne(originalObj,obj,function(err,results){
            if(err!=null)
              reject(500);
            else{
              db.close();
              resolve(200);
            }
          })
        }
      });
    });
  },
  dbRemoveDuplicate : function(collectionName,field){
    return new Promise(function(resolve,reject){
      MongoClient.connect(config.dbURI,function(err,db){
        if(err!=null)
          reject(err);
        else{
          var col = db.collection(collectionName);
          var fieldString = "$" + field;
          var obj = {
            $group : {
              "_id" : fieldString,
              "count" : {$sum : 1}
            }
          };
          var arr = [obj];
          console.log(arr);
          col.aggregate(arr).toArray(function(err,results){
            console.log(results); 
            if(err!=null)
              reject(err);
            else{
              var arr1 = [];
              for(var i=0;i<results.length;i++){
                if(results[i].count > 1){
                  if(results[i]._id != null && results[i]._id != undefined && results[i]._id != '' ){
                    var object = {}; 
                    object[field] = results[i]._id
                    console.log(object);
                    for(var j=0; j<results[i].count -1 ; j++){
                      arr1.push(deleteDB(collectionName,object));
                    }
                  }
                }
              }
              Promise.all(arr1)
              .then(function(msg){
                resolve(arr1.length);
                db.close();
              })
              .catch(function(err){
                reject(err);
                db.close();
              });
            }
          })
        }
      });
    });
  },
  dbDropCollection : function(collectionName){
    return new Promise(function(resolve,reject){
      MongoClient.connect(config.dbURI,function(err,db){
        if(err!=null)
          reject(500);
        else{
          db.dropCollection(collectionName,function(err,result){
            if(err!=null)
              reject(500);
            else{
              db.close();
              resolve(200);
            }
            
          });
        }
      })
    })
  },
  dbInsertReturnID : function(collectionName,obj){
    return new Promise(function(resolve,reject){  
      MongoClient.connect(config.dbURI,function(err,db){
        if(err!=null)
          reject(500);
        else{
          if(obj._id != undefined)
            delete obj._id;
          var col = db.collection(collectionName);
          col.insertOne(obj,function(err,r){
            if(err!=null)
              reject(500);
            else{
              db.close();
              resolve(r.insertedId);
            }
          });
        }
      });
    });   
  }
}

module.exports = dbHandler;



