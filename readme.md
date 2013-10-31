# isg-types@0.0.2
Free typification built on isg-events module.

## Install

* NPM `npm install isg-types`
* GIT `git clone https://github.com/isglazunov/isg-types.git`
* download from [releases](https://github.com/isglazunov/isg-types/releases)

## Require
Depends on the modules:
* [underscore@1.5.2](https://github.com/jashkenas/underscore)
* [async@0.2.9](https://github.com/caolan/async)
* [isg-events@0.1.0](https://github.com/isglazunov/isg-events)

Indirect dependency
* [isg-connector@0.0.2](https://github.com/isglazunov/isg-connector)

The module can be connected using all supported module [isg-connector@0.0.2](https://github.com/isglazunov/isg-connector) methods.

### window (Browser)
```html
<script src="isg-types.js"></script>
```

### define (AMD/Requirejs)
```js
define(['isg-types.js'], function(isgTypes){});
```

### require (Node.js)
```js
var isgTypes = require('isg-types');
```

## Usage

### Available variables

#### isgTypes.version
Contains the current version of the module.

#### isgTypes.dependencies
Contains links to the required modules.

### Server typing
Container type described and methods for their descriptions.
```js
var server = new isgTypes.Server;
```
or
```js
var MyServer = function(){};
MyServer.prototype = new isgTypes.Server;
var server = new MyServer;
```

#### server.describe(name, description[, options]);
Description of the types of events are stored as `isg-events` variable in `server._isgTypesEvents`.
The options are passed to the method as `events.on`.
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
var client = new isgTypes.Client;
```
or
```js
var MyClient = function(){};
MyClient.prototype = new isgTypes.Client;
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

### 0.0.2
To connect the module used [isg-connector@0.0.2](https://github.com/isglazunov/isg-connector).

### 0.0.1
The basic functionality.
