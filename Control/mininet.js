if (typeof dreamer === 'undefined') {
  var dreamer = {};
}

//TODO da estendere 

dreamer.MininetCtrl = (function (global){
  'use strict';
    var DEBUG_LOG = "[MininetCtrl]";
    var TestBedCtrl = require('./tbcontroller');
    MininetCtrl.prototype = new TestBedCtrl();
    MininetCtrl.prototype.constructor = MininetCtrl;
    MininetCtrl.prototype.parent = TestBedCtrl.prototype;
    
    
    
  	function MininetCtrl(topopath, expname, io){

      console.log(DEBUG_LOG, "Builder" , expname, topopath);
      TestBedCtrl.call(this,topopath, expname, io);
       //this.parent.constructor.call(this,topopath, expname, io);
  	}


    /*
  	MininetCtrl.prototype.deploy= function(){
      this.parent.deploy.call();

  	};*/





  return MininetCtrl;

}(this));

if (typeof module === 'object') {
  module.exports = dreamer.MininetCtrl;
}