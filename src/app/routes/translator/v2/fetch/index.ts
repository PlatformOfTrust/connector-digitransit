"use strict";
/**
 * Module dependencies.
 */
import express from 'express';
import { PassportStatic } from 'passport';
import { fetchData } from '../../../../controllers/translator';

const router = express.Router();


/**
 * Translator routes.
 */
export const translatorEndpoint = (passport: PassportStatic) => {
  /** Signature verification */
  const auth = passport.authenticate(['signature'], { session: false });
  
  /** Platform of Trust fetch endpoint. */
  router.post('', auth, fetchData);

  return router;
};
