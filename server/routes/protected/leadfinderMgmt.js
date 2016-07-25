var express = require('express');
var leadfinderRouter = express.Router();
var ContactsManager = require('../../ContactsManager/contacts-manager');
var ScrapManager = require('../../ScrapingManager/scrap-manager');

var http403 = require('../../utils/403')();
  
  //ACCESS CONTROL
leadfinderRouter.use('*',http403.verifyAccess('leadfinder'));

var index = 0; 

/*
Scraping API
*/
leadfinderRouter.get('/corporate/g/new/:category/:country', function(req, res) {
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
leadfinderRouter.get('/corporate/g/cont/:category/:country', function(req, res) {
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
leadfinderRouter.get('/corporate/yp/:category', function(req, res) {
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
leadfinderRouter.get('/consumer/yp/:category', function(req, res) {
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

leadfinderRouter.post('/', function(req, res) {
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

module.exports = leadfinderRouter;
