//Include autentication module,
//access level verification module,
//and 403 ACCESS FORBIDDEN handler.
module.exports = function(){

	var service = {
		generateCookie : generateCookie,//generate usertype cookie
		decodeAccessInfo: decodeAccessInfo,//req.accessInfo
		verifyAccess: verifyAccess,//check for module permission rights
		decodeCookieInfo: decodeCookieInfo,//check authentication
		send403:send403
	};
	return service;

	function decodeCookieInfo(req,res,next)
	{
		var config = require('../config.js');
		var jwt = require('jsonwebtoken');
		var token = req.cookies['session'];

		if(!token)
			send403(req,res,"no token");
		else{
			jwt.verify(token,config.superSecret,function(err, decoded){
				if(err){
					return send403(req,res,"Authentication failed with error: " + err.message);
				}
				else{
					req.decoded = decoded;
					jwt.sign({
               			email: decoded.email,
               			usertype: decoded.usertype,
               			subscriptionType: decoded.subscriptionType

               			},config.appSecret,{
               				expiresIn: '1h'
               			},function(err,token){
               				if(err){
               				    return send403(req,res,err.message);
               				}
               				next();
               				});
				}
			});
		}
	}

	function generateCookie(req,res){
		var config = require('../config.js');
		var jwt = require('jsonwebtoken');
		var token = req.cookies['session'];

		if(!token)
			send403(req,res,"no token");
		else{
			jwt.verify(token,config.superSecret,function(err, decoded){
				if(err){
					return send403(req,res,"Authentication failed with error: " + err.message);
				}
				else{
					req.decoded = decoded;
					jwt.sign({
               			email: decoded.email,
               			usertype: decoded.usertype,
               			subscriptionType: decoded.subscriptionType,
										companyId : decoded.companyId,
										userId : decoded._id,
										username : decoded.username,
										companyName : decoded.companyName,
										
               			},config.appSecret,{
               				expiresIn: '1h'
               			},function(err,token){

               				if(err){
               				    return send403(req,res,err.message);
               				}
               				res.cookie('userTypeCookie', token, { maxAge: 360000, httpOnly: false });
               				res.sendStatus(200);
               				});
				}
			});
		}
	}

	function decodeAccessInfo(req,res,next){
		var crypto = require('crypto');
		var config = require('../config.js');
		var algorithm = 'aes-256-ctr';
		var ecodedAccessInfo = req.decoded.application;
		var decipher = crypto.createDecipher(algorithm,config.appSecret);
		try{
			var decodedAccessInfo = decipher.update(ecodedAccessInfo,'hex','utf8');
			decodedAccessInfo += decipher.final('utf8');
			req.accessInfo = JSON.parse(decodedAccessInfo);
			 next();
		}catch(err){
			return send403(req,res,"Authentication failed with error: " + err.message);
		}
	}
	function verifyAccess(moduleName){
		return function(req,res,next){
		var module = req.accessInfo[moduleName];
					switch(req.method){
				case 'GET':
						if(module.read == true)
							next();
						else
							send403(req,res,'Unauthorized user group');
						break;
				case 'POST':
						if(module.create == true)
							next();
						else
							send403(req,res,'Unauthorized user group');

					break;
				case 'PATCH':
						if(module.update == true)
							next();
						else
							send403(req,res,'Unauthorized user group');

					break;
				case 'PUT':
						if(module.delete == true)
							next();
						else
							send403(req,res,'Unauthorized user group');
					break;
				default:
					return send403	(req,res,'Invalid request');
			}
		};
	}

	function send403(req,res,description){
		var data = {
			status: 403,
			message: 'Access Forbidden',
      		description: description,
  		    url: req.url
		}
		res.status(403).send(data);
	}

};
