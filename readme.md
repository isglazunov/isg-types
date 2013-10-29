# isg-types@0.0.1
Free typification built on isg-events module.

## Install

* NPM `npm install isg-types`
* GIT `git clone https://github.com/isglazunov/types.git`
* download from [releases](https://github.com/isglazunov/types/releases)

## Require
Depends on the modules:
* [underscore@1.5.2](https://github.com/jashkenas/underscore)
* [async@0.2.9](https://github.com/caolan/async)
* [isg-events@0.0.12](https://github.com/isglazunov/events)

### Node.js
```js
var isgEvents = require('isg-events')
var isgTypes = require('isg-types');
var Types = isgTypes(require('underscore'), require('async'), isgEvents(require('underscore'), require('async')));
```

### Browser
```html
<script src="isg-events.js"></script>
<script src="isg-types.js"></script>
```
```js
var Events = new isgEvents(_, async);
var Types = new isgTypes(_, async, Events);
```

#### define
```js
define(['./isg-events.js', './isg-types.js'], function(isgEvents, isgTypes){
    var Events = new isgEvents(_, async);
    var Types = new isgTypes(_, async, Events);
});
```

## Usage

### Server typing
Container type described and methods for their descriptions.
```js
var server = new Types.Server;
```
or
```js
var MyServer = function(){};
MyServer.prototype = new Types.Server;
var server = new MyServer;
```

#### server.describe(name, description[, options]);
Description of the types of events are stored as `isg-events` variable in `server._isgTypesEvents`.
The options are passed to the method as [events.on](https://github.com/isglazunov/events#eventsonname-callback-options).
```js
server.describe('user', function(next, client, exports){
    exports.isAdmin = function(){
        return _.indexOf(client.groups, 'admin') !== -1
    };
});
```

### Client typing
The object `client` will have a functional initialized types.
```js
var client = new Types.Client;
```
or
```js
var MyClient = function(){};
MyClient.prototype = new Types.Client;
var client = new MyClient;
```

#### client.initialize([callback]);
Starts the initialization of all types that are contained in the array `client._isgTypes`.
In other words, starts each by name as the event type in the object `server._isgTypesEvents`.
The argument `callback` will be executed after the initialization of all types.
```js
client.initialize(function(types, client, exports){
    console.log('trigger');
});
```

#### client.as(name);
Gets `exports` specified type.
Allows the use of a functional type of an object of `client`.
```js
client.groups = ['admin']
client.as('user').isAdming() // => true;
```

## Versions
### 0.0.1
The basic functionality.
