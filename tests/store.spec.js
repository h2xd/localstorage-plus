'use strict';

// setup the headerless localStorage
require('mock-local-storage');
global.window = {
    localStorage: global.localStorage
}

// setup the dependencies
const Store = require('../dist/store.min.js');
const test = require('tape');


// define test variables
var name = 'John Doe';
var age = 33;
var wife = {
    name: 'Jane Doe',
    age: 31
}

var timeout = 2000;


// test the store initialization
test('new Store', assert => {
    assert.plan(1);
    var expected = 'object';

    try {
        var sessionStore = new Store('session');
        var actual = typeof(sessionStore);
        assert.equal(actual, expected, 'Store instance should be created');
    } catch(error) {
        assert.fail(error.message);
    }
});


// test the set method
test('Store.set', assert => {
    var userStore = new Store('userStore');

    assert.plan(3);
    assert.true(userStore.set('name', name));
    assert.true(userStore.set('age', age));
    assert.true(userStore.set('wife', wife));
});

// test the get method
test('Store.get', assert => {
    var userStore = new Store('userStore');

    assert.plan(4);
    assert.equal(userStore.get('name'), name);
    assert.equal(userStore.get('age'), age);
    assert.deepEqual(userStore.get('wife'), wife);
    assert.deepEqual(userStore.get(), {
        name: name,
        age: age,
        wife: wife
    });
});


// test the isset method
test('Store.isset', assert => {
    var userStore = new Store('userStore');

    assert.plan(4);
    assert.true(userStore.get('name'));
    assert.true(userStore.get('age'));
    assert.true(userStore.get('wife'));
    assert.false(userStore.get('randomError'));
});


// test the remove method
test('Store.remove', assert => {
    var userStore = new Store('userStore');

    var expected = 1;

    assert.plan(1);

    userStore.remove('name');
    userStore.remove('age');

    assert.equal(localStorage.length, expected);
});


// test the flush method
test('Store.flush', assert => {
    var otherStore = new Store('otherStore');
    otherStore.set('1', 1);
    otherStore.set('2', 1);
    otherStore.set('3', 1);

    var userStore = new Store('userStore');

    var expected = 3;

    assert.plan(1);

    userStore.flush();

    assert.equal(localStorage.length, expected);
});


// test the statioc flushExpired method
test('<static> Store.flushExpired', assert => {
    var flushStore = new Store('flushStatic');
    var otherStore = new Store('otherFlushStore');

    flushStore.set('1', 1, Date.now() + timeout - 2000);
    flushStore.set('2', 1, Date.now() + timeout - 100);
    flushStore.set('3', 1, Date.now() + timeout - 1000);
    flushStore.set('4', 1, Date.now() + timeout + 6000);

    otherStore.set('1', 1, Date.now() + timeout - 200);
    otherStore.set('2', 1, Date.now() + timeout - 50);
    otherStore.set('3', 1, Date.now() + timeout + 1000);
    otherStore.set('4', 1, Date.now() + timeout + 10000);

    setTimeout(function() {
        assert.plan(2);

        Store.flushExpired();

        assert.equal(Object.keys(flushStore.get()).length, 1);
        assert.equal(Object.keys(otherStore.get()).length, 2);
    }, timeout);
});


// test the static flush method
test('<static> Store.flush', assert => {
    var expected = 0;

    assert.plan(1);

    Store.flush();

    assert.equal(localStorage.length, expected);
});


// the the auto flush method on Store initialization
test('new Store ; auto flush expired values', assert => {
    var flushStore = new Store('flush');
    var expected   = 2;

    flushStore.set('1', 1, Date.now() + timeout - 1000);
    flushStore.set('2', 2, Date.now() + timeout - 100);
    flushStore.set('3', 3, Date.now() + timeout - 50);
    flushStore.set('4', 4, Date.now() + timeout + 1000);
    flushStore.set('5', 5, Date.now() + timeout + 5000);

    setTimeout(function() {
        assert.plan(1);

        var flushStore = new Store('flush');

        assert.equal(Object.keys(flushStore.get()).length, expected);
    }, timeout);
});
