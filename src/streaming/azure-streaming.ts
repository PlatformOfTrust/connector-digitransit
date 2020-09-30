"use strict";
/**
 * Module dependencies.
 */
import rp from 'request-promise';

/**
 * Azure Service Bus.
 *
 * Broadcasts data to Azure.
 *
 */

/**
 * Sends http request.
 *
 * @param {String} method
 * @param {String} url
 * @param {Object} headers
 * @param {String/Object/Array} body
 * @return {Promise}
 */
async function request(method: any, url: string, headers: any, body: any): Promise<any> {
    const options = {
        method: method,
        uri: url,
        json: true,
        body: body,
        resolveWithFullResponse: true,
        headers: headers
    };

    try {
        const result = await rp(options);
        return await Promise.resolve(result);
    }
    catch (error) {
        return Promise.reject(error);
    }
}

/**
 * Attempts to stream data to Azure.
 *
 * @param {Object} config
 * @param {Object} data
 * @return {Object}
 */
export const stream = async (url: string, data: any) => {
    try {
        // Send data to azure.
        if (url) await request('POST', url, {}, data);
    } catch (err) {
        console.log(err.message);
    }
    return data;
};
