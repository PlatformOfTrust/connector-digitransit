/**
 * REST library.
 *
 * Handles API request composition and response error handling.
 */

/**
 * Returns promise reject with error.
 *
 * @param {Number} [httpStatusCode]
 * @param {String/Object} [msg]
 *   Error message.

 * @return {Promise}
 */
export const promiseRejectWithError = (httpStatusCode: number, message: string) => {
  let error = { httpStatusCode, message };

  return Promise.reject(error);
};

