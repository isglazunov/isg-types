describe('isg-types', function(){
    it('shoult be equal', function(done){
        var server = new isgTypes.Server;
        
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
        Client.prototype = new isgTypes.Client;
        
        var client1 = new Client;
        client1._isgTypes = ["user"];
        client1.initialize(function(client1){
            client1.admined = client1.as("user").isAdmin();
            client1.as("user").timeout();
        });
        setTimeout(function(){
            client1.admined.should.be.true;
            client1.timeouted.should.be.true;
            done();
        }, 500);
    });
});