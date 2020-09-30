/**
 * Module dependencies.
 */

import express from 'express';
import { PassportStatic } from 'passport';
const router = express.Router();
import { apiRoutes } from './v2';

/**
 * Version routes.
 */
export const v2Endpoints = (passport: PassportStatic) => {
  /** V2 endpoints. */
  router.use('/v2/', apiRoutes(passport));
  return router;
};
