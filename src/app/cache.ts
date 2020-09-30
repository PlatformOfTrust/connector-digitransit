/**
 * Module dependencies.
 */
import NodeCache from 'node-cache';

/**
 * Cache.
 *
 * Handles caching operations.
 */
const defaultTTL = 86400; // 24h

// Initialize cache object.
let cache = {
    grants: {cache: new NodeCache()},
    configs: {cache: new NodeCache()},
    templates: {cache: new NodeCache()},
    publicKeys: {cache: new NodeCache()},
    dataProducts: {cache: new NodeCache()},
    measurements: {cache: new NodeCache()}
};

export const getDoc = (collection: string, id: any) => {
    if (cache.hasOwnProperty(collection)) return cache[collection].cache.get(id.toString());
    else return undefined;
};

export const getDocs = (collection: string) => {
    if (Object.hasOwnProperty.call(cache, collection)) {
        let array = [];
        let keys = cache[collection].cache.keys();
        for (let j = 0; j < keys.length; j++) {
            array.push(cache[collection].cache.get(keys[j]));
        }
        return array;
    } else return [];
};

export const setDoc = function (collection: string, id: any, doc: any) {
    doc = JSON.parse(JSON.stringify(doc));
    if (!Object.hasOwnProperty.call(cache, collection)) cache[collection] = {cache: new NodeCache(), TTL: defaultTTL};
    if (cache[collection].TTL) {
        if (Object.hasOwnProperty.call(cache, collection)) cache[collection].cache.set(id, doc, cache[collection].TTL);
    } else {
        if (Object.hasOwnProperty.call(cache, collection)) cache[collection].cache.set(id, doc);
    }
};

export const delDoc = function (collection: string, id: any) {
    if (Object.hasOwnProperty.call(cache, collection)) cache[collection].cache.del(id.toString());
};