var dbHandler = require('../database-handler');
var config = require('../config');
var common = require('../common');
var fs = require('fs');
var mongodb = require('mongodb');
var Promise = require('bluebird');
var mailchimp = require('../MailchimpManager/mailchimpApp');

var ContactsManager = {
  displayLeads: function(collectionName, obj) {
    return new Promise(function(resolve, reject) {
      dbHandler.dbQuery(collectionName, obj)
        .then(function(results) {
          resolve(results);
        })
        .catch(function(error) {
          console.log(error);
          reject(500);
        });
    });
  },
  addContacts: function(obj, coId, coName) {
    return new Promise(function(resolve, reject) {
      if (obj.type != 1 && obj.type != 2)
        reject(400);
      else {
        var matchFlag = false;
        dbHandler.dbQuery(coId + '_blackListDomains', null)
          .then(function(domains) {
            for (var i = 0; i < domains.length; i++) {
              if (obj.email != null || obj.email != undefined) {
                if (obj.email.indexOf(domains[i].domain) != -1) {
                  matchFlag = true;
                  break;
                }
              }
            }


            obj.origin = 1;
            obj.source = coName;

            if (matchFlag) {
              dbHandler.dbInsert(coId + '_blackList', obj)
                .then(function(results) {
                  resolve(results);
                })
                .catch(function(error) {
                  reject(error);
                });
            } else {
              dbHandler.dbInsert(coId + '_leads', obj)
                .then(function(results) {
                  resolve(results);
                })
                .catch(function(error) {
                  reject(error);
                });
            }
          })
          .catch(function(error) {
            reject(error);
          });

      }
    });
  },
  addBulkContacts: function(res, arr, callback, coId, coName) {
    var promiseArr = [];
    dbHandler.dbQuery(coId + '_blackListDomains', null)
      .then(function(domains) {
        var leadsArr = [];
        var blackListArr = [];
        for (var i = 0; i < arr.length; i++) {
          var matchFlag = false;

          if (arr[i].origin === undefined)
            arr[i].origin = 1;

          if (arr[i].type === undefined)
            arr[i].type = 2;

          arr[i].source = coName;

          for (var j = 0; j < domains.length; j++) {
            if (arr[i].email != null || arr[i].email != undefined) {
              if (arr[i].email.indexOf(domains[j].domain) != -1) {
                matchFlag = true;
                break;
              }
            }
          }

          if (matchFlag){
            blackListArr.push(arr[i]);
            // promiseArr.push(dbHandler.dbInsert('blackList', arr[i]));
          }
          else{
            leadsArr.push(arr[i]);
            // promiseArr.push(dbHandler.dbInsert('leads', arr[i]));
          }

        }
        dbHandler.dbInsertMany(coId + '_leads',leadsArr)
          .then(function(success1){
            return dbHandler.dbInsertMany(coId + '_blackList',blackListArr);
          })
          // Promise.all(promiseArr)
          .then(function(success2) {
            callback(res, 201);
          })
          .catch(function(error) {
            callback(res, error);
          });
      })
      .catch(function(error) {
        callback(res, error);
      });
  },
  deleteLeads: function(collectionName, obj) {
    return new Promise(function(resolve, reject) {
      console.log(obj);
      if (!Array.isArray(obj)) {
        dbHandler.dbDelete(collectionName, obj)
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
          arr.push(dbHandler.dbDelete(collectionName, item));
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
  updateContacts: function(collectionName,obj) {
    return new Promise(function(resolve, reject) {
      // console.log('hello from the other side');
      // console.log(obj[0]._id);
      var originalObj = {};
      originalObj._id = obj[0]._id;

      dbHandler.dbUpdate(collectionName, originalObj, obj[1])
        .then(function(results) {
          resolve(200);
        })
        .catch(function(error) {
          reject(500);
        });


    });
  },
  removeField: function(collectionName, str) {
    return new Promise(function(resolve, reject) {
      var arr = [];
      dbHandler.dbQuery(collectionName, null)
        .then(function(results) {
          if (results.length === 0)
            resolve(200);
          for (var i = 0; i < results.length; i++) {
            var obj = results[i];
            delete obj[str];
            arr.push(obj);
          }
          return dbHandler.dbDropCollection(collectionName);
        })
        .then(function(results) {
          var promiseArr = [];
          for (var i = 0; i < arr.length; i++) {
            promiseArr.push(dbHandler.dbInsert(collectionName, arr[i]));
          }
          return Promise.all(promiseArr);
        })
        .then(function(results) {
          resolve(200);
        })
        .catch(function(error) {
          reject(500);
        });
    });
  },
  addField: function(collectionName, str) {
    return new Promise(function(resolve, reject) {
      var arr = [];
      dbHandler.dbQuery(collectionName, null)
        .then(function(results) {
          if (results.length === 0) {
            resolve(200);
          }
          for (var i = 0; i < results.length; i++) {
            var obj = results[i];
            if (obj[str] === undefined)
              obj[str] = null;
            arr.push(obj);
          }
          return dbHandler.dbDropCollection(collectionName);
        })
        .then(function(results) {
          var promiseArr = [];
          for (var i = 0; i < arr.length; i++) {
            promiseArr.push(dbHandler.dbInsert(collectionName, arr[i]));
          }
          return Promise.all(promiseArr);
        })
        .then(function(results) {
          resolve(200);
        })
        .catch(function(error) {
          reject(500);
        });
    });
  },
  addDomainChain: function(str, callback,apiKey, coId) {
    return new Promise(function(resolve, reject) {

      var leadsArr = [];
      dbHandler.dbQuery((coId+'_leads'), null)
        .then(function(results) {
          for (var i = 0; i < results.length; i++) {
            var emailAddr = results[i].email;
            if (emailAddr != null || emailAddr != undefined) {
              if (emailAddr.indexOf(str) != -1) {
                leadsArr.push(results[i]);
              }
            }
          }
          console.log(leadsArr);
          var promiseArr = [];
          for (var i = 0; i < leadsArr.length; i++) {
            promiseArr.push(callback(leadsArr[i]._id,apiKey,coId));
          }
          return Promise.all(promiseArr);
        })
        .then(function(results) {
          var promiseArr = [];
          for (var i = 0; i < leadsArr.length; i++) {
            delete leadsArr[i]._id;
            promiseArr.push(dbHandler.dbInsert((coId+'_blackList'), leadsArr[i]));
          }
          return Promise.all(promiseArr);
        })
        .then(function(results) {
          resolve(200);
        })
        .catch(function(error) {
          reject(500);
        });
    });
  },
  displayList: function(collectionName, obj) {
    return new Promise(function(resolve, reject) {
      dbHandler.dbQuery(collectionName, obj)
        .then(function(results) {
          resolve(results);
        })
        .catch(function(error) {
          reject(error);
        });
    });
  },
  deleteFromBlackList: function(collectionName,obj) {
    return new Promise(function(resolve, reject) {
      if (Array.isArray(obj)) {
        var arr = [];
        for (var i = 0; i < obj.length; i++) {
          arr.push(dbHandler.dbDelete(collectionName, obj[i]));
        }
        Promise.all(arr)
          .then(function(results) {
            resolve(200);
          })
          .catch(function(error) {
            reject(500);
          });
      } else {
        dbHandler.dbDelete(collectionName, obj)
          .then(function(results) {
            resolve(200);
          })
          .catch(function(error) {
            reject(500);
          });
      }
    });
  },
  insertColumnDef: function(collectionName,obj) {
    return new Promise(function(resolve, reject) {
      dbHandler.dbInsert(collectionName, obj)
        .then(function(results) {
          resolve(results);
        })
        .catch(function(error) {
          resolve(error);
        });
    });
  },
  deleteColumnDef: function(collectionName,obj) {
    return new Promise(function(resolve, reject) {
      dbHandler.dbDelete(collectionName, obj)
        .then(function(results) {
          resolve(results);
        })
        .catch(function(error) {
          resolve(error);
        });
    });
  },
  addDomain: function(collectionName,obj) {
    return new Promise(function(resolve, reject) {
      dbHandler.dbInsert(collectionName, obj)
        .then(function(results) {
          resolve(results);
        })
        .catch(function(error) {
          reject(error);
        });
    });
  },
  deleteDomain: function(collectionName,obj) {
    return new Promise(function(resolve, reject) {
      if (Array.isArray(obj)) {
        var promiseArr = [];
        for (var i = 0; i < obj.length; i++) {
          promiseArr.push(dbHandler.dbDelete(collectionName, obj[i]));
        }

        Promise.all(promiseArr)
          .then(function(results) {
            resolve(200);
          })
          .catch(function(error) {
            reject(500);
          });
      } else {
        dbHandler.dbDelete(collectionName, obj)
          .then(function(results) {
            resolve(results);
          })
          .catch(function(error) {
            reject(error);
          });
      }
    });
  },
  addContactMC: function(obj, hash, id, apiKey, coId) {
    return new Promise(function(resolve, reject) {
      //console.log(coId);
      dbHandler.dbInsertReturnID((coId+'_leads'), obj)
        .then(function(results) {
          dbHandler.dbQuery((coId+'_blackListDomains'), null)
            .then(function(domains) {
              var matchFlag = false;

              for (var i = 0; i < domains.length; i++) {
                if (obj.email != null || obj.email != undefined) {
                  if (obj.email.indexOf(domains[i].domain) != -1) {
                    matchFlag = true;
                    break;
                  }
                }
              }

              if (matchFlag) {
                var item = {};
                item._id = results;

                dbHandler.dbDelete((coId+'_leads'), item)
                  .then(function(success) {
                    return dbHandler.dbInsert((coId+'_blackList'), obj);
                  })
                  .then(function(success) {
                    return mailchimp.deleteMember(apiKey, id, hash);
                  })
                  .then(function(success) {
                    console.log('delete from mailchimp');
                    reject('deleted from mailchimp');
                  })
                  .catch(function(error) {
                    reject(error);
                  });
              } else {
                resolve(results);
              }

            });
        })
        .catch(function(error) {
          reject(error);
        });
    });
  }
};

module.exports = ContactsManager;
