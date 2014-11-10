if (typeof dreamer === 'undefined') {
  var dreamer = {};
}


dreamer.MininetCtrl = (function (global){
  'use strict';
    var TestBedCtrl = require('./tbcontroller');
    
    
  	function MininetCtrl(topopath, expname, io){
      console.log("topopath " + topopath);
      TestBedCtrl.call(this,topopath, expname, io);
       //this.parent.constructor.call(this,topopath, expname, io);
  	}

    MininetCtrl.prototype = new TestBedCtrl;
    MininetCtrl.prototype.constructor = MininetCtrl;
    MininetCtrl.prototype.parent = TestBedCtrl.prototype;

  	MininetCtrl.prototype.deploy= function(){
      this.parent.deploy.call();

  	};





  return MininetCtrl;

}(this));

if (typeof module === 'object') {
  module.exports = dreamer.MininetCtrl;
}