if (typeof dreamer === 'undefined') {
  var dreamer = {};
}

dreamer.TestBedCtrl = (function (global){
  'use strict';

  	function TestBedCtrl(topopath){
  		console.log("TestBedCtrl")
  	}

  	TestBedCtrl.prototype.deploy= function(a, b, callback){


  	};

  	TestBedCtrl.prototype.sendData = function(data){

  	};

  	TestBedCtrl.prototype.rcvData = function(data){

  	};



  return TestBedCtrl;

}(this));

if (typeof module === 'object') {
  module.exports = dreamer.TestBedCtrl;
}