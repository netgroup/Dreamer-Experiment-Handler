if (typeof dreamer === 'undefined') {
  var dreamer = {};
}

dreamer.Util = (function (global){
  'use strict';
  var MininetCtrl = require('../Control/mininet');
  	function Util(){

  	}

  	Util.prototype.newJSONfile= function(outputFilename, data, callback){
	  	var fs = require('fs');
	  	
	  	var p = new MininetCtrl("");
	  	console.log("DENTRO");
	  	fs.writeFile(outputFilename, JSON.stringify(data, null, 4), function(err) {
	    	if(err) {
	    		
	      		callback({error: {message:err}});
	    	} else {
	    		console.log("SCRITTO");
	      		callback({});
	    	}
		});

  	};


  return Util;

}(this));

if (typeof module === 'object') {
  module.exports = dreamer.Util;
}