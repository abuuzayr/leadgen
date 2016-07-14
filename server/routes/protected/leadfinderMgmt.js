  var express = require('express'),
  leadfinderRouter = express.Router(),
  dbHandler = require('../../database-handler'),
  jsonParser = require('body-parser').json(),
  ContactsManager = require('../../ContactsManager/contacts-manager'),
  ScrapManager = require('../../ScrapingManager/scrap-manager'),
  mongodb = require('mongodb'),
  md5 = require('blueimp-md5'),
  MailinglistManager = require('../../MailinglistManager/mailinglist-manager'),
  MailchimpManager = require('../../MailchimpManager/syncContacts');

/*
  //ACCESS CONTROL
  leadfinderRouter.use('*',http403.verifyAccess('usermgmt'));
*/
/*
Scraping API
*/
leadfinderRouter.get('/corporate/scrape/g/new/:category/:country', function(req, res) {
  if (!req.params.category || !req.params.country)
    res.sendStatus(400);
  else {
    var type = req.params.category;
    var country = req.params.country.replace('+', ' ');
    index = 0;
    ScrapManager.scrapCorporateGoogleNew(type, country)
      .then(function(results) {
        res.json(results);
      })
      .catch(function(error) {
        res.sendStatus(error);
      });
  }
});
leadfinderRouter.get('/corporate/scrape/g/cont/:category/:country', function(req, res) {
  if (!req.params.category || !req.params.country)
    res.sendStatus(400);
  else {
    var type = req.params.category;
    var country = req.params.country.replace('+', ' ');
    index++;
    ScrapManager.scrapCorporateGoogleCont(index, type, country)
      .then(function(results) {
        res.json(results);
      })
      .catch(function(error) {
        res.sendStatus(error);
      });
  }
});
leadfinderRouter.get('/corporate/scrape/yp/:category', function(req, res) {
  if (!req.params.category)
    res.sendStatus(400);
  else {
    var type = req.params.category;
    ScrapManager.scrapCorporateYellowPage(type)
      .then(function(results) {
        res.json(results);
      })
      .catch(function(error) {
        res.sendStatus(400);
      });
  }
});
leadfinderRouter.get('/consumer/scrape/yp/:category', function(req, res) {
  if (!req.params.category)
    res.sendStatus(400);
  else {
    var type = req.params.category;
    ScrapManager.scrapConsumerYellowPage(type)
      .then(function(results) {
        res.json(results);
      })
      .catch(function(error) {
        res.sendStatus(400);
      });
  }
});
leadfinderRouter.post('/scrape/', jsonParser, function(req, res) {
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
                  console.log(MLerror);
                });
            }).catch(function(MCerror) {
              console.log(MCerror);
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
                console.log(cError);
              });
          })
          .catch(function(MLerror) {
            console.log(MLerror);
          });
      }).catch(function(MCerror) {
        console.log(MCerror);
      });
  });
};

  module.exports = leadfinderRouter;
