if (typeof dreamer === 'undefined') {
  var dreamer = {};
}

dreamer.Util = (function (global){
  'use strict';
  	var DEBUG_LOG = "[Util]";

  	function Util(){
  		console.log(DEBUG_LOG,"Builder");
  	}

  	Util.prototype.newJSONfile= function(outputFilename, data, callback){
	  	var fs = require('fs');
	  	
	  	fs.writeFile(outputFilename, JSON.stringify(data, null, 4), function(err) {
	    	if(err) {
	      		callback({error: {message:err}});
	    	} else {
	    		
	      		callback({});
	    	}
		});

  	};

  	Util.prototype.impJsonFromFile= function(inputFilename, callback){
	  	var fs = require('fs');
	  	console.log(DEBUG_LOG,"impJsonFromFile", inputFilename);
	  	fs.readFile(inputFilename, 'utf8',function(err, data){
	  		if(err){
	  			console.log(DEBUG_LOG,"impJsonFromFile", "error");
	  			callback({error: {message:err}});
	  		}
	  		else{
	  			//console.log(data);
	  			var jsondata = JSON.parse(data);

	  			callback({data:jsondata});
	  		}
	  	});

  	};


  return Util;

}(this));

if (typeof module === 'object') {
  module.exports = dreamer.Util;
}