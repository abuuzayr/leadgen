
module.exports = function(){
	var service = {
		verifyAccess: verifyAccess,
		verifyAutofill: verifyAutofill,
		verifyFormBuilder: verifyFormBuilder,
		verifyFormMgmt : verifyFormMgmt,
		verifyEntryMgmt: verifyEntryMgmt,
		verifyUserMgmt: verifyUserMgmt
	};

	var config = require('../config');
	var http403 = require('./403');

	// function verifyAccess(moduleName){
	// 	switch(moduleName){
	// 		case:'autofill'
	// 			return verifyAutofill;
	// 			break;
	// 		case:'formbuilder'
	// 			return verifyFormBuilder;
	// 			break;
	// 		case:'formmgmt'
	// 			return verifyFormMgmt;
	// 			break;
	// 		case:'entrymgmt'
	// 			return verifyEntryMgmt;
	// 			break;
	// 		case:'formmgmt'
	// 			return verifyAutofill;
	// 			break;
	// 		case:'usermgmt'
	// 			return verifyAutofill;
	// 			break;
	// 		default:
	// 			send403(req,res,'Application module not specified');	
	// 	}
	// }
	
	function verifyAcess(operation,moduleName){
		switch(operation){
			case 'GET':
				return function(req,res,next){
					if(req.method === 'GET' && req.accessInfo[moduleName].read === true)
						next();
					else 
						http403.send403(req,res,'Unauthorized user group')
				}
				break;
			case 'POST':
				return function(req,res,next){
					if(req.method === 'POST' && req.accessInfo[moduleName].create === true)
						next();
					else 
						http403.send403(req,res,'Unauthorized user group');
				}
				break;
			case 'PUT':
				return function(req,res,next){
					if(req.method === 'PUT' && req.accessInfo[moduleName].update === true)
						next();
					else 
						http403.send403(req,res,'Unauthorized user group');
				}
				break;
			case 'DELETE':
				return function(req,res,next){
					if(req.method === 'PUT' && req.accessInfo[moduleName].delete === true)
						next();
					else 
						http403.send403(req,res,'Unauthorized user group');
				}
				break;
			default:
				return http403.send403	(req,res,'Invalid request');
		}
	}

	// function verifyAutofill(req,res,next){
	// 	var usertype = req.accessInfo.usertype;
	// 	if(usertype != 'Admin'){
	// 		return http403.send403(req,res,'Unauthorized user group');
	// 	}else{
	// 		return next();
	// 	}
	// }
	// function verifyFormBuilder(req,res,next){
	// 	var usertype = req.accessInfo.usertype;
	// 	if(usertype != 'Admin'){
	// 		return http403.send403(req,res,'Unauthorized user group');
	// 	}else{
	// 		return next();
	// 	}
	// }
	// function verifyFormMgmt(req,res,next){
	// 	var usertype = req.accessInfo.usertype;
	// 	if(usertype != 'Admin'){
	// 		return http403.send403(req,res,'Unauthorized user group');
	// 	}else{
	// 		return next();
	// 	}
	// }
	// function verifyEntryMgmt(req,res,next){
	// 	var usertype = req.accessInfo.usertype;
	// 	if(usertype != 'Admin'){
	// 		return http403.send403(req,res,'Unauthorized user group');
	// 	}else{
	// 		return next();
	// 	}
	// }
	// function verifyUserMgmt(req,res,next){
	// 	var usertype = req.accessInfo.usertype;
	// 	if(usertype != 'Admin'){
	// 		return http403.send403(req,res,'Unauthorized user group');
	// 	}else{
	// 		return next();
	// 	}
	// }
}


//	Autofill: User:User+(can view , can edit, can delete, cannot one shot download all)s