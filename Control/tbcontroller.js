if (typeof dreamer === 'undefined') {
  var dreamer = {};
}
var Util = require('../routes/util');

dreamer.TestBedCtrl = (function (global){
  'use strict';

	var myUtil = new Util();
  	var spawn = require('child_process').spawn;
  	var clientsp = {};
  	var clientws = [];
  	var sshclients = [];
  	var sh;
  	var depSocket;
  	
  	//var self = this;


  	function TestBedCtrl(topopath, expname, io){
  		console.log("TestBedCtrl exp: " + expname);
  		this.topology = "wer";
  		if(topopath != undefined){
	  		this.expname = expname;
	  		this.ns = io.of('/'+expname);
	  		setupWebSocketListener(this);
	  		var self = this;
	  		myUtil.impJsonFromFile(topopath,function(data){
	  			if(!data.error){

	  				self.topology = data.data;

	  			}
	  			else{
	  				self.topology = {};
	  			}

	  			self.setupNodeProp();
	  		});
  		
  			
  		}


  	}

  	TestBedCtrl.prototype.setupNodeProp = function(){
  		for(var n in this.topology.vertices){
  			clientsp[n] = { username : "root", psw: "root"};
  		}
  	};

  	function setupWebSocketListener(self){
  		self.ns.on('connection', function(socket){
  			console.log('someone connected');
		    socket.on('startDeploy', function(data) {
		        console.log('startDeploy: ' + data);

		    });

		   	socket.on('new-node-shell', function(data) {
		   		var nodeid = data.nodeid;
		        if(nodeid != undefined){
		        //if(data != undefined){
		        	socket.join(data);

	        	    socket.on('disconnect', function(data) {
				        console.log('disconnesso: onDisconnect');
				    });
		        	//var nodeid = 2;
		        	
		        	if(sshclients[nodeid] == undefined){
		        		var SshClient = require('./sshClient');
		        		var nodep = clientsp[nodeid];
    					var sshClient = new SshClient(nodep.username, nodep.psw, nodep.address); //TODO  dati da prelevare clientsp
    					sshclients[nodeid] = sshClient;
    					clientws[nodeid] = socket;
    					sshClient.on("data", function(data){
    						clientws[nodeid].emit('cmd_res', data);
    					});

    					clientws[nodeid].on("cmd", function(data){
    						console.log("sottocanale cmd");
    						sshClient.sendData(data);
		        		});

    					sshClient.connect(); 
		        	}
		        }

		    });

		   	
		    socket.on('cmd', function(data) {

				if(data =="deploy"){
			  		console.log("DEPLOY");
			  		sh = spawn("/bin/sh");
			  		console.log(socket);
			  		//var selfie = this;

				    sh.stdout.setEncoding('utf-8');
				    sh.stdin.setEncoding('utf-8');
				    sh.stdout.on('data', function(data) {
				        console.log('data-deploy: ' + data)
				        if(data.indexOf("nodeaddr") == 0){
				        	var spli = data.split(" ");
				        	clientsp[spli[1]] = spli[2];
				        }
				        socket.emit('cmd_res', data);
				    });
				    sh.stderr.setEncoding('utf-8');
				    sh.stderr.on('data', function(data) {
				        console.log('dataerr-deploy: ' + data)
				        socket.emit('cmd_res', data);
				    });

				    sh.stdin.write("sudo python test/sshdtest.py"+ "\n");

				}
				else if(sh != undefined){
					if(data == "Ctrl-C"){
						console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
						//sh.kill('SIGINT');
						sh.stdin.write("\x03");
					}
					else
						sh.stdin.write(data+ "\n");
				}
		    });

		});
  	};

  	/*TestBedCtrl.prototype.deploy= function(self){
  		console.log("DEPLOY");
  		sh = spawn("/bin/sh");
  		console.log(self.depSocket);
  		//var selfie = this;

	    sh.stdout.setEncoding('utf-8');
	    sh.stdin.setEncoding('utf-8');
	    sh.stdout.on('data', function(data) {
	        console.log('data-deploy: ' + data)
	        this.depSocket.emit('cmd_res', data);
	    });
	    sh.stderr.setEncoding('utf-8');
	    sh.stderr.on('data', function(data) {
	        console.log('dataerr-deploy: ' + data)
	        this.depSocket.emit('cmd_res', data);
	    });

	    sh.stdin.write("sudo python sshdtest.py"+ "\n");

  	};*/


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