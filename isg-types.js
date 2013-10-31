// isg-types@0.0.2
// https://github.com/isglazunov/isg-types

(function(factory){
    
    // isg-connector@0.0.2
    (function(b,constructor,c,d){if(typeof(window)!=='undefined'){var e=[];for(var f in d){e.push(window[d[f]])}this[b]=constructor.apply(null,e)}if(typeof(define)!=='undefined'&&define.amd){var e=['module'];for(var f in c){e.push(c[f])}define(e,function(a){a.exports=constructor.apply(null,[].slice.call(arguments,1))})}if(typeof(module)!=='undefined'&&module.exports&&typeof(require)=='function'){var e=[];for(var f in c){e.push(require(c[f]))}module.exports=constructor.apply(null,e)}return constructor})(
        'isgTypes', factory, ['lodash', 'async', 'isg-events'], ['_', 'async', 'isgEvents']
    );
        
}.call(this, function(_, async, isgEvents){
    var Events = isgEvents.Events;
    
    var isgTypes = {};
    isgTypes.Server = function(){
        this._isgTypesEvents = new Events
    };
    isgTypes.Server.prototype = new Events;
    
    isgTypes.Server.prototype.describe = function(name, description, options){
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
    
    isgTypes.Server.prototype.initialize = function(types, client, exports, callback){
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
    
    isgTypes.Server.prototype.use = function(name, client, exports){
        return exports;
    };
    
    isgTypes.Client = function(){
    	this._isgTypesServer = undefined;
    	this._isgTypes = [];
    	this._isgTypesExports = {};
    };
    isgTypes.Client.prototype = new Events;
    
    isgTypes.Client.prototype.initialize = function(callback){
        if(!_.isObject(this._isgTypesExports)) this._isgTypesExports = {};
        return this._isgTypesServer.initialize(this._isgTypes, this, this._isgTypesExports, function(types, client, exports){
            callback(client);
        });
    };
    
    isgTypes.Client.prototype.as = function(name){
        if(!_.isObject(this._isgTypesExports)) this._isgTypesExports = {};
        return this._isgTypesServer.use(name, this, this._isgTypesExports[name]);
    };
    
    return isgTypes;
    
}));
