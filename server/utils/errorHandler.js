module.exports = function(req,res,status,description,msg){
	return res.status(status).send({
			message: msg,
      		description:description,
  		    url: req.url
	}); 
}; 