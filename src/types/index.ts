import { contextURLs } from "../config/definitions/pot";

export interface HttpError {
  message: string;
  status: number;
}

export interface GreenlockConfig {
  sites: GreenlockSiteConfig[];
}

interface GreenlockSiteConfig {
  subject?: string;
  altnames: (string | undefined)[];
}

const TRANSPORTATION_ROUTE = "TransportationRoute";
type TRANSPORTATION_ROUTE = typeof TRANSPORTATION_ROUTE;

const ORGANIZATION = "Organization";
type ORGANIZATION = typeof ORGANIZATION;

const VEHICLE = "Vehicle";
type VEHICLE = typeof VEHICLE;

const LOCATION = "Location";
type LOCATION = typeof LOCATION;

const DATA_PRODUCT_URL = contextURLs['DataProduct'];
type DATA_PRODUCT_URL = typeof DATA_PRODUCT_URL;

export interface PotRequest {
  parameters: {
    operator: {
      "@type": ORGANIZATION;
      idLocal: string;
    };
    vehicle: {
      "@type": VEHICLE;
      idLocal: string;
    };
  },
  "@context": DATA_PRODUCT_URL;
  timestamp: string;
  productCode: string;
}

export interface TransportationRoute {
  "@type":  TRANSPORTATION_ROUTE,
  operator: {
    "@type": ORGANIZATION;
    idLocal: string;
  },
  vehicle: {
    "@type": VEHICLE;
    idLocal: string;
    location: {
      "@type": LOCATION;
      longitude: number;
      latitude: number;
    },
  }
};