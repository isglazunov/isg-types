// isg-types@0.0.1
// https://github.com/isglazunov/types

(function(factory){
    
    // Version
    factory.VERSION = '0.0.1';
    
    // AMD / RequireJS
    if (typeof(define) !== 'undefined' && define.amd) {
        define(["module"], function (module) {
            module.exports = factory;
        });
    
    // Node.js
    } else if(typeof(module) !== 'undefined' && module.exports) {
        module.exports = factory;
        
    } else { // HTML
        this.isgTypes = factory;
    }
        
}.call(this, function(_, async, Events){
    
    // Prototyping
    var Types = {};
    Types.Server = function(){
        this._isgTypesEvents = new Events
    };
    Types.Server.prototype = new Events;
    
    Types.Server.prototype.describe = function(name, description, options){
        var server = this;
        server.trigger("isg-types:type:describe", [name, description], function(){
            server.trigger("isg-types:type:"+name+":describe", [name, description], function(){
                server._isgTypesEvents.on(name, function(self, next, client, exports){
                    description.apply(client, arguments);
                }, options);
                server.trigger("isg-types:type:described", [name, description], function(){
                    server.trigger("isg-types:type:"+name+":described", [name, description]);
                });
            });
        });
    };
    
    // Array types
    Types.Server.prototype.initialize = function(types, client, exports, callback){
        var server = this;
        server.trigger("isg-types:type:initialize", [types, client, exports], function(){
            async.mapSeries(types, function(type, next) {
                if(!_.isObject(exports[type])) exports[type] = {};
                server.trigger("isg-types:type:"+type+":initialize", [type, client, exports[type]], function(){
                    server._isgTypesEvents.trigger(type, [client, exports[type]], function(){
                        server.trigger("isg-types:type:"+type+":initialized", [type, client, exports[type]], function(){
                            next();
                        });
                    });
                });
            }, function(){
                server.trigger("isg-types:type:initialized", [types, client, exports], function(){
                    if(_.isFunction(callback)) callback(types, client, exports);
                });
            });
        });
    };
    
    Types.Server.prototype.use = function(name, client, exports){
        return exports;
    };
    
    Types.Client = function(){
    	this._isgTypesServer = undefined;
    	this._isgTypes = [];
    	this._isgTypesExports = {};
    };
    Types.Client.prototype = new Events;
    
    Types.Client.prototype.initialize = function(callback){
        if(!_.isObject(this._isgTypesExports)) this._isgTypesExports = {};
        return this._isgTypesServer.initialize(this._isgTypes, this, this._isgTypesExports, function(types, client, exports){
            callback(client);
        });
    };
    
    Types.Client.prototype.as = function(name){
        if(!_.isObject(this._isgTypesExports)) this._isgTypesExports = {};
        return this._isgTypesServer.use(name, this, this._isgTypesExports[name]);
    };
    
    return Types;
    
}));
