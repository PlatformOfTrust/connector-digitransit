/**
 * Module dependencies.
 */
import { healthCheck } from '../../../../controllers/status';
import express from 'express';

const router = express.Router();

/**
 * Status routes.
 */
export const healthCheckEndpoint = () => {
  /** Platform of Trust health endpoint. */
  router.get('', healthCheck);

  return router;
};
