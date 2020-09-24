/**
 * Platform of Trust definitions.
 */

/** Default RSA key size for generated keys. */
export const defaultKeySize = 4096;

/** URLs of Platform of Trust public keys. */
export const publicKeyURLs = [
  /** Primary keys. */
  {
    env: 'static-test',
    url: 'https://static-test.oftrust.net/keys/translator.pub'
  }
];

/** Context URLs. */
export const contextURLs = {
  DataProduct: 'https://standards-ontotest.oftrust.net/v2/Context/DataProductOutput/VehicleInformation/'
};

