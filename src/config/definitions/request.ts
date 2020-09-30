/**
 * Broker request definitions.
 */

/** List of definitions. */
export const definitions = {   
  /** Header */
  SIGNATURE: 'x-pot-signature',
  APP_TOKEN: 'x-app-token',
  USER_TOKEN: 'x-user-token',

  /** Body */
  PARAMETERS: 'parameters',
  CONTEXT: '@context',
  PRODUCT_CODE: "productCode",
  TIMESTAMP: 'timestamp',

  /** Digitransit specifc body parameters */
  OPERATOR: 'parameters.operator',
  VEHICLE: 'parameters.vehicle',
  OPERATOR_TYPE: 'parameters.operator.@type',
  OPERATOR_ID: 'parameters.operator.idLocal',
  VEHICLE_TYPE: 'parameters.vehicle.@type',
  VEHICLE_ID: 'parameters.vehicle.idLocal'

};

/** List of supported headers, and if they're required or not. */
export const supportedHeaders = {
  [definitions.SIGNATURE]: {
      required: true
  },
  [definitions.APP_TOKEN]: {
      required: true
  },
  [definitions.USER_TOKEN]: {
      required: false
  }
};

/** List of supported parameters, and if they're required or not. */
export const supportedParameters = {
  [definitions.PRODUCT_CODE]: {
    required: true
  },
  [definitions.CONTEXT]: {
    required: false
  },
  [definitions.TIMESTAMP]: {
    required: true
  },
  [definitions.PARAMETERS]: {
    required: true
  },
  [definitions.OPERATOR]: {
    required: true
  },
  [definitions.VEHICLE]: {
    required: true
  },
  [definitions.OPERATOR_ID]: {
    required: true
  },
  [definitions.VEHICLE_ID]: {
    required: true
  },
  [definitions.OPERATOR_TYPE]: {
    required: true
  },
  [definitions.VEHICLE_TYPE]: {
    required: true
  }
};
