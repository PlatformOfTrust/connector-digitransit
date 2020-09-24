/**
 * Module dependencies.
 */
import { promiseRejectWithError } from '../protocols/rest';
import { validate } from './validator';
import fs from 'fs';
import mqtt from 'mqtt';

// Set directories.
const configsDir = './config';

// Make sure directories for templates, protocols, configs and plugins exists.
if (!fs.existsSync(configsDir)) fs.mkdirSync(configsDir);

/**
 * Connector library.
 *
 * Handles data fetching and translation.
 */

/** Import platform of trust definitions. */
import { supportedParameters } from '../../config/definitions/request';
import { TransportationRoute, PotRequest } from '../../types';

/**
 * Consumes described resources.
 *
 * @param {Object} requestBody
 * @return {Array} Data array.
 */
export const translateRequestData = async (requestBody: PotRequest): Promise<TransportationRoute> => {

  /** Parameter validation */
  const validation = validate(requestBody, supportedParameters);
  if (Object.hasOwnProperty.call(validation, 'error')) {
    if (validation.error) return promiseRejectWithError(422, validation.error);
  }

  const { operator, vehicle } = requestBody.parameters;
  const operatorId = operator.idLocal;
  const vehicleId = vehicle.idLocal;

  return await new Promise((resolve, reject) => {
    const mqttClient = mqtt.connect("mqtts://mqtt.hsl.fi:8883/");
  
    mqttClient.on("connect", () => {
      mqttClient.subscribe(`/hfp/v2/journey/ongoing/vp/+/${operatorId}/${vehicleId}/#`);
    });
  
    mqttClient.on("message", (topic, message) => {
      mqttClient.end();
      const digitransitResponse = JSON.parse(message.toString()).VP;
      if (!digitransitResponse) {
        reject("Digitransit returned an invalid response!");
      } else if (!digitransitResponse.long || !digitransitResponse.lat) {
        digitransitResponse.lat = "Undefined";
        digitransitResponse.long = "Undefined";
      }
  
      const transportationRoute = translateData(digitransitResponse.lat, digitransitResponse.long, operatorId, vehicleId);
  
      resolve(transportationRoute);
    });
  });  
};

/**
 * Create a transporation route object that is in the correct format
 * 
 * @param latitude latitude
 * @param longitude longitude
 * @param operator operator
 * @param vehicleNumber vehicle number
 */
export const translateData = (latitude: number, longitude: number, operator: string, vehicleNumber: string): TransportationRoute => {
  return {
    "@type": "TransportationRoute",
    operator: {
      "@type": "Organization",
      idLocal: operator
    },
    vehicle: {
      "@type": "Vehicle",
      idLocal: vehicleNumber,
      location: {
        "@type": "Location",
        latitude: latitude,
        longitude: longitude
      }
    }
  };
}
