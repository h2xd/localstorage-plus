[![Build Status](https://travis-ci.org/SpaceRhino/localstorage-plus.svg?branch=master)](https://travis-ci.org/SpaceRhino/localstorage-plus)
[![Code Climate](https://img.shields.io/codeclimate/github/SpaceRhino/localstorage-plus.svg)]()
[![npm](https://img.shields.io/npm/v/localstorage-plus.svg)](https://www.npmjs.com/package/localstorage-plus)
<!-- [![Code Climate](https://img.shields.io/codeclimate/coverage/github/SpaceRhino/localstorage-plus.svg)]() -->

# localstorage-plus
Simple helper class that extends the localStorage implementation

# Contents

<!-- TOC depthFrom:2 depthTo:6 withLinks:1 updateOnSave:1 orderedList:0 -->

- [Getting started](#getting-started)
- [Documentation](#documentation)
	- [Initialize a Store](#initialize-a-store)
		- [Suppress auto expiredFlush on creation](#suppress-auto-expiredflush-on-creation)
	- [Static methods](#static-methods)
		- [Store.flush](#storeflush)
		- [Store.flushExpired](#storeflushexpired)
	- [Instance methods](#instance-methods)
		- [Store#set](#storeset)
		- [Store#isset](#storeisset)
		- [Store#get](#storeget)
		- [Store#remove](#storeremove)
		- [Store#flush](#storeflush)
		- [Store#flushExpired](#storeflushexpired)
- [Test](#test)

<!-- /TOC -->

## Getting started

Download via npm.

```
npm install localstorage-plus --save-dev
```

You can also download the project and include the `store.min.js` file into your HTML-Document

```
<html>
    <head>
        ...
    </head>
    <body>
        ...

        <script src="/path/to/store.min.js" type="text/javascript"></script>
        <script src="/path/to/your/app.js" type="text/javascript"></script>
    </body>
</html>
```

## Documentation

### Initialize a Store


| param        | type    | flag    | description                       |
|:-------------|:--------|:--------|:----------------------------------|
| name         | string  |         | The name of the store             |
| flushExpired | boolean | optinal | run auto flush for expired values |

```javascript
var Store = require('localstorage-plus');

var UserStore = new Store('user')
```

_If you are using the `<script>` way, the `Store` will be applied to the `window` object._


#### Suppress auto expiredFlush on creation

When a new Store instace gets created, the constructor will run the flushExpired method automaticly, accept your provide a boolean as the second parameter like so:

```javascript
var UserStore = new Store('UserStore', false);
```

### Static methods

#### Store.flush

Removes all Store entries

*return: void*

```javascript
var Store = require('localstorage-plus');

Store.flush();
```

#### Store.flushExpired

Removes all expired Store entries

*return: void*

```javascript
Store.flushExpired();
```

### Instance methods

#### Store#set

Set a key with the value to store

| param     | type    | flag     | description                   |
|:----------|:--------|:---------|:------------------------------|
| key       | string  |          | The name of the value         |
| data      | mixed   |          | The data to store             |
| expiresAt | integer | optional | When should this value expire |

*return: boolean*

```javascript
var Store = require('localstorage-plus');

var UserStore = new Store('user');

UserStore.set('name', 'John Doe');                   // -> true
UserStore.set('wife', 'Jane Doe');                   // -> true

// set a value with an expire date (2s)
UserStore.set('token', 'secret', Date.now() + 2000); // -> true
```

#### Store#isset

Check if the given key exists

| param | type   | description                           |
|:------|:-------|:--------------------------------------|
| key   | string | Key defined in [Store.set](#storeset) |

*return: boolean*

```javascript
var Store = require('localstorage-plus');

var UserStore = new Store('user');

UserStore.isset('user');  // -> true
UserStore.isset('age');   // -> false
```

#### Store#get

Get the value stored under the given key, or the whole store

| param | type   | flag     | description                            |
|:------|:-------|:---------|:---------------------------------------|
| key   | string | optional | Key defined in [Store.set](#storeset)  |

*return: object, mixed*

```javascript
var Store = require('localstorage-plus');

var UserStore = new Store('user');

UserStore.get('name');   // -> John Doe
UserStore.get();         // -> { name: 'John Doe', wife: 'Jane Doe' }
```


#### Store#remove

Remove an item

| param | type   | description                           |
|:------|:-------|:--------------------------------------|
| key   | string | Key defined in [Store.set](#storeset) |

*return: boolean*

```javascript
var Store = require('localstorage-plus');

var UserStore = new Store('user');

UserStore.remove('name') // -> true
```

#### Store#flush

Flush all values, that are stored in the `Store` instance

*return: void*

```javascript
var Store = require('localstorage-plus');

var UserStore = new Store('user');

UserStore.flush();
```

#### Store#flushExpired

Flush expired values defined in this store

*return: void*

```javascript
var Store = require('localstorage-plus');

var UserStore = new Store('user');

UserStore.flushExpired();
```

## Test

To run a test just enter the following command

```
npm run test
```
