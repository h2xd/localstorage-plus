!(function(window) {
    'use strict';


    // define main constants
    var ROOT       = 'LSP.';
    var STORE      = window.localStorage;
    var EXPIRE_KEY = '--exp';


    /**
     * Util functions
     * @private
     * @type {Object}
     */
    var util = {
        remove: function(key) {
            STORE.removeItem(key.replace(EXPIRE_KEY, ''));
            STORE.removeItem(key);
        },
        flush: function(index) {
            Object.keys(STORE).map(function(key) {
                if (key.indexOf(index) === 0) {
                    util.remove(key);
                }
            });
        },
        flushExpired: function(index) {
            if (Object.keys(STORE).length > 0) {
                Object.keys(STORE).map(function(key) {
                    if (key.indexOf(index) === 0 && key.indexOf(EXPIRE_KEY) !== -1) {
                        if (STORE.getItem(key) < Date.now()) {
                            util.remove(key);
                        }
                    }
                });
            }
        }
    }

    /**
     * Define a new store
     * @class
     * @param  {string} name            The name of the store
     * @param  {boolean} [flushExpired] should the flush expired not run
     * @return {Store}                  The store instance
     */
    var Store = function(name, flushExpired) {
        var storeName;

        function __construct(name) {
            try {
                storeName = validateStoreName(name);

                if (flushExpired === undefined || flushExpired !== false) {
                    flushExpired();
                }
            } catch(error) {
                console.error(error);
            }
        }

        /**
         * Set a defined key with the given value
         * @param  {string} key          The name of the value
         * @param  {mixed}  data         The data to store, can be any datatype
         * @param  {int}    [expiresAt]  When should this value expire
         * @return {void}
         */
        function set(key, data, expiresAt) {
            try {
                if (expiresAt !== undefined && typeof expiresAt === 'number') {
                    STORE.setItem(storeName + key + EXPIRE_KEY, expiresAt.toString());
                }

                STORE.setItem(storeName + key, decodeObjectString(data));

                return true;
            } catch(error) {
                console.error(error);
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
                } else {
                    var resultAll = {};

                    Object.keys(STORE).map(function(key) {
                        if (key.indexOf(storeName) === 0 && key.indexOf(EXPIRE_KEY) === -1) {
                            var varKey = key.replace(storeName, '');
                            resultAll[varKey] = get(varKey);
                        }
                    });

                    return resultAll;
                }
            } catch(error) {
                console.error(error)
                return false;
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
            util.remove(storeName + key);
        }

        /**
         * flush expired values defined in this store
         * @return {void}
         */
        function flushExpired() {
            util.flushExpired(storeName);
        }

        /**
         * generate a store name
         * @param  {string} storeName  The name of the store instance
         * @return {string}            The generated name
         * @throws {TypeError}
         */
        function validateStoreName(storeName) {
            if (storeName === undefined) {
                throw new TypeError('Please provide a storename');
            }

            if (typeof(storeName) !== 'string') {
                throw new TypeError('The storename has to be a string');
            }

            var chargedStoreName = storeName = ROOT + storeName + '-';
            return chargedStoreName;
        }

        /**
         * decode a value if its type is a object
         * @private
         * @param  {mixed}  data  Value to decode
         * @return {mixed}        The decoded value
         */
        function decodeObjectString(data) {
            if (typeof data === 'object') {
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
            if (typeof data === 'string') {
                try {
                    return JSON.parse(data);
                } catch(e) {
                    return data;
                }
            }
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

    // remove the expired values
    Store.flushExpired();

    // export the module
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = Store;
    }

    if (typeof window !== 'undefined' && window) {
        window.Store = Store;
    }
})(window);
