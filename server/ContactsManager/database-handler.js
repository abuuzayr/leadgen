var MongoClient = require('mongodb').MongoClient,
assert = require('assert'),
config = require('../config');


var obj = {
	name : 'test',
	email : 'test@test.com'
};


var dbHandler = {
	dbConnect : function(){
		MongoClient.connect(config.dbURI, function(err, db) {
		  assert.equal(null, err);
		  console.log("Connected correctly to server.");
		  db.close();
		});
	},
	dbInsert : function(collectionName){
		MongoClient.connect(config.dbURI,function(err,db){
			assert.equal(null,err);
			var col = db.collection(collectionName);
			col.insert(obj,function(err,r){
				assert.equal(null,err);
				assert.equal(1,r.insertedCount);
				db.close();
			});
		});
	},
	dbQuery : function(){

	},
	dbDelete : function(){

	},
	dbUpdate : function(){
		
	}
}

module.exports = dbHandler;



