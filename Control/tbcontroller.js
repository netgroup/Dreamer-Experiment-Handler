if (typeof dreamer === 'undefined') {
  var dreamer = {};
}
var Util = require('../routes/util');
var config = require('../config');


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
  		
  		if(topopath != undefined){
  			console.log("[TestBedCtrl]: expname: " + expname);
  			this.tpath = topopath;
	  		this.expname = (expname != undefined && expname.length > 0)? expname : "";
	  		this.ns = io.of('/' + this.expname);
	  		
	  		var self = this;
	  		myUtil.impJsonFromFile(topopath,function(data){
	  			if(!data.error){
	  				console.log("[TestBedCtrl]: topology JSON data loaded");
	  				self.topology = data.data;
	  				setupWebSocketListener(self);
	  				self.setupNodeProp();
	  			}
	  			else{
	  				self.topology = {};
	  			}
	  		});
  		}

  	}

  	function getNodesInfo(nodeid, tpath){
  		var myutil = new Util();
		myutil.impJsonFromFile(tpath, function(response) {
		   	console.log("callback impJsonFromFile");
			clientws[nodeid].emit('info_nodes', JSON.stringify(response.data));
		});
  	}

  	TestBedCtrl.prototype.setupNodeProp = function(){
  		for(var n in this.topology.vertices){ //TODO validi per mininet
  			clientsp[n] = { username : "root", psw: "root", address: ""};
  		}
  	};

  	function setupWebSocketListener(self){

  		self.ns.on('connection', function(socket){
  			console.log("[TestBedCtrl]: Socket.io connection event " + socket.id);

  			socket.on('new-deploy-shell', function(data) {
		        console.log("[TestBedCtrl]: new-deploy-shell command received");
		        
		        var nodeid = data.nodeid;
		        if(nodeid != undefined){
		        	clientws[nodeid] = socket;
		        	sh = spawn("/bin/sh");
		        	sh.stdout.setEncoding('utf-8');
				    sh.stdin.setEncoding('utf-8');
		        	socket.join(nodeid)
		        		.emit("cmd_res", "deployment shell allowed!")
		        		.on('disconnect', function(data) {
				        	console.log("[TestBedCtrl]: websocket deployment shell disconnected on nodeid: " + nodeid);
				    	})
				    	.on('cmd', function(data){
				    		console.log("[TestBedCtrl]: deployment shell comman received: " + data.cmd);
				    		if(data.cmd == "deploy"){
				    			sh.stdin.write("cd " + config.mininet.mininet_extension_path+ "\n");
								sh.stdin.write("sudo python ./mininet_deployer.py --topology "+self.tpath + " --nodeinfo " + self.tpath + "\n");
							}else if(data.cmd == "info_nodes"){
								getNodesInfo(nodeid, self.tpath);
							}
				    		else
				    			sh.stdin.write(data.cmd+ "\n");
				    	});
		        	sh.stdout.on('data', function(data) {
				        console.log("[TestBedCtrl]::[deploy log]: " + data);
				        if(data.indexOf("is running sshd at the following address") > 0){
				        	var line = data.split("\n");
				        	for(var l in line){
				        		
				        		if(line[l].indexOf("is running sshd at the following address") > 0){
					       			var spli = line[l].split(" ");
					        		if(clientsp[spli[1]])
					        			clientsp[spli[1]].address = spli[9];
					        		else
					        			clientsp[spli[1]] = { username : "root", psw: "root", address: spli[9]};			       			
				       			}
				       			else if(line[l].indexOf("Starting CLI") > 0){
				       				getNodesInfo(nodeid, self.tpath);
				       			}

				        	}

				        }
				        clientws[nodeid].emit('cmd_res', data);
				    });
				    sh.stderr.setEncoding('utf-8');
				    sh.stderr.on('data', function(data) {
				       console.log("[TestBedCtrl]::[deploy log]: " + data);
				        if(data.indexOf("is running sshd at the following address") > 0){
				        	var line = data.split("\n");
				        	for(var l in line){
				        		
				        		if(line[l].indexOf("is running sshd at the following address") > 0){
					       			var spli = line[l].split(" ");
					        		if(clientsp[spli[1]])
					        			clientsp[spli[1]].address = spli[9];
					        		else
					        			clientsp[spli[1]] = { username : "root", psw: "root", address: spli[9]};			       			
				       			}
				       			else if(line[l].indexOf("Starting CLI") > 0){
				       				getNodesInfo(nodeid, self.tpath);
				       			}
				        	}

				        }
				        clientws[nodeid].emit('cmd_res', data);
				    });
		        }
		    });


		   	socket.on('new-node-shell', function(data) {
		   		var nodeid = data.nodeid;
		        if(nodeid != undefined){
		        //if(data != undefined){
		        	var SshClient = require('./sshClient');
	        		var nodep = clientsp[nodeid];
	        		console.log(nodep.username, nodep.psw, nodep.address); 
					var sshClient = new SshClient(nodep.username, nodep.psw, nodep.address); 
					sshclients[nodeid] = sshClient;
					clientws[nodeid] = socket;
		        	socket.join(nodeid)
		        		.emit("cmd_res", nodeid + " shell")
						.on('disconnect', function(data) {
				        	console.log("[TestBedCtrl]::[sshclient]", nodeid, "disconnected");
				    	})
				    	.on("cmd", function(data){
    						console.log("[sshclient] exec cmd: " + data.cmd, "on", nodeid);
    						if(data.cmd == "cmd_reconnect"){
    							sshClient.setAddress(clientsp[nodeid].address);
    							sshClient.connect();			
    						}else
    							sshClient.sendData(data.cmd);
		        		});
    					sshClient.on("data", function(data){
							console.log("[sshclient] data from " + nodeid, data);
    						socket.emit('cmd_res', data);
    					});
    					sshClient.on("error", function(data){
							console.log("[sshclient] error from " + nodeid, data);
    						socket.emit('error_res', data);
    					});
    				sshClient.connect(); 
		        	
		        }

		    });


		});
  	};




  return TestBedCtrl;

}(this));

if (typeof module === 'object') {
  module.exports = dreamer.TestBedCtrl;
}