var express = require('express');
var apiRouter = express.Router();
var dbHandler = require('../database-handler');
var jsonParser = require('body-parser').json();
var ContactsManager = require('../ContactsManager/contacts-manager');
var ScrapManager = require('../ScrapingManager/scrap-manager');
var mongodb = require('mongodb');
var fs = require('fs');

var index = 0;

apiRouter.use('/',function(req,res,next){
  console.log('Welcome to the API page');
  next();
});

/*
CRUD on leads list
*/
apiRouter.route('/contacts/leadList/leads')
  .get(function(req,res){
    ContactsManager.displayLeads(null)
    .then(function(results){
      res.json(results);
    })
    .catch(function(error){
      res.sendStatus(error);
    })
  })
  .post(jsonParser,function(req,res){
    if(!req.body)
      res.sendStatus(400);
    else{
      ContactsManager.addContacts(req.body)
      .then(function(results){
        res.sendStatus(results);
      })
      .catch(function(error){
        res.sendStatus(error);
      })
    }
  })
  .delete(jsonParser,function(req,res){
    if(!req.body)
      res.sendStatus(400);
    else{
      ContactsManager.deleteLeads(req.body)
      .then(function(results){
        res.sendStatus(results);
      })
      .catch(function(error){ 
        res.sendStatus(error);
      })
    }
  })
  .patch(jsonParser,function(req,res){
    if(!req.body)
      res.sendStatus(400);
    else{
      ContactsManager.updateContacts(req.body)
      .then(function(results){
        res.sendStatus(results);
      })
      .catch(function(error){
        res.sendStatus(error);
      })
    }
  });

apiRouter.delete('/contacts/leadList/leads/duplicate',jsonParser,function(req,res){
  if(!req.body)
    res.sendStatus(400);
  else{
    dbHandler.dbRemoveDuplicate('leadList',req.body.fieldName)
    .then(function(results){
      res.sendStatus(200);
    })
    .catch(function(error){
      res.sendStatus(500  );
    })
  }
})

apiRouter.get('/contacts/leadList/leads/:id',function(req,res){
  //TODO return history of lead
  if(!req.params.id)
    res.sendStatus(400);
  else{
    var obj = {
      _id  : req.params.id
    }
    dbHandler.dbQuery('leadList',obj)
    .then(function(results){
      res.json(results);
    })
    .catch(function(error){
      res.sendStatus(error);
    })
  }
})

apiRouter.post('/contacts/leadList/import',jsonParser,function(req,res){
  if(!req.body)
    res.sendStatus(400);
  else{
    if(!Array.isArray(req.body))
      res.sendStatus(400);
    else{
      ContactsManager.addBulkContacts(res,req.body,returnStatusCode);
    }
  }
});

/*
*API for ui grid fields
*/
apiRouter.route('/contacts/leadList/fields')
  .get(function(req,res){
    ContactsManager.displayList('columnDef',null)
    .then(function(results){
      res.json(results);
    })
    .catch(function(error){
      res.sendStatus(error);
    });
  })
  .post(jsonParser,function(req,res){
    if(!req.body)
      res.sendStatus(400);
    else{
      if(req.body.field == undefined || req.body.field == null || req.body.field== '')
        res.sendStatus(400);
      else{
        var str = req.body.field; 
        ContactsManager.addField('leadList',str)
        .then(function(results){
          return ContactsManager.insertColumnDef(req.body);
        })
        .then(function(results){
          res.sendStatus(200);
        })
        .catch(function(error){
          res.sendStatus(500);
        })        
      }
    }
  })
  .delete(jsonParser,function(req,res){
    if(!req.body)
      res.sendStatus(400);
    else{
      if(req.body.field == undefined || req.body.field == null || req.body.field == '')
        res.sendStatus(400);
      else{
        var str = req.body.field; 
        ContactsManager.removeField('leadList',str)
        .then(function(results){
          return ContactsManager.deleteColumnDef(req.body);
        })
        .then(function(results){
          res.sendStatus(200);
        })
        .catch(function(error){
          res.sendStatus(500);
        })        
      }
    }
  });

/*
  BlackList API
*/
apiRouter.route('/contacts/blackList/domain')
  .get(function(req,res){
    dbHandler.dbQuery('blackListDomains',null)
    .then(function(results){
      res.json(results);
    })
    .catch(function(error){
      res.sendStatus(error);
    })
  })
  .post(jsonParser,function(req,res){
    if(!req.body)
      res.sendStatus(400);
    else{
      if(req.body.domainName == undefined || req.body.domainName == null || req.body.domainName == '')
        res.sendStatus(400);
      else{
        ContactsManager.addDomain(req.body)
        .then(function(results){
          return ContactsManager.addDomainChain('leadList',req.body.domainName)
        })
        .then(function(results){
          res.sendStatus(results);
        })
        .catch(function(error){
          res.sendStatus(error);
        }); 
      }
    }
  })
  .delete(jsonParser,function(req,res){
    if(!req.body)
      res.sendStatus(400);
    else{
      if(req.body.domainName == undefined || req.body.domainName == null || req.body.domainName == '')
        res.sendStatus(400);
      else{
        var str = req.body.domainName;
        ContactsManager.deleteDomain(req.body)
        .then(function(results){
          res.sendStatus(results);
        })
        .catch(function(error){
          res.sendStatus(error);
        })  
      }
    }
  })

apiRouter.route('/contacts/blackList')
  .get(function(req,res){
    ContactsManager.displayList('blackList',null)
    .then(function(results){
      res.json(results);
    })
    .catch(function(error){
      res.sendStatus(error);
    });
  })
  .delete(jsonParser,function(req,res){
    if(!req.body)
      res.sendStatus(400);
    else{
      ContactsManager.deleteFromBlackList(req.body)
      .then(function(results){
        res.sendStatus(results);
      })
      .catch(function(error){
        res.sendStatus(error);
      })
    }
  })

/*
Scraping API
*/
apiRouter.get('/corporate/scrape/g/new/:category/:country', function(req,res){
  if(!req.params.category || !req.params.country)
    res.sendStatus(400);
  else{
    var type = req.params.category;
    var country = req.params.country.replace('+' , ' ');
    index = 0;
    ScrapManager.scrapCorporateGoogleNew(type,country)
    .then(function(results){
      res.json(results);
    })
    .catch(function(error){
      res.sendStatus(400);
    });
  }
})
apiRouter.get('/corporate/scrape/g/cont/:category/:country',function(req,res){
  if(!req.params.category || !req.params.country)
    res.sendStatus(400);
  else{
    var type = req.params.category;
    var country = req.params.country.replace('+', ' ');
    index ++;
    ScrapManager.scrapCorporateGoogleCont(index,type,country)
    .then(function(results){
      res.json(results);
    })
    .catch(function(error){
      res.sendStatus(400);
    });
  }
})
apiRouter.get('/corporate/scrape/yp/:category',function(req,res){
  if(!req.params.category)
    res.sendStatus(400);
  else{
    var type = req.params.category;
    ScrapManager.scrapCorporateYellowPage(type)
    .then(function(results){
      res.json(results);
    })
    .catch(function(error){
      res.sendStatus(400);
    });
  }
})
apiRouter.get('/consumer/scrape/yp/:category',function(req,res){
  if(!req.params.category)
    res.sendStatus(400);
  else{
    var type = req.params.category;
    ScrapManager.scrapConsumerYellowPage(type)
    .then(function(results){
      res.json(results);
    })
    .catch(function(error){
      res.sendStatus(400);
    });
  }
})
apiRouter.post('/corporate/scrape/',jsonParser,function(req,res){
  if(!req.body)
    res.sendStatus(400);
  else{
    if(!Array.isArray(req.body))
      res.sendStatus(400);
    else{
      ContactsManager.addBulkContacts(res,req.body,returnStatusCode);
    }
  }
})


apiRouter.post('/test',jsonParser,function(req,res){
  if(!req.body)
    res.sendStatus(400);
  else{
    dbHandler.dbInsertReturnID('leadList',req.body)
    .then(function(results){
      res.json(results);
    })
    .catch(function(error){
      res.sendStatus(error);
    })
  }
})

/*
callback functions
*/
var displayResultsCallback = function(res,results){
  res.json(results);
};

var returnStatusCode = function(res,statusCode){
  res.sendStatus(statusCode);
}

module.exports = apiRouter;