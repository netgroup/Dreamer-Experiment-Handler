if (typeof dreamer === 'undefined') {
  var dreamer = {};
}


dreamer.MininetCtrl = (function (global){
  'use strict';
    var TestBedCtrl = require('./tbcontroller');
    MininetCtrl.prototype = new TestBedCtrl();
    MininetCtrl.prototype.constructor = MininetCtrl;
    MininetCtrl.prototype.parent = TestBedCtrl.prototype;
    
    
    
  	function MininetCtrl(topopath, expname, io){
      console.log("topopath " + topopath);
      console.log("expname " + expname);
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