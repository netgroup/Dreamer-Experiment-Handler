var express = require('express');
var router = express.Router();
var Util = require('./util');
var App = require('../app.js');
var DEBUG_LOG = "[routes/index.js]";

/* GET home page. */
router.get('/', function(req, res) {

    res.status(200).send({
        response: "ok"
    });

});

/* new experiment */

router.post('/newExp', function(req, res) {
    console.log(DEBUG_LOG, "new request on /newExp");
    if (req.body.topology && req.body.expid) {
        //console.log("dentro ")
        var myutil = new Util();
        myutil.newJSONfile("/tmp/" + req.body.expid + ".json", JSON.parse(req.body.topology), function(response) {
            var MininetCtrl = require('../Control/mininet');
            var p = new MininetCtrl("/tmp/" + req.body.expid + ".json", req.body.expid, App.io);
            //console.log("@@@@ size: " + App.explist.length);
            App.explist.push(p);

            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type,    Accept");
            res.json({"data":'all good'},200);

        });
    };

});


module.exports = router;