/**
 * Module dependencies.
 */
import { translateRequestData } from '../lib/connector';
import * as rsa from '../lib/rsa';
import moment from 'moment';
import { Request, Response } from 'express-serve-static-core';

/**
 * Translator controller.
 *
 * Handles fetching and returning of the data.
 */

/** Mandatory environment variable. */
let domain = process.env.TRANSLATOR_DOMAIN || "";

/** Formats domain string to a common standart */
const domainFormated = () => {
  const recievedDomain = domain;
  if (recievedDomain.includes("https://")) {
    const newDomain = recievedDomain.replace("https://", "");
    return newDomain;
  } else if (recievedDomain.includes("http://")) {
    const newDomain = recievedDomain.replace("http://", "");
    return newDomain;
  }
  return recievedDomain;
}


/** Import contextURL definitions. */
import { contextURLs } from '../../config/definitions/pot';
import { TransportationRoute } from '../../types';

/**
 * Returns the data to the PoT Broker API
 * based on the parameters sent.
 *
 * @param {Object} request
 * @param {Object} response
 * @return
 *   The translator data.
 */
export const fetchData = async (request: Request, response: Response) => {
  try {
    const result = {
      '@context': contextURLs['DataProduct'],
      'data': {
        'transportationRoute': [] as TransportationRoute[]
      }
    };

    result.data.transportationRoute.push(await translateRequestData(request.body));

    let signature = {
      type: 'RsaSignature2018',
      created: moment().format(),
      creator: `https://${ domainFormated() }/digitransit/translator/v2/public.key`,
    };

    return response.status(200).send({
      ...result,
      signature: {
        ...signature,
        signatureValue: rsa.generateSignature({ ...result, __signed__: signature.created })
      }
    });
  } catch (err) {
    return response.status(err.httpStatusCode || 500).send({
      error: {
        status: err.httpStatusCode || 500,
        message: err.message || 'Internal Server Error.'
      }
    });
  }
};
