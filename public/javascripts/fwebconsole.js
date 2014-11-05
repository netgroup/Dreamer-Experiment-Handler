if (typeof dreamer === 'undefined') {
    var dreamer = {};
}

dreamer.Fwc = (function(global) {
    'use strict';
    var timeout = 5000;
    var ws;
    var cmdHistory = [];
    var _channel;
    var _div;
    var _termoutput;
    var _cmd;
    var _clipboard;
    var _cursor;

    function Fwc(div, channel) {
        _div = div;
        _channel = channel;
        _termoutput = "terminal-output-" + _channel;
        _cmd = "cmd-" + _channel;
        _clipboard = "clipboard-" + _channel;
        _cursor = "#cursore";
        initTerminalOutput();
        initPromtLine();
        initWebSocket();
        initListeners();

    }

    function sendCmd(cmd, invisible) {
        if (cmd == 'clear') {
            //TODO aggiungere righe vuote e scalare
            //$('#log').html('');
            return;
        }
        try {

            if(invisible == undefined || invisible == false){
              cmdHistory.push(cmd);
              $('#' + _termoutput).append("<div style=\"width: 100%; visibility: visible;\"> >  " + cmd + "</div>");
            }
            ws.emit('cmd', cmd)
        } catch (err) {
            console.log(err);

        }
    }

    function initPromtLine() {
        $(_div).append("<div class=\"cmd\" id=\"" + _cmd + "\" style=\"width: 100%; visibility: visible;\"><span class=\"prompt\">&gt;&nbsp;</span><span></span><span id=\"cursore\" class=\"cursor blink\">&nbsp;</span><span></span><textarea class='clipboard' id=\"" + _clipboard + "\" ></textarea></div>");
    }

    function initTerminalOutput() {
        $(_div).append("<div class='terminal-output' id=\"" + _termoutput + "\"></div>");
        
    }

    function initListeners() {
        
        $("#" + _clipboard).keypress(function(e) {
            console.log(e);
            if (e.keyCode != 13) {


                return;
            }
            else if(e.ctrlKey==true && e.charCode == 99){
                console.log("CTRL+C")
                sendCtrC();
            }
            else{
              var cmd = $("#" + _clipboard).val().replace("\n", "");
              if (!isBlank(cmd)) {
                sendCmd(cmd);
              }
              $("#" + _clipboard).val("");
            }
            
        });
        $("#" + _clipboard).bind('copy', function(e) {
            console.log("CTRL+C")
            e.preventDefault();
            sendCtrC();
        });
        $("#" + _clipboard).bind('cut', function(e) {
            console.log("CTRL+X")
            e.preventDefault();
        });
        $("#" + _clipboard).bind('undo', function(e) {
            console.log("CTRL+Z");
            e.preventDefault();
        });
        $("#" + _clipboard).blur(function() {
            console.log("BLURR");
           toggleCursor(false);
        });

        $(_div).click(function(e) {
            toggleCursor(true);
            $("#" + _clipboard).focus();
            return false;
        }); 

        
        
    }

    function toggleCursor(selected){
        if(selected){
            $(_cursor).addClass("blink");
        }else{
            $(_cursor).removeClass('blink');
        }
    }


    function sendCtrC(){
        sendCmd("\\x03", true);
    }
    function toStaticHTML(data) {
        data = data.toString();
        return data.replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace("/n", "<br/>")
            .replace(/>/g, "&gt;");
    }

    function isBlank(text) {
        var blank = /^\s*$/;
        return (text.match(blank) !== null);
    }

    function initWebSocket() {
        ws = io.connect('/');
        ws.on('connect', function() {
            console.log('connected to server');
        });
        ws.on('cmd_res', function(data) {

            var rows = data.split('\n');
            for (var r in rows) {
                console.log(rows[r]);
                $("#" + _termoutput).append("<div style=\"width: 100%; visibility: visible;\">" + toStaticHTML(rows[r]) + "</div>");
            }

            window.scrollBy(0, 100000000000000000);
        });
        ws.on('disconnect', function() {
            //TODO
        });
    }

    Fwc.prototype.prova = function() {

    };


    return Fwc;
}());

if (typeof module === 'object') {
    module.exports = dreamer.Fwc;
}


$(document).ready(function() {
    var prova = new dreamer.Fwc('#wfconsole', 'prova');
});