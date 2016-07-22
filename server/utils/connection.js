//connection.js //Handles database connection 
module.exports = function(){
	return {
		Do: Do,
		superAdmin: superAdmin
	};
	function Do(dbOperation){
		var db = require('../server.js').db1;
    	dbOperation(db);    	
	}

	function superAdmin(dbOperation){
		var db = require('../server.js').db2;
		dbOperation(db);
	}
};