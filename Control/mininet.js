if (typeof dreamer === 'undefined') {
  var dreamer = {};
}


dreamer.MininetCtrl = (function (global){
  'use strict';
    var TestBedCtrl = require('./tbcontroller');
    MininetCtrl.prototype = new TestBedCtrl();
    MininetCtrl.prototype.constructor = MininetCtrl;
    MininetCtrl.prototype.parent = TestBedCtrl.prototype;

  	function MininetCtrl(topopath){
      console.log("MininetCtrl")
  	}

  	MininetCtrl.prototype.deploy= function(a, b, callback){


  	};

  	MininetCtrl.prototype.sendData = function(data){

  	};

  	MininetCtrl.prototype.rcvData = function(data){

  	};



  return MininetCtrl;

}(this));

if (typeof module === 'object') {
  module.exports = dreamer.MininetCtrl;
}