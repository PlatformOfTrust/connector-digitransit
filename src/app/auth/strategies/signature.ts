import { Strategy } from "passport-strategy";
import { Request } from 'express-serve-static-core';
import util from "util";

const SignatureStrategy = function (this: any, options: any, verify: any) {
  if (typeof options == 'function') {
      verify = options;
      options = {};
  }
  if (!verify) throw new Error('Signature strategy requires a verify callback');

  this._signatureField = options.signatureField || 'x-pot-signature';

  Strategy.call(this);
  this.name = 'signature';
  this._verify = verify;
  this._passReqToCallback = options.passReqToCallback;
} as any as { new (options: any, verify: any): any; };

util.inherits(SignatureStrategy, Strategy);

/**
 * Authenticate request based on the contents of a form submission.
 *
 * @param {Object} req
 * @param {Object} options
 * @api protected
 */
SignatureStrategy.prototype.authenticate = function (request: Request, options: any) {
  options = options || {};
  // Looking for this._signatureField inside both request queries and request bodies.
  let signature = lookup(request.headers, this._signatureField);
  if (!signature) {
      return this.fail(new Error("Missing signature"));
  }

  let self = this;

  function verified(error: any, user: any, info: any) {
      if (error) {
          return self.error(error);
      }
      if (!user) {
          return self.fail(info);
      }
      self.success(user, info);
  }

  if (self._passReqToCallback) {
      this._verify(request, signature, verified);
  } else {
      this._verify(signature, verified);
  }

  function lookup(obj: any, field: any) {
      if (!obj) {
          return null;
      }
      let chain = field.split(']').join('').split('[');
      for (let i = 0, len = chain.length; i < len; i++) {
          let prop = obj[chain[i]];
          if (typeof (prop) === 'undefined') {
              return null;
          }
          if (typeof (prop) !== 'object') {
              return prop;
          }
          obj = prop;
      }
      return null;
  }
};

export default SignatureStrategy;



