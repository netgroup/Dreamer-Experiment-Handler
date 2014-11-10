if (typeof dreamer === 'undefined') {
  var dreamer = {};
}
var Util = require('../routes/util');
dreamer.TestBedCtrl = (function (global){
  'use strict';

	var myUtil = new Util();
  	var spawn = require('child_process').spawn;


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


	  		setupWebSocketListener(this);
  		}
  	}

  	function setupWebSocketListener(self){
  		self.ns.on('connection', function(socket){
  			console.log('someone connected');
		});
  	};

  	TestBedCtrl.prototype.deploy= function(){
  		console.log("DEPLOY");
  		var sh = spawn("/bin/sh");
  		console.log(sh.connected);
	    sh.stdout.setEncoding('utf-8');
	    sh.stdin.setEncoding('utf-8');
	    sh.stdout.on('data', function(data) {
	        console.log('data-deploy: ' + data)
	        //socket.emit('cmd_res', data);
	    });
	    sh.stderr.setEncoding('utf-8');
	    sh.stderr.on('data', function(data) {
	        console.log('dataerr-deploy: ' + data)
	        //socket.emit('cmd_res', data);
	    });

	    sh.stdin.write("ls"+ "\n");

  	};

  	TestBedCtrl.prototype.provaSshClient = function(data){
  		var SshClient = require('./sshClient');
    	var sshClient = new SshClient("root", "root", "10.0.0.2");
    	sshClient.connect();
    	//sshClient.sendData(data);
    
  	}

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