var constructor = function(_, Types) {
    return function(){
        var server = new Types.Server;
        
        server.describe("user", function(client, exports){
            exports.isAdmin = function(){
                return true;
            };
        }, {sync: true});
        
        server.describe("user", function(next, client, exports){
            exports.timeout = function(){
                setTimeout(function(){
                    client.timeouted = true;
                }, 100);
            };
            next();
        });
        
        var Client = function(){
            this._isgTypesServer = server;
        };
        Client.prototype = new Types.Client;
        
        var client1 = new Client;
        client1._isgTypes = ["user"];
        client1.initialize(function(client1){
            client1.admined = client1.as("user").isAdmin();
            client1.as("user").timeout();
        });
        setTimeout(function(){
            client1.admined.should.be.true;
            client1.timeouted.should.be.true;
            console.log("done");
        }, 500);
    }
}

if (typeof(define) !== 'undefined' && define.amd) {
    define(["../isg-types.js", "../node_modules/isg-events/isg-events.js"], function (isgTypes, isgEvents) {
        constructor(_, isgTypes(_, async, isgEvents(_, async)))();
    });
} else if(typeof(module) !== 'undefined' && module.exports) {
    var _ = require('underscore');
    var async = require('async');
    var isgEvents = require('isg-events');
    var isgTypes = require('../isg-types.js');
    require('should');
    
    module.exports = constructor(_, isgTypes(_, async, isgEvents(_, async)));
} else {
    constructor(_, isgTypes(_, async, isgEvents(_, async)))();
}