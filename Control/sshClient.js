if (typeof dreamer === 'undefined') {
  var dreamer = {};
}


dreamer.SshClient = (function (global){
  'use strict';
    var DEBUG_LOG = "[SshClient]";
    var util = require("util");
    var events = require("events");
    var self; //= this;
    var spawn = require('child_process').spawn;

  	function SshClient(username, psw, address){
      this.username = username;
      this.password = psw;
      this.address = address;
      self = this;
  	}

    util.inherits(SshClient, events.EventEmitter);


  	SshClient.prototype.connect= function(){
      var self = this;
      this.ssh = spawn('sshpass', ['-p' ,this.password, 'ssh', '-tt' , '-o' ,"StrictHostKeyChecking no" , this.username+'@'+this.address], {env: {
      TERM: 'xterm',
      SHELL: '/bin/bash',
      LANG: 'it_IT.UTF-8',
    }});
      this.ssh.on('error', function(data) {
        console.log(DEBUG_LOG,'ssh error ' + data);
        self.disconnect();
      });
      this.ssh.on('end', function(data) {
       console.log(DEBUG_LOG,'ssh end ' + data)
       // self.disconnect();
      });

      this.ssh.stdin.setEncoding('utf-8');
      this.ssh.stdout.setEncoding('utf-8');
      initListeners(this);
  	};

    SshClient.prototype.setAddress= function(address){
      this.address = address;
    };

    SshClient.prototype.sendData= function(data){
      
      try{
        this.ssh.stdin.write(data + "\r\n");
      }
      catch(e){
        this.emit('error', {msg: 'notconnected', address: this.address});
      }
        
      //else
      //   this.emit('error', {msg: 'notconnected', address: this.address});
    };

    SshClient.prototype.disconnect= function(){
      self.ssh.kill();
      self.emit('disconnected');
    };

    function initListeners(self){
      
      
      self.ssh.stdout.on('data', function(data) {
            console.log(DEBUG_LOG,'ssh data:', data);
            if (self.connected) {
                return self.emit('data',data);
            }
            if (data.toString().match("root@")) { 
                self.connected=true;
                self.emit('connected',self.address);

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
        console.log(DEBUG_LOG,'ssh dataerr:', data);
        if(data.toString().match("Could not resolve hostname")){
                self.emit('error', {msg: 'noresolve', address: self.address});
                self.ssh.kill();
                return;
        }// 
        else if(data.toString().match("No route to host")){
                self.emit('error', {msg: 'unreachable', address: self.address});
                self.ssh.kill();
                return;
        }
        else if(data.toString().match("Network is unreachable")){
                self.emit('error', {msg: 'unreachable', address: self.address});
                self.ssh.kill();
                return;
        }
        else if(data.toString().match("to the list of known hosts")){

            return;
        }
        else{
            self.emit('dataerr', data);
            self.ssh.kill();
            return;
        }
      });
      
    };


  return SshClient;

}(this));


if (typeof module === 'object') {
  module.exports = dreamer.SshClient;
}