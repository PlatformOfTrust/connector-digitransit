/**
 * Module dependencies.
 */
import * as cache from '../cache';
import * as rsa from '../lib/rsa';
import SignatureStrategy from './strategies/signature';
import { Request } from 'express-serve-static-core';
import { publicKeyURLs } from '../../config/definitions/pot';

/**
 * Passport authentication configurations.
 *
 * Configures strategies, which are extensible set of plugins.
 */

/** Import Platform of Trust definitions. */
import { supportedHeaders } from '../../config/definitions/request';
import { PassportStatic } from 'passport';
import express from 'express';

/**
 * Extracts identity id from token.
 *
 *   User or app id.
 */
const extractId = function (token: string) {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString('binary')).sub
};

/**
 * Expose passport configurations.
 */
const passportInit = (passport: PassportStatic) => {
    /**
     * Configures passport signature strategy.
     */
    passport.use('signature', new SignatureStrategy({
            passReqToCallback: true
        },
        function (request: Request, signature: any, done: any) {
            /** Header validation */
            for (let header in supportedHeaders) {
                if (Object.hasOwnProperty.call(supportedHeaders, header)) {
                    if (!Object.hasOwnProperty.call(request.headers, header)) {
                        if (supportedHeaders[header].required) return done(null, false, { message: 'Missing required header ' + header });
                    }
                }
            }

            /** Signature validation */
            let verified = false;
            let environment;
            let publicKeys = (publicKeyURLs || []).sort((a: any, b: any) => (a.priority > b.priority) ? 1 : -1);

            for (let i = 0; i < publicKeys.length; i++) {
                if (verified) continue;
                if (rsa.verifySignature(request.body, signature, publicKeys[i].url)) {
                    verified = true;
                    environment = publicKeys[i].env;
                }
            }

            if (!verified || typeof request.headers['x-app-token'] != "string" ) return done(null, false, { message: 'Signature validation failed' });

            /*
            let user = {
                '@id': extractId(req.headers['x-user-token'])
            };
             */

            let app = {
                '@id': extractId(request.headers['x-app-token'])
            };

            // Attach identity details and additional info.
            return done(null, app, {
                environment,
                scope: '*'
            });
        }
    ));
};

export default passportInit;