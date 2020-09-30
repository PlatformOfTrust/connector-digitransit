# digitransit-connector

Digitransit v2 connector fetches the live location of public transport in Helsinki. It has both request-response and streaming capabilities.


## Getting Started

These instructions will get you a copy of the connector up and running.

### Prerequisites

Start by installing required packages:
```
npm install
```

Mandatory environment variables are:
```
TRANSLATOR_DOMAIN
```

Set environmet variables by executing a container with an ```.env``` file attached like so:
```
docker run -p 8080:8080 --env-file ~/Path/to/.env  metatavu/digitransit:2020-09-30_135500-test
```

Contents of ```.env``` file are the following:
```
MQTT_BROADCASTING_TOPIC=digitransit
MQTT_BROADCASTING_ADDRESS=mqtt://test.mosquitto.org
BROADCAST=BROADCAST
BROADCAST_DESTINATION=[CONSOLE or AZURE]
TRANSLATOR_DOMAIN=[depens on env]
AZURE_URL=[url]
```

### PoT Public Keys

Pot Public Keys can be configured from

```
config/definitions/pot.js
```

## Request body examples

Below are few examples of a Digitransit request body and parameters

```
{
	"parameters": {
		"operator": {
			"idLocal": "0022",
			"@type": "Organization"
		},
		"vehicle": {
			"idLocal": "00876",
			"@type": "Vehicle"
		}
	},
	"@context": "https://standards-ontotest.oftrust.net/v2/Context/DataProductContext/VehicleInformation/",
	"timestamp": "2020-09-28T11:32:00+03:00",
	"productCode": "test"
}
```

## Tests

See /robottests for tests and description.



