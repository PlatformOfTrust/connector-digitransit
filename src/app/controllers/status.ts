import { Request, Response } from 'express-serve-static-core';

/**
 * Status controller.
 *
 * Mainly used for health check endpoints, but can also add
 * more status endpoints to the API.
 */

/**
 * Returns 200 OK with empty object.
 * Used for health checks.
 *
 * @param {Object} request
 * @param {Object} response
 * @return
 *   Empty response.
 */
export const healthCheck = (request: Request, response: Response) => {
  response.status(200).send({});
};
