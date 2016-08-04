//Include autentication module,
//access level verification module,
//and 403 ACCESS FORBIDDEN handler.
module.exports = function(){

	var service = {
		generateCookie : generateCookie,
		decodeAccessInfo: decodeAccessInfo,
		verifyAccess: verifyAccess,
		send403:send403
	};
	return service;

	function generateCookie(req,res){
		var config = require('../config.js');
		var jwt = require('jsonwebtoken');
		var token = req.cookies['session'];
		console.log('Generate Cookie');//TOFIX
		console.log('Session Cookie: '+token);//TOFIX

		if(!token)
			send403(req,res,"no token");
		else{
			jwt.verify(token,config.superSecret,function(err, decoded){
				if(err){
					return send403(req,res,"Authentication failed with error: " + err.message);
				}
				else{
					req.decoded = decoded;
					console.log('This is decoded');
					console.log('Decoded JWT: ' + JSON.stringify(decoded));
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
		console.log('decoding access info');//TOFIX
		var ecodedAccessInfo = req.decoded.application;
		//console.log(ecodedAccessInfo);//TOFIX
		var decipher = crypto.createDecipher(algorithm,config.appSecret);
		try{
			var decodedAccessInfo = decipher.update(ecodedAccessInfo,'hex','utf8');
			decodedAccessInfo += decipher.final('utf8');
			console.log("decoded access info");
			//console.log(decodedAccessInfo);
			req.accessInfo = JSON.parse(decodedAccessInfo);
<<<<<<< HEAD
			console.log('Access Info: '+req.accessInfo);//TOFIX
=======
			//console.log(req.accessInfo);//TOFIX
>>>>>>> 78728923f1dbc303d669b6f2402f13a6e542f38d
			 next();
		}catch(err){
			console.log(err);//TOFIX
			return send403(req,res,"Authentication failed with error: " + err.message);
		}
	}
	function verifyAccess(moduleName){
		return function(req,res,next){
		console.log('Req Access Info: ' + JSON.stringify(req.accessInfo));//TOFIX
		var module = req.accessInfo[moduleName];
<<<<<<< HEAD
		console.log('verifying access');//TOFIX
		console.log('Module: ' + module);//TOFIX
		console.log('Module Name: ' + moduleName);
=======
		//console.log('verifying access');//TOFIX
		//console.log(module);//TOFIX
		//console.log(moduleName);
>>>>>>> 78728923f1dbc303d669b6f2402f13a6e542f38d
		console.log('req.method: '+ req.method);//TOFIX
					switch(req.method){
				case 'GET':
						console.log('GET',module.read,module.read == true);//TOFIX
						if(module.read == true)
							next();
						else
							send403(req,res,'Unauthorized user group');
						break;
				case 'POST':
						console.log('POSt');//TOFIX
						if(module.create == true)
							next();
						else
							send403(req,res,'Unauthorized user group');

					break;
				case 'PATCH':	console.log('PUt');//TOFIX
						if(module.update == true)
							next();
						else
							send403(req,res,'Unauthorized user group');

					break;
				case 'PUT':
						console.log('DELETe');//TOFIX
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
