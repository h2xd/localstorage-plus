'use strict';


// define main constants
var ROOT       = 'LSA.';
var STORE      = window.localStorage;
var EXPIRE_KEY = '--exp=';


/**
 * Util functions
 * @private
 * @type {Object}
 */
var util = {
    remove: function(key) {
        try {
            STORE.removeItem(key.replace(EXPIRE_KEY, ''));
            STORE.removeItem(key);
        } catch(error) {
            throw error;
        }
    },
    flush: function(index) {
        Object.keys(STORE).map(key => {
            if (key.indexOf(index) === 0) {
                util.remove(key);
            }
        });
    },
    flushExpired: function(index) {
        if (Object.keys(STORE).length > 0) {
            Object.keys(STORE).map(key => {
                if (key.indexOf(index) === 0 && key.indexOf(EXPIRE_KEY) !== -1) {
                    if (parseInt(STORE.getItem(key)) < Date.now()) {
                        util.remove(key);
                    }
                }
            });
        }
    }
}

/**
 * Define a new store
 * @param  {string} name The name of the store
 * @return {Store}       The store instance
 */
var Store = function(name) {
    var storeName;

    function __construct(name) {
        try {
            storeName = validateStoreName(name);
            flushExpired();
        } catch(error) {
            throw error;
        }
    }

    /**
     * Set a defined key with the given value
     * @param {string} key          The name of the value
     * @param {mixed}  data         The data to store, can be any datatype
     * @param {int}    [expiresIn]  When should this value expire
     */
    function set(key, data, expiresIn) {
        try {
            if (expires !== void(0) && typeof expires === 'number') {
                STORE.setItem(storeName + key + EXPIRE_KEY, expiresIn.toString());
            }

            STORE.setItem(storeName + key, decodeObjectString(data));

            return true;
        } catch(error) {
            throw error;
            return false;
        }
    }

    /**
     * Get the value stored under the given key, or the whole store
     * @param  {string} [key] Index defined in @set
     * @return {mixed}        Stored value
     */
    function get(key) {
        try {
            if (key !== undefined) {
                var result = encodeObjectString(STORE.getItem(storeName + key));
                return result !== null ? result : false;
            }
        } catch(error) {
            return false;
            throw error;
        }
    }

    /**
     * Check if the given key exists in the store
     * @param  {string}  key  index of the value to test
     * @return {boolean}      Key defined or not
     */
    function isset(key) {
        return get(key) !== false ? true : false;
    }

    /**
     * Flush all values, that are stored in the store instance
     * @return {void}
     */
    function flush() {
        util.flush(storeName);
    }

    /**
     * Remove an item, by the given key and its expire if set
     * @param  {string} key  Index of the value
     * @return {void}
     */
    function remove(key) {
        util.remove(key);
    }

    /**
     * flush expired values
     * @return {void}
     */
    function flushExpired() {
        util.flushExpired(storeName);
    }

    /**
     * generate a store name
     * @param  {string} storeName  The name of the store instance
     * @return {string}            The generated name
     */
    function validateStoreName(storeName) {
        if (storeName === void(0)) throw new TypeError('Please provide a storename');
        if (typeof(storeName) !== 'string') throw new TypeError('The storename has to be a string');

        return storeName = ROOT + storeName + '-';
    }

    /**
     * decode a value if its type is a object
     * @private
     * @param  {mixed}  data  Value to decode
     * @return {mixed}        The decoded value
     */
    function decodeObjectString(data) {
        if (typeof data == 'object') {
            return JSON.stringify(data);
        }

        return data;
    }

    /**
     * encode a value if the value is a object
     * @param  {mixed} data  The value to encode
     * @return {mixed}       The encoded value
     */
    function encodeObjectString(data) {
        if (typeof data == 'string') {
            return JSON.parse(data);
        }

        return data;
    }

    __construct(name);

    // define public interface
    return {
        set    : set,
        get    : get,
        flush  : flush,
        remove : remove,
        isset  : isset
    }
}

// static store methods

/**
 * remove all items from the whole store
 * @return {void}
 */
Store.flush = function() {
    util.flush(ROOT);
}

/**
 * remove all expired items from the whole store
 * @return {void}
 */
Store.flushExpired = function() {
    util.flushExpired(ROOT);
}

// export the module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Store;
}
