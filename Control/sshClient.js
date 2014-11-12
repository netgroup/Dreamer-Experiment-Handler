if (typeof dreamer === 'undefined') {
  var dreamer = {};
}


dreamer.SshClient = (function (global){
  'use strict';

    var util = require("util");
    var events = require("events");
    var self = this;
    var spawn = require('child_process').spawn;

  	function SshClient(username, psw, address){
      this.username = username;
      this.password = psw;
      this.address = address;

  	}

    util.inherits(SshClient, events.EventEmitter);


  	SshClient.prototype.connect= function(){
      this.ssh = spawn('sshpass', ['-p' ,this.password, 'ssh', '-tt' ,this.username+'@'+this.address]);
      initListeners(this);
  	};

    SshClient.prototype.sendData= function(data){
      this.ssh.stdin.setEncoding('utf-8');
      this.ssh.stdin.write(data + "\n");
    };

    SshClient.prototype.disconnect= function(){
      self.ssh.kill();
      self.emit('disconnected');
    };

    function initListeners(self){
      self.ssh.stdout.setEncoding('utf-8');
      
      self.ssh.stdout.on('data', function(data) {
           // console.log("data-ssh: " + data);
            if (self.connected) {
                return self.emit('data',data);
            }
            if (data.toString().match("root@")) { 
                self.connected=true;
                self.emit('connected',self.address);
                //console.log("data-ssh: "+data);
                self.sendData("cd /home");
                self.sendData("pwd");
                return self.emit('data',data);
            }
            
            if(data.toString().match("Connection refuse")){
                self.emit('refused',self.address);
                self.ssh.kill();
                return;
            }
            if(data.toString().match("Permission denied")){
                self.emit('denied',self.address);
                self.ssh.kill();
                return;
            }
      });
      self.ssh.stderr.setEncoding('utf-8');
      self.ssh.stderr.on('data', function(data) {
        console.log('ssh dataerr ' + data)
        self.emit('dataerr', data);
      });
      
    };


  return SshClient;

}(this));


if (typeof module === 'object') {
  module.exports = dreamer.SshClient;
}