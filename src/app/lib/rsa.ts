/**
 * Module dependencies.
 */
import crypto from 'crypto';
import request from 'request';
import { logger } from '../../logger';
import { HttpError } from '../../types';
import { Response } from 'express-serve-static-core';
import fetch from 'node-fetch';

/**
 * RSA library.
 *
 * Handles key generation, signing, verifying and public key providing.
 */

/** Platform of Trust related definitions. */
import { defaultKeySize, publicKeyURLs } from '../../config/definitions/pot';

/** Optional environment variables. */
let privateKey = process.env.PRIVATE_KEY;
let publicKey = process.env.PUBLIC_KEY;

if (!privateKey || !publicKey) {

  // If RSA keys are not provided by environment variables,
  // they are generated on load with the default key size.

  crypto.generateKeyPair('rsa', {
    modulusLength: defaultKeySize,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem'
    }
  }, (err, pubKey, privKey) => {
    if (!err) {
      privateKey = privKey;
      publicKey = pubKey;
      logger.log('info', 'Generated RSA keys.');
    } else {
      logger.log('error', err.message);
    }
  });
}

/**
 * Sends public key response.
 *
 * @param request
 * @param response
 */
export const sendPublicKey = (request: any, response: Response) => {
  response.setHeader('Content-type', "application/octet-stream");
  response.setHeader('Content-disposition', 'attachment; filename=public.key');
  response.send(publicKey);
};

/**
 * Stringifies body object.
 *
 * @param {Object} body
 * @return {String}
 *   Stringified body.
 */
const stringifyBody = (body: any) => {
  // Sort request body.
  const sortedBody = {
    parameters: {}
  };

  Object.keys(body).sort().forEach(k => {
    sortedBody[k] = body[k]
  });

  if (body.parameters) {
    const sortedParameters = {};
    Object.keys(body.parameters).sort().forEach(function (k) {
      sortedParameters[k] = body.parameters[k]
    });
    sortedBody.parameters = sortedParameters;
  }

  // Return string.
  return JSON.stringify(sortedBody)
    .replace(/[\u007F-\uFFFF]/g, chr => '\\u' + ('0000' + chr.charCodeAt(0)
      .toString(16)).substr(-4)).replace(new RegExp('":', 'g'), '": ');
};

/**
 * Generates signature object for given payload.
 *
 * @param {Object} body
 *   The payload to sign.
 * @param {String} [key]
 *   Private key.
 * @return {Object}
 *   The signature object.
 */
export const generateSignature = (body: any, key?: string) => {
  // Use local private key, if not given.
  if (!key) key = privateKey!;

  // Initialize signature value.
  let signatureValue;

  // Create SHA256 signature in base64 encoded format.
  try {
    signatureValue = crypto
      .createSign('sha256')
      .update(stringifyBody(body))
      .sign({ key, padding: crypto.constants.RSA_PKCS1_PSS_PADDING }, 'base64');
  } catch (err) {
    logger.log('error', err.message);
  }
  return signatureValue;
};

/**
 * Validates signature for given payload.
 *
 * @param {Object} body
 *   Payload to validate.
 * @param {String} signature
 *   Signature to validate.
 * @param {String/Object} publicKey
 *   Public key used for validation.
 * @return {Boolean}
 *   True if signature is valid, false otherwise.
 */
export const verifySignature = async (body: string, signature: string, publicKey: any) => {
  try {
    const response = await fetch(publicKey, {
      headers: {
        'Accept': 'text/plain',
      },
      method: 'GET',
    });
    if (response.status !== 400) {
      const content = await response.text().then(publicKeyRecieved => {
        // Initialize verifier.
        const verifier = crypto.createVerify('sha256');

        // Update verifier.
        verifier.update(stringifyBody(body));

        // Verifies
        return verifier.verify(publicKeyRecieved, signature, 'base64');
      });
    }
  }
  catch (err) {
    logger.log('error', err.message);
  }
};

