var express = require('express');
var router = express.Router();
var Util = require('./util');
var App = require('../app.js');

/* GET home page. */
router.get('/', function(req, res) {
 	
	res.status(200).send({response: "ok"});

});

/* GET home page. */
router.post('/newExp', function(req, res) {
	// console.log("newEXPPPPPPP" + JSON.stringify(req.body));
	if(req.body.topology && req.body.expid){
		console.log("dentro ")
	var myutil = new Util();
	myutil.newJSONfile("/tmp/"+req.body.expid+".json",JSON.parse(req.body.topology), function(response){

			var MininetCtrl = require('../Control/mininet');

			var p = new MininetCtrl("/tmp/my.json","", App.io);
			console.log("@@@@ size: "+App.explist.length);
			App.explist.push(p);
			//p.provaSshClient("pwd");

			res.status(200).send(response);
		});
	};
	
});



module.exports = router;
