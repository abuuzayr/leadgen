
  var express = require('express'),
  leadlistRouter = express.Router(),
  dbHandler = require('../../database-handler'),
  jsonParser = require('body-parser').json(),
  ContactsManager = require('../../ContactsManager/contacts-manager'),
  ScrapManager = require('../../ScrapingManager/scrap-manager'),
  mongodb = require('mongodb'),
  md5 = require('blueimp-md5'),
  MailinglistManager = require('../../MailinglistManager/mailinglist-manager'),
  MailchimpManager = require('../../MailchimpManager/syncContacts');
  var apiKey = 'a21a2e3e5898ad6e1d50046f8c33b8ff-us13';
/*
  //ACCESS CONTROL
  leadlistRouter.use('*',http403.verifyAccess('usermgmt'));
*/
/*
CRUD on leads
*/
leadlistRouter.route('/contacts/leadList/leads')
  .get(function(req, res) {
    console.log('get leads');
    ContactsManager.displayLeads(null, deleteContact)
      .then(function(results) {
        res.json(results);
      })
      .catch(function(error) {
        res.sendStatus(error);
      });
  })
  .post(function(req, res) {
    console.log('add leads');
    console.log(req.body);
    if (!req.body)
      res.sendStatus(400);
    else {
      ContactsManager.addContacts(req.body)
        .then(function(results) {
          res.sendStatus(results);
        })
        .catch(function(error) {
          res.sendStatus(error);
        });
    }
  })
  .put(jsonParser, function(req, res) {
    console.log('delete api');
    // console.log(req.body);
    if (!req.body)
      returnStatusCode(res, 400);
    else {
      var arr = [];
      for (var i = 0; i < req.body.length; i++) {
        arr.push(req.body[i]._id);
      }
      var promiseArr = [];
      for (var i = 0; i < arr.length; i++) {
        promiseArr.push(deleteContact(arr[i]));
        // console.log(arr[i]);
      }
      Promise.all(promiseArr)
        .then(function(results) {
          res.sendStatus(200);
        })
        .catch(function(error) {
          res.sendStatus(500);
        });
    }
  })
  .patch(function(req, res) {
    if (!req.body)
      returnStatusCode(res, 400);
    else {
      /*Required Steps: (Mailchimp Server, App Server)
        1) Check origin of the contact
        2) If origin is YP, change to non origin
        3) Check if contact is in mailing list
        4) Update mail chimp server then app server
        6) Update the contacts 
        === SAMPLE POST ===
       [
        {
          "_id": "5775cd2213c50d6605ef938e",
          "firstName": "GRU",
          "lastName": "TEST",
          "email": null,
          "companyName": "Fichtner (Asia) Pte Ltd",
          "phoneNumber": "+65 6227 0227",
          "category": "engineering",
          "type": 1,
          "origin": 1
        },
        {
          "_id": "5775cd3013c50d6605ef938f",
          "firstName": null,
          "lastName": null,
          "email": null,
          "companyName": "Fichtner (Asia) Pte Ltd",
          "phoneNumber": "+65 6227 0227",
          "category": "engineering",
          "type": 1,
          "origin": 1
        }
      ]*/
      var originObj = req.body[0];
      var newObj = req.body[1];
      var cid = originObj._id;
      var lname, fname;
      var temp = {
        contactID: cid
      };
      if (newObj.firstName !== undefined) {
        fname = newObj.firstName;
      } else {
        fname = originObj.firstName;
      }
      if (newObj.lastName !== undefined) {
        lname = newObj.lastName;
      } else {
        lname = originObj.lastName;
      }
      MailinglistManager.getMailingListMemberInfo('mailinglists', temp)
        .then(function(results) {
          if (results.length !== 0) {
            var promiseArr = [];
            for (var i = 0; i < results.length; i++) {
              promiseArr.push(updateContact(results[i], fname, lname, req.body));
            }
            return Promise.all(promiseArr);
          } else {
            return ContactsManager.updateContacts(req.body);
          }
        })
        .then(function(results) {
          res.sendStatus(200);
        })
        .catch(function(error) {
          console.log(error);
          res.sendStatus(500);
        });
    }
  });
leadlistRouter.put('/contacts/leadList/leads/duplicates', jsonParser, function(req, res) {
  if (!req.body)
    res.sendStatus(400);
  else {
    dbHandler.dbRemoveDuplicate('leadList', req.body.fieldName)
      .then(function(results) {
        res.sendStatus(200);
      })
      .catch(function(error) {
        res.sendStatus(500);
      });
  }
});
leadlistRouter.get('/contacts/leadList/leads/:id', function(req, res) {
  //TODO return history of lead
  if (!req.params.id)
    res.sendStatus(400);
  else {
    var obj = {
      _id: req.params.id
    };
    dbHandler.dbQuery('leadList', obj, 'app')
      .then(function(results) {
        res.json(results[0].history);
      })
      .catch(function(error) {
        res.sendStatus(error);
      });
  }
});
leadlistRouter.post('/contacts/leadList/import', jsonParser, function(req, res) {
  //console.log(req.body);
  if (!req.body)
    res.sendStatus(400);
  else {
    if (!Array.isArray(req.body))
      res.sendStatus(400);
    else {
      ContactsManager.addBulkContacts(res, req.body, returnStatusCode);
    }
  }
});
/*
CRUD on leads list
*/

/*
Purpose: To retrieve information for front end display
  ===SAMPLE POST JSON===
[
    {
    "apiKey": "a21a2e3e5898ad6e1d50046f8c33b8ff-us13"
    }
]
*/
leadlistRouter.route('/contacts/mailingList')
  .get(function(req, res) {
    if (!req.body)
      returnStatusCode(res, 400);
    else {
      //Sync mailchimp
      MailchimpManager.syncContacts(apiKey)
        .then(function(SResults) {
          console.log("MailinglistManager.updateMemberInfo Results:");
          console.log(SResults);
          MailinglistManager.getListNames(res, 'mailinglists', displayResultsCallback);
        }).catch(function(error) {
           res.sendStatus(error);
        });
    }
  })
  /*  ===SAMPLE POST JSON===
      {
        "listName": "PostingList1"
      }
  */
  .post(function(req, res) {
    if (!req.body)
      returnStatusCode(res, 400);
    else {
      //create mailinglist
      MailchimpManager.addList(apiKey, req.body.listName) //1- 
        .then(function(MCResults) {
          console.log("Mailchimp.addList Results:");
          console.log(MCResults);
          var addObject = {
            contactID: '-',
            listID: MCResults.id,
            name: MCResults.name,
            email_addr: '-',
            email_hash: '-',
            firstName: '-',
            lastName: '-',
            subscriberStatus: '-'
          };
          MailinglistManager.addList(res, 'mailinglists', addObject, returnStatusCode); //1
        }).catch(function(MCerror) {
           res.sendStatus(MCerror);
        });
    }
  })
  .put(function(req, res) {
    if (!req.body)
      returnStatusCode(res, 400);
    else {
      /*Required Steps: (Mailchimp Server, App Server)
        1) Remove mailing list from mailchimp
        2) When completed remove the list from app server
        {
          "listID": ""
        }
        [ { listID: '3a365442aa', name: 'PostingList7', subscribers: 4 } ]
        */
      MailchimpManager.deleteList(apiKey, req.body[0].listID) //1-
        .then(function(MCResults) {
	  console.log(MCResults);
          MailinglistManager.deleteList(res, 'mailinglists', req.body[0], returnStatusCode); //1-        
        }).catch(function(MCError) { 
	  res.sendStatus(405);
        });
    }
  })
  .patch(function(req, res) {
    if (!req.body)
      returnStatusCode(res, 400);
    else {
      /*Required Steps: (Mailchimp Server, App Server)
        1) Update mailchimp with new name
        2) Update app server with new name*/
      /* ===SAMPLE JSON POST ===
        
      [
        {
          "listID":"ba458816f3",
          "name":"PL3"
        },
        {
          "listID":"ba458816f3",
          "name":"PL4test"
        }
      ]
      */
      MailchimpManager.getListInformation(apiKey, req.body[0].listID).then(function(results) {
        console.log(results);
        var temp = {
          listID: results.id,
          name: req.body[1].name,
          contact: results.contact,
          permission_reminder: results.permission_reminder,
          campaign_defaults: results.campaign_defaults,
          email_type_option: results.email_type_option
        };
        //package the retrieve information
        console.log(temp);
        MailchimpManager.updateList(apiKey, req.body[0].listID, temp)
          .then(function(MCResults) {
            MailinglistManager.updateList(res, 'mailinglists', req.body, returnStatusCode);
          }).catch(function(MCError) {
           res.sendStatus(MCerror);
          });
      });
    }
  });

leadlistRouter.route('/contacts/mailingList/subscriber')
  .post(jsonParser, function(req, res) {
    if (!req.body)
      returnStatusCode(res, 400);
    else {
    //  console.log(req.body);
      //Suppose to sort incoming json file into merge fields so that it will be easier to add to mailchimp
      /* 1) Add subscriber into mailchimp according to list 
         2) After creating the batch, add the members in mailing list table
         addMemberToList: function(apiKey,listID,memberInfo)      
*/
      var memberinfoPromiseArr = [];
      for (var i = 0; i < req.body[0].y.length; i++) {
        var temp = {
          status: 'subscribed',
          email_address: req.body[0].y[i].email,
          merge_fields: {
            FNAME: req.body[0].y[i].firstName,
            LNAME: req.body[0].y[i].lastName
          }
        };
        memberinfoPromiseArr.push(MailchimpManager.addMemberToList(apiKey,req.body[1].listID,temp));
      }
      Promise.all(memberinfoPromiseArr)
        .then(function(MCResults)
        {
        console.log(MCResults);
        var obj=[];
        for(var i = 0; i<req.body[0].y.length;i++)
        {
          var temp={
            contactID:req.body[0].y[i]._id+'',
            listID: req.body[1].listID,
            name: req.body[1].name,
            email_addr: req.body[0].y[i].email,
            email_hash: md5(req.body[0].y[i].email),
            firstName: req.body[0].y[i].firstName,
            lastName: req.body[0].y[i].lastName,
            subscriberStatus: 'subscribed'
          };
          console.log(temp);
          obj.push(temp);
        }
          MailinglistManager.getFilterMembers('mailinglists',req.body[1].listID,obj)
          .then(function(dbResults2){
            console.log(dbResults2);
           MailinglistManager.addMemberToList(res,'mailinglists',dbResults2,returnStatusCode);
          });
        });
    }
  })
  //Remove member from mailing list
  .put(function(req, res) {
    if (!req.body)
      returnStatusCode(res, 400);
    else {
      if (req.body.length !== 0) {
        console.log(req.body);
        //there is a contact in mailing list that need to be deleted.
        /*  ====SAMPLE POST====
          {
              [{"listID": "6b444f37c4",
            "email_hash": "91bb87a98edc7e2f45c605a46d12d65b",
            "_id":"aaaaa"
            },
                 {"listID": "6b444f37c4",
                 "email_hash": "1ff577ac1929480c2510398aa4999cad",
                 "_id":"aaaaa"
                 }    
            ]
          }*/
        var promiseArr = [];
        for (var i = 0; i < req.body.length; i++) {
          promiseArr.push(MailchimpManager.deleteMember(apiKey, req.body[i].listID, req.body[i].email_hash));
        }
        Promise.all(promiseArr)
          .then(function(MCresults) {
            MailinglistManager.deleteMember(res, 'mailinglists', req.body, returnStatusCode);
          }).catch(function(MCerror) {
           res.sendStatus(MCerror);
          });
      }
    }
  });
leadlistRouter.route('/mailinglist/getSubscriber')
  .post(function(req, res) {
    if (!req.body)
      returnStatusCode(res, 400);
    else {
      /*=====Sample Post=== //get members base on list ID
        {
          "listID":"",
          "name" : ""
        }
      */
      MailinglistManager.getSubscribers(res, 'mailinglists', req.body, displayResultsCallback);
    }
  });
/*
CRUD on fields
*/
leadlistRouter.route('/contacts/leadList/fields')
  .get(function(req, res) {
    console.log('get columns');
    ContactsManager.displayList('columnDef', null)
      .then(function(results) {
        res.json(results);
      })
      .catch(function(error) {
        res.sendStatus(error);
      });
  })
  .post(jsonParser, function(req, res) {
    if (!req.body)
      res.sendStatus(400);
    else {
      if (req.body.field === undefined || req.body.field === null || req.body.field === '')
        res.sendStatus(400);
      else {
        var str = req.body.field;
        ContactsManager.addField('leadList', str)
          .then(function(results) {
            return ContactsManager.insertColumnDef(req.body);
          })
          .then(function(results) {
            res.sendStatus(200);
          })
          .catch(function(error) {
            res.sendStatus(500);
          });
      }
    }
  })
  .put(jsonParser, function(req, res) {
    if (!req.body)
      res.sendStatus(400);
    else {
      if (req.body.field === undefined || req.body.field === null || req.body.field === '')
        res.sendStatus(400);
      else {
        var str = req.body.field;
        ContactsManager.removeField('leadList', str)
          .then(function(results) {
            return ContactsManager.deleteColumnDef(req.body);
          })
          .then(function(results) {
            res.sendStatus(200);
          })
          .catch(function(error) {
            res.sendStatus(500);
          });
      }
    }
  });
/*
  BlackList API
*/
leadlistRouter.route('/contacts/blackList/domain')
  .get(function(req, res) {
    dbHandler.dbQuery('blackListDomains', null, 'app')
      .then(function(results) {
        res.json(results);
      })
      .catch(function(error) {
        res.sendStatus(error);
      });
  })
  .post(jsonParser, function(req, res) {
    if (!req.body)
      res.sendStatus(400);
    else {
      if (req.body.domain === undefined || req.body.domain === null || req.body.domain === '')
        res.sendStatus(400);
      else {
        ContactsManager.addDomain(req.body)
          .then(function(results) {
            return ContactsManager.addDomainChain('leadList', req.body.domain, deleteContact);
          })
          .then(function(results) {
            res.sendStatus(results);
          })
          .catch(function(error) {
            res.sendStatus(error);
          });
      }
    }
  })
  .put(jsonParser, function(req, res) {
    console.log(req.body);
    if (!req.body)
      res.sendStatus(400);
    else {
      if (req.body.domain === undefined || req.body.domain === null || req.body.domain === '')
        res.sendStatus(400);
      else {
        var str = req.body.domain;
        ContactsManager.deleteDomain(req.body)
          .then(function(results) {
            res.sendStatus(results);
          })
          .catch(function(error) {
            res.sendStatus(error);
          });
      }
    }
  });
leadlistRouter.route('/contacts/blackList')
  .get(function(req, res) {
    ContactsManager.displayList('blackList', null)
      .then(function(results) {
        res.json(results);
      })
      .catch(function(error) {
        res.sendStatus(error);
      });
  })
  .put(jsonParser, function(req, res) {
    if (!req.body)
      res.sendStatus(400);
    else {
      ContactsManager.deleteFromBlackList(req.body)
        .then(function(results) {
          res.sendStatus(results);
        })
        .catch(function(error) {
          res.sendStatus(error);
        });
    }
  });

var displayResultsCallback = function(res, results) {
  res.json(results);
};
var returnStatusCode = function(res, statusCode) {
  res.sendStatus(statusCode);
};
var deleteContact = function(cid) {
  return new Promise(function(resolve, reject) {
    /* User removes user from contacts, ripple effects to mailchimp and mailing list
    Required Steps: (Mailchimp Server, App Server)
      1) Check mailing list for that contact
      2) If found remove them from mailing list and mailchimp
      3) when both completed delete from app server database.*/
    var CID = cid;
    var temp = {
      contactID: cid + ''
    };
    var obj = {
      _id: cid
    };
    console.log(obj);
    MailinglistManager.getMailingListMemberInfo('mailinglists', temp) // 1 -
      .then(function(results) {
        if (results.length !== 0) { //there is a contact in mailing list that need to be deleted.
          console.log(results);
          var promiseArr = [];
          for (var i = 0; i < results.length; i++) {
            promiseArr.push(MailchimpManager.deleteMember(apiKey, results[i].listID, results[i].email_hash));
          }
          Promise.all(promiseArr)
            .then(function(MCresults) {
              MailinglistManager.deleteListv2('mailinglists', temp)
                .then(function(MLResults) {
                  console.log("Delete from contacts");
                  ContactsManager.deleteLeads(obj)
                    .then(function(results) {
                      resolve(MLResults);
                    })
                    .catch(function(error) {
                      reject(error);
                    });
                }).catch(function(MLerror) {
                 res.sendStatus(MLerror);
                });
            }).catch(function(MCerror) {
              res.sendStatus(MCerror);
            });
        } else {
          ContactsManager.deleteLeads(obj)
            .then(function(results) {
              resolve(results);
            })
            .catch(function(error) {
              reject(error);
            });
          //add a then function
        }
      }).catch(function(error) {
        reject(500);
      });
  });
};
var updateContact = function(results, firstName, lastName, body) {
  return new Promise(function(resolve, reject) {
    //there is a contact in mailing list that need to be deleted.
    console.log(results);
    var temp = {
      status: results.subscriberStatus,
      email_address: results.email_addr,
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    };
    console.log(temp);
    MailchimpManager.updateMember(apiKey, results.listID, results.email_hash, temp)
      .then(function(MCresults) {
        MailinglistManager.updateMemberInfo('mailinglists', lastName, firstName, results.listID, results.email_hash)
          .then(function(MLResults) {
            console.log("update success");
            resolve(MLResults);
            ContactsManager.updateContacts(body)
              .then(function(cResults) {
                resolve(cResults);
              }).catch(function(cError) {
                res.sendStatus(cError);
              });
          })
          .catch(function(MLerror) {
            res.sendStatus(MLerror);
          });
      }).catch(function(MCerror) {
       res.sendStatus(MCerror);
      });
  });
};

  module.exports = leadlistRouter;
