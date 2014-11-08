if (typeof dreamer === 'undefined') {
  var dreamer = {};
}
var Util = require('../routes/util');
dreamer.TestBedCtrl = (function (global){
  'use strict';
var myUtil = new Util();
  	

  	function TestBedCtrl(topopath, expname, io){
  		console.log("TestBedCtrl exp: " + expname);
  		if(topopath != undefined){
	  		this.expname = expname;
	  		this.ns = io.of('/'+expname);
	  		var self = this;
	  		myUtil.impJsonFromFile(topopath,function(data){
	  			if(!data.error){
	  				self.topology = data.data.topology;
	  			}
	  			else{
	  				self.topology = {};
	  			}
	  		});
  		}

  	}

  	TestBedCtrl.prototype.deploy= function(a, b, callback){


  	};

  	TestBedCtrl.prototype.sendData = function(data){
  		console.log('sendData: '+ data);
  	};

  	TestBedCtrl.prototype.rcvData = function(data){

  	};



  return TestBedCtrl;

}(this));

if (typeof module === 'object') {
  module.exports = dreamer.TestBedCtrl;
}