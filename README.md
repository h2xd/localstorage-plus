[![Build Status](https://travis-ci.org/SpaceRhino/localstorage-plus.svg?branch=master)](https://travis-ci.org/SpaceRhino/localstorage-plus)
[![Code Climate](https://img.shields.io/codeclimate/github/SpaceRhino/localstorage-plus.svg)]()
[![Code Climate](https://img.shields.io/codeclimate/coverage/github/SpaceRhino/localstorage-plus.svg)]()

# localstorage-plus
Simple helper class for the browsers localStorage implementation



## TODOS

- [x] basic implementation
 - [x] ~get all method~ -> implemented in get, when you call the method w/o a parameter
- [x] test automatisation
- [ ] push to npm registry

## Create instance

```javascript
const Store = require('localstorage-plus');

var foo = new Store(<string:name>);
```

When a new store instace gets created, the constructor will run a flushExpired automaticly.

## Static methods

```javascript
const Store = require('localstorage-plus');

// Removes all localStore entries created by localstorage-plus
Store.flush();

// Removes all expired localStore entries created by localstorage-plus
Store.flushExpired();
```

## Instance methods

```javascript
const Store = require('localstorage-plus');

var userStore = new Store('user');


/**
 * Set a defined key with the given value
 * @param  {string} key          The name of the value
 * @param  {mixed}  data         The data to store, can be any datatype
 * @param  {int}    [expiresAt]  When should this value expire
 * @return {void}
 */
userStore.set('name', 'John Doe');
// set an value with an expire
userStore.set('token', 'secret', Date.now() + 2000);

/**
 * Check if the given key exists in the store
 * @param  {string}  key  index of the value to test
 * @return {boolean}      Key defined or not
 */
userStore.isset('user');  // -> true
userStore.isset('age');   // -> false

/**
 * Get the value stored under the given key, or the whole store
 * @param  {string} [key] Index defined in @set
 * @return {mixed}        Stored value
 */
userStore.get('name');   // -> John Doe

/**
 * Remove an item, by the given key and its expire if set
 * @param  {string} key  Index of the value
 * @return {void}
 */
userStore.remove('name') // entry removed

/**
 * Flush all values, that are stored in the store instance
 * @return {void}
 */
userStore.flush();

/**
 * flush expired values defined in this store
 * @return {void}
 */
userStore.flushExpired();
```
