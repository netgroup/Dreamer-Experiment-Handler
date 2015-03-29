if (typeof dreamer === 'undefined') {
  var dreamer = {};
}

dreamer.Util = (function (global){
  'use strict';
  	function Util(){
  		console.log("UTILLLLL");
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
	  	console.log("impJsonFromFile", inputFilename);
	  	fs.readFile(inputFilename, 'utf8',function(err, data){
	  		if(err){
	  			console.log("impJsonFromFile", "error");
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