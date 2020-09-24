/**
 * Module dependencies.
 */
import cors from 'cors';
import { Express, Request, Response } from 'express-serve-static-core';
import { PassportStatic } from 'passport';
import { v2Endpoints } from './translator';

/**
 * Root routes.
 */
export const appEndpoints = (app: Express, passport: PassportStatic) => {
  /** Include before other routes. */
  app.options('*', cors());

  /** Translator endpoints. */
  app.use('/translator/', v2Endpoints(passport));

  /** Default endpoint. */
  app.use('', function (req, res) {
    return res.status(404).json({
      message: 'Signspace Connector - invalid endpoint.',
    });
  });
};
